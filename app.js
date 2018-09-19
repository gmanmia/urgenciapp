require('dotenv').config();

var methodOverride  = require("method-override"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    express     = require("express"),
    app         = express(),
    flash       = require("connect-flash");
// SCHEMA setup + seed database
var Hospital    = require("./models/hospital"),
    Report      = require("./models/report"),
    User        = require("./models/user"),
    // seedDB      = require("./seeds"),
// AUTHENTICATION packages
    passport    = require("passport"),
    LocalStrategy = require("passport-local");

//initialize routes
var facilityRoutes  = require("./routes/facility"),
    reportRoutes    = require("./routes/report"),
    indexRoutes     = require("./routes/index");

var url = "mongodb://localhost:27017/urgenciapp" || process.env.DATABASEURL;
mongoose.connect(url, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(flash());
// seedDB();

// Passport (authentication) configuration
app.use(require("express-session")({
    secret: "life is good",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/facilities", facilityRoutes);
app.use("/", reportRoutes);

app.get("*", function(req,res){
    res.send("Page Not Found!  :(  ")
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The UrgenciApp server has started!")
});