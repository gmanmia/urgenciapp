var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    Hospital    = require("../models/hospital"),
    middleware  = require("../middleware"),
    NodeGeocoder = require('node-geocoder');

const { DateTime } = require('luxon');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
    
// INDEX - show all hospital wait times
router.get("/", middleware.isLoggedIn, function(req,res){
    Hospital.find({}, function(err, allHospitals){
        if(err){
            console.log(err);
        } else {
            res.render("hospitals/index", {hospitals: allHospitals});
        }
    });
});

// NEW - display the form to add a new hospital to the db
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("hospitals/new");
});

// CREATE - add item to the database and redirect to update listing
router.post("/", middleware.isLoggedIn, function(req, res){
    var newName = req.body.hospital.name,
        newLogo = req.body.hospital.logo,
        newCapacity = req.body.hospital.capacity,
        newWait = req.body.hospital.capacity;
    var alias = {
        id: req.user._id,
        username: req.user.username
    };
    
    geocoder.geocode(req.body.hospital.address, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect("back");
        }
        var newLat = data[0].latitude;
        var newLng = data[0].longitude;
        var newAddress = data[0].formattedAddress;
        
        var newHospital = {name: newName, logo: newLogo, address: newAddress, alias: alias, capacity: newCapacity, wait: newWait, lat: newLat, lng: newLng};
        
        Hospital.create(newHospital, function(err, newlyCreated){
           if(err){
               console.log(err);
           } else {
               req.flash("success", "El perfil ha sido creado exitosamente");
               res.redirect("/facilities");
           }
        });
    });
});

// SHOW - pull up individual info for hospital
router.get("/:id", function(req,res){
    Hospital.findById(req.params.id).populate("reports").exec(function(err, foundHospital){
        if(err){
            console.log(err);
        } else {
            var now = DateTime.local().setZone('America/Bogota');
            res.render("hospitals/facility", {hospital: foundHospital, now: now});
        }
    });
});

// EDIT - modify info about the hospital
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
   Hospital.findById(req.params.id, function(err, foundHospital){
       if(err){
           console.log(err);
           res.redirect("/facilities");
       } else {
           res.render("hospitals/edit", {hospital: foundHospital});
       }
   });
});

// UPDATE - modify form based on user input
router.put("/:id", middleware.checkOwnership, function(req, res){
    geocoder.geocode(req.body.hospital.address, function (err, data) {
        if (err || !data.length) {
            req.flash("error", "Invalid address");
            return res.redirect("back");
        }
        req.body.hospital.lat = data[0].latitude;
        req.body.hospital.lng = data[0].longitude;
        req.body.hospital.address = data[0].formattedAddress;
        
        Hospital.findByIdAndUpdate(req.params.id, req.body.hospital, function(err, updatedFacility){
            if(err){
                console.log(err);
                res.redirect("/facilities");
            } else {
                req.flash("success", "El perfil ha sido actualizado exitosamente");
                res.redirect("/facilities/" + req.params.id)
            }
        });
    });
});

// DESTROY - remove a record
router.delete("/:id", middleware.checkOwnership, function(req, res){
   Hospital.findByIdAndRemove(req.params.id, function(err){
       if(err){
           res.redirect("/facilities");
       } else {
           req.flash("success", "El perfil ha sido borrado exitosamente");
           res.redirect("/facilities");
       }
   });
});


module.exports = router;