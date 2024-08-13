module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.user); -> In order to check user is logged in or not.
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl; //redirect user to this path after login page pops up

    //check if user is logged in.. in order to create new listing
    req.flash("error", "you must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};

// (for redirecting user to same page they came before login form pops up)
//save it in res.locals so that passport won't delete the req.session.redirectUrl after "/login" gives success. Since passport deletes additional info if the path accessed will give success but passport can't delete res.locals so we'll pass passport.locals as middleware.
module.exports.saveRedirectUrl = (req,res,next) => {
  if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}
