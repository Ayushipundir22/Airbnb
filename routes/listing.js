const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");
const multer = require("multer");
const {storage} = require ("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listings.js");

//  "../" means going in Parent Directory

// validate listing
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// router.route

router
  .route("/") 
  .get(wrapAsync(listingController.index)) //index route
  .post( isLoggedIn, 
    // validateListing, 
    upload.single("listing[image]"), 
    wrapAsync(listingController.createListing)); //create/post rt.

// 2) New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.newForm));

router
  .route("/:id")
  .get(wrapAsync(listingController.showListings)) //show
  .put(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing)) //update
  .delete(isLoggedIn, wrapAsync(listingController.destroyListing)); //delete

//5) Edit Route
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing));

module.exports = router;
