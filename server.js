import dotenv from "dotenv";
dotenv.config();
import methodOverride from "method-override";
import morgan from "morgan";
import session from "express-session";
import express from "express";

import authController from "./controllers/users.js";
import loadsController from "./controllers/loads.js";
import { isSignedIn } from "./middleware/isSignedIn.js";
import { passUserToView } from "./middleware/passUserToView.js";

import "./db/connection.js";

const app = express();
const port = process.env.PORT ? process.env.PORT : "3000";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passUserToView);

app.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect(`users/${req.session.user._id}/loads`);
  } else {
    res.render("index.ejs", {
      user: req.session.user,
    });
  }
});

//Controllers
app.use("/auth", authController);
app.use(isSignedIn);
app.use("/users/:userId/loads", loadsController);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
