var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    Hospital    = require("../models/hospital"),
    Report      = require("../models/report"),
    User        = require("../models/user");
 
    
// SHOW page register new user  
router.get("/register", function(req,res){
    res.render("users/register");
});

// CREATE new user
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
            return res.render("users/register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "¡Bienvenid@ a UrgenciApp, "+ user.username +"!" + "Tu usuario fue creado exitosamente :)");
            res.redirect("/facilities");
        })
    });
});
    
// Index user profile
router.get("/:id/", function(req, res){
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
router.get("/:id/edit", function(req, res){
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
router.put("/:id/edit", function(req, res){
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

module.exports = router;