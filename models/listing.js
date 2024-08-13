const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { string } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image : {
    url : String,
    filename : String,
  },

  price: Number,

  location: String,

  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {          //associating owner for authorization
    type: Schema.Types.ObjectId,
    ref: "User", //owner shud be a registered user on our website so reference is "User"
  },

  geometry : {
    type : {
      type : String,
      enum : ['Point'], //location.type must be a point
      required : true
    },
    coordinates : {
      type : [Number],
      required : true
    }
  },

  category : {
    type : String,
    enum : ["Mountains", "Farms", "Arctic", "Camping"]

  }
});

// "post mongoose middleware" for deleting all reviews related to an listing. If listing is deleted all the associated reviews will also be deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; 
