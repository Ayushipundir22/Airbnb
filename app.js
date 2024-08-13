// using app.js for actually combining two modules (listing + review)

// here major work like error handling , starting a server and making connection with db  are taking place.
// other works are in small small capsules and we are merging them here

if(process.env.NODE_ENV != "production") {
    require('dotenv').config()
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const Mongo_URL = "mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const expressSession = require("express-session");
const MongoStore = require ("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



// app.get("/", (req,res) => {
//     res.send("Hi, I am root");
// });

// in our mongo session is expired after 14 days period. if user doesn't login in 14 days they'll be logged out.
// mongo store
const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24 * 3600, //after how much time session shud be updated. I set it to 24h(val in sec)
  });

  store.on("error" , ()=> {
    console.log("ERROR IN MONGO SESSION STORE", err);
  })

// Express Session
const sessionOptions = {
   store : store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, //for security purposes (for preventing cross-scripting attacks)
    }
  };


app.use(expressSession(sessionOptions));
app.use(flash()); //use flash before routes for it to work with routes

// passport stratergy
app.use(passport.initialize()); //initialize passport before a request
app.use(passport.session()); //so that we don't have to login again and again from page to page
passport.use(new LocalStratergy(User.authenticate())); //we should use LocalStratergy in order to authenticate(login/signup) user by using authenticate func. (static func. by passport-local-mongoose)

passport.serializeUser(User.serializeUser()); //saving info for session after login is serialize
passport.deserializeUser(User.deserializeUser()); //unsaving info after session is deserialize


// middleware for flash
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

// Demo user for checking the working of passport
// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email : "nish@gmail.com",
//         username : "Nish"
//     });

//     const registerdUser = await User.register(fakeUser, "helloWorld"); //register() func. will register a user with the given pswd and it will also check if the username is unique or not
//     res.send(registerdUser);
// })



main()
.then(()=> {
    console.log("connected to DB");
}) .catch((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
app.use('/data', express.static('data'));
app.use(express.urlencoded({extended : true})); //to parse req.body data

// validate listing
// const validateListing = (req,res,next) => {
//     let {error} = listingSchema.validate(req.body);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);
//     } else {
//         next();
//     }
// }

// validate review 
// const validateReview = (req,res,next) => {
//     let {error} = reviewSchema.validate(req.body);
//     if(error) {
//         let errMsg = error.details.map((el) => el.message).join(",");
//     throw new ExpressError(400,errMsg);
//     } else {
//         next();
//     }
// }

app.use("/listings", listingRouter);  //Restructuring listings (use listingRouter)
app.use("/listings/:id/reviews", reviewRouter) //Restructuring Reviews (use reviewRouter)
app.use("/", userRouter);  //(use userRouter)


// "ctrl + shift + p => (got to) transform (for upper & lowercase)"
// {CODE OF LISTING AND REVIEW ROUTE WAS HERE.}


// // 8) Reviews Route
//     //  post review route
// app.post("/listings/:id/reviews",validateReview, wrapAsync(async(req,res) => {  // (make joi a midddleware)
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.reviews);

//     listing.reviews.push(newReview);

//     await newReview.save();
//     await listing.save();

//     console.log("new review comment = ", newReview.comment);
//     console.log("new review rating = ", newReview.rating);
//     // res.send("new rev saved");
    
//     res.redirect(`/listings/${listing._id}`);
// }));


// // Delete Review Route
// app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res) => {
//     let {id , reviewId} = req.params;

//     await Listing.findByIdAndUpdate(id, {pull : {reviews : reviewId}}); //using pull operator
//     // we will update the review array by deleting the particular review.
//     await Review.findById(reviewId);

//     res.redirect(`/listings/${id}`);
// }))


// app.get("/testListing", async (req,res) => {
//     let sampleListing = new Listing ({
//         title : "my new villa",
//         description : "By the Beach",
//         price : 1200,
//         location : "Calangute,Goa",
//         country : "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("Successful testing");
// });


// if sent request to a page/route that doesn't exist.
app.use("*", (req,res,next) => {
    next(new ExpressError(404, "page not found!"));
});

// custom error handler
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "Something went wrong!"} = err;
    //res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
    //res.send("Something went wrong!");
})

app.listen(port, ()=> {
    console.log(`app is listening at port ${port}`);
})