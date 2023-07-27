// Always put on top
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// create app instance of Express.JS framework
const app = express();
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

main().catch(err => console.log(err));
async function main() {
    // connect to MongoDB database using Mongoose ORM and set connection string in environment variable or config file
    await mongoose.connect('mongodb://127.0.0.1:27017/UserDB');
};

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});
app.get("/login", function(req, res) {
    res.render("login");
});
app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        const email = req.body.username;
        const password = hash;
        registerFun();
        async function registerFun() {
            try {
                const user = await User.create({email: email, password: password});
                res.render("secrets");
            } catch (error) {
                console.log(error);
            }
        }
    });
    
});
app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    loginFun().catch(err => console.log(err));
    async function loginFun() {
        const user = await User.findOne({email: email});
        bcrypt.compare(password, user.password, function(err, result) {
            if(result == true) {
                res.render("secrets");
            } else {
                res.send("Invalid Credentials");
            }
        });
    }
});



app.listen(3000, function() {
    console.log(`Server running on port 3000`);
});