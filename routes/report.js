var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    passport    = require("passport"),
    Hospital    = require("../models/hospital"),
    Report      = require("../models/report"),
    middleware  = require("../middleware");
const { DateTime } = require("luxon");

// Display NEW form to create new report entry
router.get("/new", middleware.isLoggedIn, function(req, res){
   Hospital.findById(req.params.id, function(err, foundHospital){
       if(err){
           console.log(err);
       } else {
           res.render("reports/new", {hospital: foundHospital});
       }
   });
});

// CREATE report
router.post("/", middleware.isLoggedIn, function(req, res){
    Hospital.findById(req.params.id, function(err, foundHospital){
        if(err){
            console.log(err);
            res.redirect("/facilities/:id");
        } else {
            // change date to ISO format for future calculations
            var formData = req.body.report;
            var combinedDate = formData.arrivalDate+"T"+formData.arrivalTime+":00";
            formData.checkIn = DateTime.fromISO(combinedDate, { zone: 'America/Bogota' });
            // create the report
            Report.create(formData, function(err, newReport){
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
router.get("/:report_id/edit", middleware.checkReportOwnership, function(req, res){
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
router.put("/:report_id", middleware.checkReportOwnership, function(req, res){
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
router.delete("/:report_id", middleware.checkReportOwnership, function(req, res){
   Report.findByIdAndRemove(req.params.report_id, function(err){
       if(err){
           res.redirect("/facilities/" + req.params.id);
       } else {
            req.flash("success", "Tu reporte ha sido borrado exitosamente");
            res.redirect("/facilities/" + req.params.id);
       }
   });
});

// ******* TESTING FOR MONGO DATE CALCULATIONS  ******************

// Display NEW form to create new report entry ****** TEST ***********
router.get("/newTest", middleware.isLoggedIn, function(req, res){
   Hospital.findById(req.params.id, function(err, foundHospital){
       if(err){
           console.log(err);
       } else {
        //   var now = DateTime.local().setZone('America/Bogota');
           res.render("reports/newTest", {hospital: foundHospital});
       }
   });
});


// CREATE report ********** TEST  *********************
router.post("/test", middleware.isLoggedIn, function(req, res){
    // Hospital.findById(req.params.id, function(err, foundHospital){
    //     if(err){
    //         console.log(err);
    //         res.redirect("/facilities/:id");
    //     } else {
    //         Report.create(req.body.report, function(err, newReport){
    //             if(err){
    //                 console.log(err);
    //                 res.redirect("/facilities/:id")
    //             } else {
    //                 //associate newReport to user submitting
                    
    //                 newReport.alias.id = req.user._id;
    //                 newReport.alias.username = req.user.username;
    //                 newReport.save();
    //                 //associate newReport to Facility
    //                 foundHospital.reports.push(newReport);
    //                 foundHospital.save();
    //                 req.flash("success", "¡Gracias! Tu reporte fue creado exitosamente");
    //                 res.redirect('/facilities/' + foundHospital._id);
    //             }
    //         });
    //     }
    // });
    
    var newReport = req.body.report;
    var combinedDate = newReport.arrivalDate+"T"+newReport.arrivalTime+":00";
    newReport.checkIn = DateTime.fromISO(combinedDate, { zone: 'America/Bogota' });
    res.render("reports/index", {reportData: newReport, DateTime: DateTime});
});

module.exports = router;