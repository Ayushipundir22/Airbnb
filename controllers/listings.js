const Listing = require ("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding ({ accessToken: mapToken });

// index/root route
module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listingss/index.ejs", {allListings});
    }

    // new route
    module.exports.newForm = async (req,res) => {
        res.render("listingss/new.ejs");
    }

    // show route
    module.exports.showListings = async (req,res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner"); //populate will give information of owner and review
        if(!listing) {
        req.flash("error", "Listing you requested for doesn't exist"); //if deleted redirect to listing
            res.redirect("/listings");
        }
        console.log(listing);
        res.render("listingss/show.ejs", {listing});
    }
  

    // create Listing
    module.exports.createListing = async (req,res, next) => { 

         let response = await geocodingClient
         .forwardGeocode ({
            query : req.body.listing.location,
            limit : 1
        })
        .send();
        
        console.log(response.body.features[0].geometry);
        res.send("Done!");

    
        let url = req.file.path;
        let filename = req.file.filename;
        // let {title,description,image,price,location,country} = req.body;
        // if(!req.body.listing) { //if we didn't send valid data for listing then this error will occur
        //     throw new ExpressError(400, "send valid data");
        // }
       const newListing =  new Listing(req.body.listing); //added a new Listing
       newListing.image = {url, filename};
       newListing.owner = req.user._id;
       newListing.geometry = response.body.features[0].geometry
       let savedListing = await newListing.save();
       console.log(savedListing);
       req.flash("success", "added new Listing");
       res.redirect("/listings");
    //    next(err);
    }

    // edit route
    module.exports.editListing = async(req,res) => {
        let { id } = req.params;  //find Listing
        const listing = await Listing.findById(id);
        if(!listing) {
            req.flash("error", "Listing you requested for doesn't exist"); //if deleted redirect to listing rather then to the edit page of deleted listing and throwing error
                res.redirect("/listings");
            }
        res.render("listingss/edit.ejs", {listing});
    }

    // update 
    module.exports.updateListing = async(req,res) => {
        let { id } = req.params;
       let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstruct

       if(typeof req.file !== "undefined") { //check if doesn't exist & then update
       let url = req.file.path; 
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
       }

       req.flash("success", "Listing Updated");
       res.redirect(`/listings/${id}`); //redirect on show page
    }

    // destroy 
    module.exports.destroyListing = async(req,res) => {
        let { id } = req.params;
       let deletedListing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //deconstruct
       console.log(deletedListing)
       req.flash("success", "Listing deleted");
       res.redirect(`/listings`); //redirect on show page
    };