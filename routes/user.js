const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
router.use(express.urlencoded({ extended: true }));
const flash = require("connect-flash");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");
// const User = require("../models/user.js");

router.use(flash());

router.route("/signup")
.get(userController.renderSignupForm) //signup form
.post(wrapAsync(userController.signup)) //save user in db. (signup on wanderlust)

router.route("/login")
.get(userController.renderLoginForm) //login form
.post(saveRedirectUrl,              // login     
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true, //if user is unable to login bcuz of some reason then a failure flash will appear
  }),
  userController.login
);

// logout
router.get("/logout", userController.logout);

module.exports = router;