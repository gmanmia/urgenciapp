var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    Hospital = require("../models/hospital"),
    Report = require("../models/report");

// Display NEW form to create new report entry
router.get("/facilities/:id/report/new", isLoggedIn, function(req, res){
   Hospital.findById(req.params.id, function(err, foundHospital){
       if(err){
           console.log(err);
       } else {
           res.render("reports/new", {hospital: foundHospital});
       }
   });
});

// CREATE report
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
                    req.flash("success", "¡Gracias! Tu reporte fue creado exitosamente");
                    res.redirect('/facilities/' + foundHospital._id);
                }
            });
        }
    });
});

// EDIT - modify info about the report for any hospital
router.get("/facilities/:id/report/:report_id/edit", checkReportOwnership, function(req, res){
   Report.findById(req.params.report_id, function(err, foundReport){
       if(err){
           console.log(err);
           res.redirect("/facilities");
       } else {
           res.render("reports/edit", {facility_id: req.params.id, report: foundReport});
       }
   });
});

// UPDATE - modify the comment based on user input
router.put("/facilities/:id/report/:report_id", checkReportOwnership, function(req, res){
    Report.findByIdAndUpdate(req.params.report_id, req.body.report, function(err, updatedReport){
        if(err){
            console.log(err);
            res.redirect("/facilities");
        } else {
            req.flash("success", "Tu reporte ha sido actualizado exitosamente");
            res.redirect("/facilities/" + req.params.id)
        }
    });
});

// DESTROY - remove a report
router.delete("/facilities/:id/report/:report_id", checkReportOwnership, function(req, res){
   Report.findByIdAndRemove(req.params.report_id, function(err){
       if(err){
           res.redirect("/facilities/" + req.params.id);
       } else {
            req.flash("success", "Tu reporte ha sido borrado exitosamente");
            res.redirect("/facilities/" + req.params.id);
       }
   });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Necesitas ingresar para hacer eso");
    res.redirect("/login");
}

function checkReportOwnership(req, res, next){
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

module.exports = router;