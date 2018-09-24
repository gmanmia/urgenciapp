var express = require("express"),
    router = express.Router(),
    passport = require("passport");

// Landing page
router.get("/", function(req,res){
    res.render("landing");
});

// Login page
router.get("/login", function(req,res){
    res.render("login");
});

// Process login
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/facilities",
        failureRedirect: "/login"
    }), function(req, res){
});

// Process logout
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Has salido exitosamente");
    res.redirect("/");
});

// About
router.get("/about", function(req,res){
    res.render("about");
});

//RESTful reference
router.get("/RESTful", function(req,res){
   res.render("RESTtable");
});

module.exports = router;