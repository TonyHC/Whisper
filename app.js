require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require("mongoose-findorcreate");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Connect to Mongodb Atlas
mongoose.connect("mongodb+srv://admin-tony:" + process.env.MONGODB_ATLAS_KEY  + "@projectcluster.wd2lj.mongodb.net/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

// Apply serializing user to any strategy (local or google)
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// Apply deserializing user to any strategy
passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
        done(error, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOLGE_CLIENT_SECRET,
    callbackURL: "https://infinite-spire-84380.herokuapp.com/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo" 
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get("/", function(req, res) {
    res.render("home", {
        isAuthenticated: req.isAuthenticated()
    });
});

app.get("/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect secrets page.
    res.redirect('/secrets');
  });

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/secrets", function(req, res) {
    User.find({"secret": {$ne: null}}, function(error, foundSecrets) {
        if (error) {
            console.log(error);
        } else {
            res.render("secrets", {
                usersWithSecrets: foundSecrets,
                isAuthenticated: req.isAuthenticated()
            });
        }
    });
});

app.get("/submit", function(req, res) {
    if (req.isAuthenticated()) {
        res.render("submit", {
            isAuthenticated: req.isAuthenticated()
        });
    } else {
        res.render("login");
    }
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

app.post("/register", function(req, res) {
    User.register({username: req.body.username}, req.body.password, function(error, user) {
        if (error) {
            console.log(error);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            });
        }
    });
});

app.post("/login", function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(error) {
        if (error) {
            console.log(error);
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect("/secrets");
            })
        }
    });
});

app.post("/submit", function(req, res) {
    const submittedSecret = req.body.secret;

    User.findById(req.user._id, function(error, foundUser) {
        if (error) {
            console.log(error);
        } else {
            foundUser.secret = submittedSecret;
            foundUser.save();

            res.redirect("/secrets");
        }
    })
});

// Let Heroku chose the port when loading the deployed web app or chose port 3000 when testing locally
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server has start successfully.");
});