var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user");

// Landing page
router.get("/", function(req,res){
    res.render("landing");
});

router.get("/register", function(req,res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User ({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/facilities");
        })
    });
});

router.get("/login", function(req,res){
    res.render("login");
});

//process login
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/facilities",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/search", function(req,res){
    res.render("search");
});

router.get("/about", function(req,res){
    res.render("about");
});

router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/");
});

router.get("/RESTful", function(req,res){
   res.render("RESTtable");
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;