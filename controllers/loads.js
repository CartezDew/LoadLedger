import express from "express";
import User from "../models/user.js";

const router = express.Router();


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
      loadNumber,
      confirmationNumber,
      pickupDate,
      pickupLocation,
      deliveryDate,
      deliveryLocation,
      rate,
      paymentStatus,
      contactedDate,
      notes,
    } = req.body;

    const user = await User.findById(req.session.user._id);

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
      notes,
    });
    console.log('Form data:', req.body)
    await user.save();
    // Redirect the user to the /users/userId/applications
    res.redirect(`/users/${req.session.user._id}/loads`);
  } catch (error) {
    console.error(error);
    res.send("There was an error creating the menu.");
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



export default router;
     