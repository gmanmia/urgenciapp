//all middleware goes here
var middlewareObj   = {};
var Hospital        = require("../models/hospital"),
    Report          = require("../models/report");

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Tienes que regitrarte para hacer eso");
    res.redirect("/login")
};

middlewareObj.checkOwnership = function(req, res, next){
    if(req.isAuthenticated()){
     Hospital.findById(req.params.id, function(err, foundHospital){
         if(err){
             res.redirect("back");
         } else {
             if(foundHospital.alias.id.equals(req.user._id)){
                 next();
             } else {
                 req.flash("error", "No estás autorizado para hacer eso")
                 res.redirect("back");
             }
         }
     })   
    }
}

middlewareObj.checkReportOwnership = function (req, res, next){
    if(req.isAuthenticated()){
     Report.findById(req.params.report_id, function(err, foundReport){
         if(err){
             res.redirect("back");
         } else {
             if(foundReport.alias.id.equals(req.user._id) || req.user.isAdmin){
                 next();
             } else {
                 req.flash("error", "No tienes autorización para hacer eso");
                 res.redirect("back");
             }
         }
     })   
    }
}

module.exports = middlewareObj;