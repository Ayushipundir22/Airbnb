const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing : Joi.object({
        title : Joi.string().required(),
        description : Joi.string().required(),
        price : Joi.number().required().min(1), //min(0) => so that no. can't be -ve
        country : Joi.string().required(),
        location : Joi.string().required(),
        image : Joi.string().allow("", null) //image can be empty or null
    }).required()
});

// review schema
module.exports.reviewSchema = Joi.object({
    review : Joi.object ({
        rating : Joi.number().required().min(1).max(5),
        comment : Joi.string().required()
    }).required()
})