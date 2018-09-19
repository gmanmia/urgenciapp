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
    var newUser = new User({
        username: req.body.username, 
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    });
    newUser.avatar = "https://static.thenounproject.com/png/1285891-200.png";
    newUser.about = "Me interesan muchas cosas, pero sobre todo, ayudar a mejorar los servicios de urgencias del país :)";
    
    if(req.body.adminCode === "secretcode123"){
        newUser.isAdmin = true;
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "¡Bienvenid@ a UrgenciApp, "+ user.username +"!" + "Tu usuario fue creado exitosamente :)");
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
    req.flash("success", "Has salido exitosamente");
    res.redirect("/");
});

router.get("/RESTful", function(req,res){
   res.render("RESTtable");
});

// ***** pending REFACTOR ********
// Index user profile
router.get("/users/:id", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           console.log(err);
           req.flash("error", "Algo salió mal, por favor intenta nuevamente.")
           res.redirect("back")
       } 
       res.render("users/show", {user: foundUser});
   });
});

// Show EDIT form for user
router.get("/users/:id/edit", function(req, res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           console.log(err);
           req.flash("error", "No se encuentró este perfil!")
           res.redirect("back")
       } 
       res.render("users/edit", {user: foundUser});
   });
});

// UPDATE user profile 
router.put("/users/:id/edit", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.updatedInfo, function(err, foundUser){
        if(err){
            console.log(err);
            req.flash("error", "No se pudo actualizar el perfil");
            res.redirect("back");
        } else{
            req.flash("success","Tu perfil ha sido actualizado exitosamente");
            res.redirect("/users/" + foundUser._id);
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Tienes que ingresar para poder hacer eso");
    res.redirect("/login");
}

module.exports = router;