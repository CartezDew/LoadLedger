import express from "express";
import User from "../models/user.js";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";

const router = express.Router();

//helper function

async function getNextAvailableLoadNumber(user) {
  // Extract only numbers from loadNumbers like 'LL-001'
  const existingNumbers = user.loads
    .map(load => {
      const match = load.loadNumber && load.loadNumber.match(/LL-(\d+)/);
      return match ? parseInt(match[1]) : null;
    })
    .filter(num => num !== null);

  let next = 1;
  while (existingNumbers.includes(next)) {
    next++;
  }

  return `LL-${next.toString().padStart(3, '0')}`; // LL-001, LL-002, etc.
}



router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user);

    res.render("loads/index.ejs", {
      user: req.session.user,
      loads: user.loads,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});


router.get("/new", (req, res) => {
  try {
    res.render("loads/new.ejs", { user: req.session.user });
  } catch (error) {
    console.error(error);
  }
});

// POST
router.post("/", async (req, res) => {
  try {
    const {
      brokerName,
      confirmationNumber,
      pickupDate,
      pickupLocation,
      deliveryDate,
      deliveryLocation,
      rate,
      paymentStatus,
      contactedDate,
      invoiced,
      invoicedDate,
      pmtTerms,
      notes,
    } = req.body;

    const user = await User.findById(req.session.user._id);
    const loadNumber = await getNextAvailableLoadNumber(user); //Auto-generate a unique load number
    
    user.loads.push({
      brokerName, 
      loadNumber,
      confirmationNumber,
      pickupDate,
      pickupLocation,
      deliveryDate,
      deliveryLocation,
      rate,
      paymentStatus,
      contactedDate,
      invoiced,
      invoicedDate,
      pmtTerms,
      notes,
    });
    console.log('Form data:', req.body)
    await user.save();
    // Redirect the user to the /users/userId/applications
    res.redirect(`/users/${req.session.user._id}/loads`);
  } catch (error) {
    console.error(error);
    res.send("There was an error creating the load.");
  }
});

// PUT
router.get("/:itemId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const load = user.loads.id(req.params.itemId);
    res.render("loads/edit.ejs", { user: req.session.user, load: load });
  } catch (error) {
    console.error(error);
  }
});

router.put('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const load = user.loads.id(req.params.itemId);

    const {
      brokerName,
      loadNumber,
      confirmationNumber,
      pickupDate,
      pickupLocation,
      deliveryDate,
      deliveryLocation,
      rate,
      paymentStatus,
      contactedDate,
      invoiced,
      invoicedDate,
      pmtTerms,
      notes,
    } = req.body;
 
    if (!load) throw new Error('Load not found');

    load.brokerName = brokerName
    load.loadNumber = loadNumber
    load.confirmationNumber = confirmationNumber
    load.pickupDate = pickupDate
    load.pickupLocation = pickupLocation
    load.deliveryDate = deliveryDate
    load.deliveryLocation = deliveryLocation
    load.rate = rate
    load.paymentStatus = paymentStatus
    load.contactedDate = contactedDate
    load.invoiced = invoiced
    load.invoicedDate = invoicedDate
    load.pmtTerms = pmtTerms
    load.notes = notes
     

    await user.save();

    res.redirect(`/users/${req.session.user._id}/loads`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});


// DELETE

router.delete('/:itemId', async (req, res) => {
  try {
    const user = await User.findById(req.session.user);
    const load = user.loads.id(req.params.itemId)
    console.log(load)
    load.deleteOne();
    await user.save();
    res.redirect(`/users/${user._id}/loads`);
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

// EXPORT TO EXCEL
router.get("/export/excel", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Loads");

    sheet.columns = [
      { header: "Load #", key: "loadNumber" },
      { header: "Broker", key: "brokerName" },
      { header: "Confirmation #", key: "confirmationNumber" },
      { header: "Pickup Date", key: "pickupDate" },
      { header: "Pickup Location", key: "pickupLocation" },
      { header: "Delivery Date", key: "deliveryDate" },
      { header: "Delivery Location", key: "deliveryLocation" },
      { header: "Rate", key: "rate" },
      { header: "Payment Status", key: "paymentStatus" },
      { header: "Contacted", key: "contactedDate" },
      { header: "Invoiced", key: "invoiced" },
      { header: "Invoiced Date", key: "invoicedDate" },
      { header: "PMT Due", key: "pmtTerms" },
      { header: "Notes", key: "notes" },
    ];

    user.loads.forEach(load => {
      sheet.addRow({
        ...load.toObject(),
        pickupDate: load.pickupDate?.toISOString().split("T")[0],
        deliveryDate: load.deliveryDate?.toISOString().split("T")[0],
        contactedDate: load.contactedDate?.toISOString().split("T")[0],
        invoicedDate: load.invoicedDate?.toISOString().split("T")[0],
        pmtTerms: load.pmtTerms?.toISOString().split("T")[0],
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=loads.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to export Excel.");
  }
});

// EXPORT TO PDF
router.get("/export/pdf", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const doc = new PDFDocument();

    res.setHeader("Content-Disposition", "attachment; filename=loads.pdf");
    res.setHeader("Content-Type", "application/pdf");
    doc.pipe(res);

    doc.fontSize(18).text(`${user.username}'s Loads`, { underline: true });
    doc.moveDown();

    user.loads.forEach(load => {
      doc.fontSize(12)
        .text(`Load #: ${load.loadNumber} | Broker: ${load.brokerName}`)
        .text(`Confirmation #: ${load.confirmationNumber}`)
        .text(`Pickup: ${load.pickupLocation} on ${load.pickupDate?.toISOString().split("T")[0]}`)
        .text(`Delivery: ${load.deliveryLocation} on ${load.deliveryDate?.toISOString().split("T")[0]}`)
        .text(`Rate: $${load.rate}`)
        .text(`Payment Status: ${load.paymentStatus === 'notPaid' ? 'Not Paid' : 'Paid'}`)
        .text(`Contacted: ${load.contactedDate?.toISOString().split("T")[0] || ''}`)
        .text(`Invoiced: ${load.invoiced}`)
        .text(`Invoiced Date: ${load.invoicedDate?.toISOString().split("T")[0] || ''}`)
        .text(`Payment Due: ${load.pmtTerms?.toISOString().split("T")[0] || ''}`)
        .text(`Notes: ${load.notes}`)
        .moveDown();
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to export PDF.");
  }
});

export default router;
     