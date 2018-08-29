var mongoose    = require("mongoose"),
    Hospital    = require("./models/hospital"),
    Report      = require("./models/report");

var hospitalSeeds = [
    {
        name: "Fundación Santa Fe de Bogota",
        capacity: 45,
        address: "Carrera 7 No. 117 - 15",
        wait: 68,
        logo: "https://cdn.oes.org.co/wp-content/uploads/2017/06/Fundacion-Santa-Fe-de-Bogota.jpg",
        rating: 4
    },
    {
        name: "Clinica de Marly",
        capacity: 20,
        address: "Calle 50 #9-67",
        wait: 45,
        logo: "https://repcarol.com/wp-content/uploads/2017/07/cliente-clinica-marly-bogota-1.jpg",
        rating: 3
    },
    {
        name: "Clínica del Occidente",
        address: "Avenida Americas No. 71C 29",
        capacity: 36,
        wait: 97,
        logo: "http://qhantati.co/wp-content/uploads/2013/09/clinica-o.jpg",
        rating: 4.5
    },
    {
        name: "Clínica del Country",
        address: "Cra. 16 #82-57",
        capacity: 25,
        wait: 95,
        logo: "https://cdn.oes.org.co/wp-content/uploads/2016/12/entidad-clinica-del-country.png",
        rating: 3
    },
    {
        name: "Clínica Palermo",
        address: "Calle 45c #22-02",
        capacity: 50,
        wait: 130,
        logo: "http://www.uromedica.co/wp-content/uploads/2014/10/clinica-palermo.jpg",
        rating: 4
    },
    {
        name: "Clinica Méderi - Hospital Universitario Mayor",
        capacity: 20,
        address: "Calle 24 No. 29-45",
        wait: 70,
        logo: "https://www.clinicasesteticas.com.co/site/company/6e/266562/logo/mederi_li1.png",
        rating: 2.5
    }
    ];
    
// var reportSeed = [
//     {
//         alias: "seedUser",
//         triageLevel: 2,
//         arrivalTime: "9:30 am",
//         seenTime: "11:05 am",
//         comments: "Mucha demora. Personal amable. Instalaciones en buen estado"
//     }];

function seedDB(){
    //remove all hospitals
    Hospital.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Cleared database");
        //add seed data
       hospitalSeeds.forEach(function(seed){
          Hospital.create(seed, function(err, hospital){
             if(err){
                 console.log(err);
             } else {
                 console.log("Added a hospital");
                 // add seed reports
                 Report.create(
                     {
                        alias: "usuario123",
                        triageLevel: 2,
                        arrivalTime: "9:30 am",
                        seenTime: "11:05 am",
                        comments: "Mucha demora. Personal amable. Instalaciones en buen estado" 
                     }
                     , function(err, report){
                     if(err){
                         console.log(err);
                     } else {
                         console.log("Report added!");
                         hospital.reports.push(report);
                         hospital.save();
                     }
                 });
             }
          });
           
       });
        
    });
};

module.exports = seedDB;