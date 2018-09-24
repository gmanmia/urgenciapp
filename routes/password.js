var express = require("express"),
    router = express.Router(),
    passport = require("passport"),
    User = require("../models/user"),
    async = require("async"),
    nodemailer = require("nodemailer"),
    crypto = require("crypto");

// SHOW password reset request form
router.get("/forgot", function(req, res){
    res.render("passwords/forgot");
});

// Process password reset request
router.post("/forgot", function (req, res, next){
   async.waterfall([
       function(done) {
           crypto.randomBytes(20, function(err, buf){
               var token = buf.toString("hex");
               done(err, token);
           });
       },
       function(token, done) {
           User.findOne({email: req.body.email}, function(err, user){
              if (!user){
                  req.flash("error", "No existe una cuenta con ese email.");
                  return res.redirect("/password/forgot");
              } 
              user.resetPasswordToken = token;
              user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
              user.save(function(err){
                 done(err, token, user); 
              });
           });
       },
       function(token, user, done){
           var smtpTransport = nodemailer.createTransport({
               service: "Gmail",
               auth: {
                   user: "noreply.gmansites@gmail.com",
                   pass: process.env.GMAILPW
               }
           });
           var mailOptions = {
               to: user.email,
               from: "noreply.gmansites@gmail.com",
               subject: "UrgenciApp: Solicitud de Cambio de Contraseña",
               text: "Hola, \n\n Estás recibiendo este correo porque alguien solicitó cambio de contraseña para tu cuenta.\n\n" + 
                    "Tienes una hora para hacer click en el siguiente link, o puedes copiar la dirección en tu navegador:\n\n" +
                    "https://urgenciapp.herokuapp.com/password/reset/" + token + "\n\n" +
                    "Si no solicitaste este cambio por favor ignora este mensaje y tu cuenta seguirá sin cambios." + "\n\n" +
                    " - Equipo UrgenciApp "
           };
            smtpTransport.sendMail(mailOptions, function(err){
                console.log("mail sent");
                req.flash("success", "Se envió un correo a " + user.email + " con instrucciones. Tienes una hora para hacer el cambio.");
                done(err, "done");
           });
       }
    ], function(err){
        if(err) return next(err);
        res.redirect("/"); // return to main if successful password request
    }); 
});

// SHOW page to enter new password
router.get("/reset/:token", function(req, res){
   User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
       if(!user){
           req.flash("error", "El link para actualizar la clave es inválido o ha expirado.");
           return res.redirect("/password/forgot");
       }
       res.render("passwords/reset", {token: req.params.token});
   }) 
});

// UPDATE database with new password
router.post("/reset/:token", function(req, res){
   async.waterfall([
       function(done){
           User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}}, function(err, user){
               if(!user){
                    req.flash("error", "El link para actualizar la clave es inválido o ha expirado.");
                    return res.redirect("back");
               }
               if (req.params.password === req.params.confirm){
                   user.setPassword(req.body.password, function(err){
                       if(err){
                           console.log(err);
                           req.flash("error", "Algo salió mal. Por favor trata nuevaamente.");
                           return res.redirect("back");
                       } 
                       user.resetPasswordToken = undefined;
                       user.resetPasswordExpires = undefined;
                       user.save(function(err){
                           if (err){
                                console.log(err);
                                req.flash("error", "Algo salió mal. Por favor trata nuevaamente.");
                                return res.redirect("back");
                           } else {
                               req.logIn(user, function(err){
                                   if(err){
                                        console.log(err);
                                        req.flash("error", "Algo salió mal. Por favor trata nuevaamente.");
                                        return res.redirect("back");
                                   }
                                   done(err, user);
                               });
                           }
                       });
                   });
               } else {
                   req.flash("error", "Las contraseñas no concuerdan. Trata nuevamente.")
                   return res.redirect("back");
               }
           });
       },
       function(user, done){
           var smptTransport = nodemailer.createTransport({
               service: "Gmail",
               auth: {
                   user: "noreply.gmansites@gmail.com",
                   pass: process.env.GMAILPW
               }
           });
           var mailOptions = {
               to: user.email,
               from: "noreply.gmansites@gmail.com",
               subject: "UrgenciApp: Confirmación de cambio de contraseña",
               text: "Hola, \n\n" + 
               "Este email confirma el cambio de contraseña para la cuenta asociada con el email " + user.email +
               "\n\n Gracias por usar nuestro servicio :)" +
               "\n\n - Equipo UrgenciApp"
           };
           smptTransport.sendMail(mailOptions, function(err){
               req.flash("success", "Tu contraseña ha sido cambiada exitosamente");
               done(err);
           });
       }
       ], function(err){
           if(err){
               console.log(err);
           } else {
               res.redirect("/facilities")
           }
       });
});

module.exports = router;