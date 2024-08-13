const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    // passport-local-mongoose automatically implements username and pswd(hashed & salt value). so we don't have to.
    email : {
        type : String,
        required : true
    }
})

// we passed it as a plugin because it implements pswd,hashing,salting,hash-pswd. 
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);