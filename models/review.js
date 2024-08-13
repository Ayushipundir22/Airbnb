const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    Comment : String,
    rating : {
        type : Number,
        min : 1,
        max : 5,
    },
    createdAt : {
        type : Date,
        default : Date.now(), //to set a default date if no date is given 
    },
});

module.exports = mongoose.model("Review", reviewSchema);