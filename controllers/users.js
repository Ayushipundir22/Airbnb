const User = require("../models/user");

// render signup form
module.exports.renderSignupForm = (req, res) => {
res.render("users/signup.ejs");
}

// post route for signup
module.exports.signup = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      const registerdUser = await User.register(newUser, password);
      console.log(registerdUser); 
      req.login(registerdUser, (err) => { //to auto. login registeredUser after signup
        if(err) {
          return next(err);
        }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
      })
    } catch (e) {
      console.log("error msg : ", e.message);
      req.flash("error", e.message);
      res.redirect("/signup");
    }}

    //render login form
    module.exports.renderLoginForm = (req, res) => {
        res.render("users/login.ejs");
      } 

    //   login
      module.exports.login = async (req, res) => {
        //passport.authenticate is used to check if user is authenticate or not before login
        req.flash("success" , "Welcome back to Wanderlust. You are now logged in");
        let redirectUrl = res.locals.redirectUrl || "/listings" //if we are trying to login from some other page then after login send to that page from where we came but if we are trying to login from home/all listings page then redirect to "/listings" page.
        res.redirect(redirectUrl);
      }

      //logout
      module.exports.logout = (req,res,next) => {
        req.logout((err) => {
          if(err) {
            return next(err);
          }
          req.flash("success", "you are logged out!");
          res.redirect("/listings");
        });
      }