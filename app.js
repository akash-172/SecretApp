// Always put on top
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

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
    const email = req.body.username;
    const password = md5(req.body.password);
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
app.post("/login", (req, res) => {
    const email = req.body.username;
    const password = md5(req.body.password);
    loginFun();
    async function loginFun() {
        try {
            const user = await User.findOne({email: email, password: password});
            if(user) {
                res.render("secrets");
            } else {
                res.send("Invalid Credentials");
            }
        } catch (error) {
            console.log(error);
        }
    }
});



app.listen(3000, function() {
    console.log(`Server running on port 3000`);
});