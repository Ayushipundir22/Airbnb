// Logic of initialisation

const mongoose = require("mongoose"); 
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(()=> {
    console.log("connected to DB");
}) .catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(Mongo_URL);
}

const initDB = async() => {
    await Listing.deleteMany({}); //clean DB
    initData.data = initData.data.map((obj)=> ({...obj, owner : "65e3710af1a3109a386e0985"})); //inserting new "owner" property. (map fn.) creates new array and will add this property in that and will not do changes in existing one.
    await Listing.insertMany(initData.data); //insert data in db
    console.log("Data was initialized");
};

initDB();