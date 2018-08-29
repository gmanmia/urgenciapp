var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Hospital = require("../models/hospital"),
    Report = require("../models/report");


router.get("/facilities/:id/report/new", isLoggedIn, function(req, res){
   Hospital.findById(req.params.id, function(err, foundHospital){
       if(err){
           console.log(err);
       } else {
           res.render("reports/new", {hospital: foundHospital});
       }
   });
});

router.post("/facilities/:id/report", isLoggedIn, function(req, res){
    Hospital.findById(req.params.id, function(err, foundHospital){
        if(err){
            console.log(err);
            res.redirect("/facilities/:id");
        } else {
            Report.create(req.body.report, function(err, newReport){
                if(err){
                    console.log(err);
                    res.redirect("/facilities/:id")
                } else {
                    //associate newReport to user submitting
                    newReport.alias.id = req.user._id;
                    newReport.alias.username = req.user.username;
                    newReport.save();
                    //associate newReport to Facility
                    foundHospital.reports.push(newReport);
                    foundHospital.save();
                    res.redirect('/facilities/' + foundHospital._id);
                }
            });
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;