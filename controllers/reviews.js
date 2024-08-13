const Listing = require ("../models/listing")
const Review = require("../models/review");

module.exports.createReview = async(req,res) => {  // (make joi a midddleware)
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.reviews);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review comment = ", newReview.comment);
    console.log("new review rating = ", newReview.rating);
    // res.send("new rev saved");
    req.flash("success", "New Review Created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req,res) => {
    let {id , reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {pull : {reviews : reviewId}}); //using pull operator
    // we will update the review array by deleting the particular review.
    await Review.findById(reviewId);

    req.flash("success", "Review Deleted");
    res.redirect(`/listings/${id}`);
}