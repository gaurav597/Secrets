//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");


const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"] });

const User = mongoose.model("User",userSchema);

app.get("/", function(req,res){
  res.render("home",{});
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});
app.get("/secrets", function(req,res){
  res.render("secrets");
});
app.get("/logout",function(req,res){
  res.render("logout");
})

app.post("/register", function(req,res){
  const user1 = new User({
    username: req.body.username,
    password: req.body.password
  });
  user1.save(function(err){
    if(err)
    { console.log(err);
    }
  });
  res.redirect("/");
});
app.post("/login", function(req,res){
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({username:username},function(err,doc){
    if(!err)
    { if(doc)
      { if(doc.password === password)
        { res.render("secrets");}
      }
    }
    else{ 
      console.log(err);
    }
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});