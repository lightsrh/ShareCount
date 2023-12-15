const express = require("express");
const multer = require("multer");
const path = require("path");
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
require('dotenv').config();



const { getUsers, addMember, getGroups, addGroup } = require("./queries");
const port = 8080;

const app = express();

const oneDay = 1000 * 60 * 60 * 24;     //milliseconds in a day
app.use(sessions({
    secret: process.env.SECRET_SESSION,       //random unique key to authenticate session
    saveUninitialized:true,                            //don't save unmodified
    cookie: { maxAge: oneDay },             //session expires after one day of inactivity
    resave: false                        //don't refresh session if unmodified
}));

const checkSession = (req, res, next) => {
    session = req.session;
    if (session.userid) {
      next();
    } else {
      res.redirect('/');
    }
  };

  app.use(['/home.html', '/addmember.html', '/front/views/group.html', '/addgroup.html'], checkSession);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

// cookie parser middleware
app.use(cookieParser());

var session;    //global variable to store session


app.use(express.static(path.join(__dirname, '../front/public')));
app.use('/public', express.static(path.join(__dirname, '../front/public')));
app.use('/css', express.static(path.join(__dirname, '../front/public/css')));
app.use('/js', express.static(path.join(__dirname, '../front/public/js')));
app.use('/img', express.static(path.join(__dirname, '../front/public/img')));



app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

app.get("/", (req, res) => {
    session=req.session;
    if(session.userid){
        res.sendFile(path.join(__dirname, "../front/views/home.html"));
    }else
    res.sendFile(path.join(__dirname, "../front/views/login.html"));
});

const NAME = process.env.NAME;
const PASSWORD = process.env.PASSWORD;

app.post('/login',(req,res) => {
        if (req.body.username == NAME && req.body.password == PASSWORD) {
        session=req.session;
        session.userid=req.body.username;
        res.sendFile(path.join(__dirname, "../front/views/home.html"));
    }
    else{
        res.send('Invalid username or password');
    }
});

app.get("/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/home.html"));
});

app.get("/addmember.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/addmember.html"));
});

app.get('/front/views/group.html', (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/group.html"));
});

app.get('/addgroup.html', (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/addgroup.html"));
});


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/addMember', addMember);

app.post('/addGroup', addGroup);

app.get('/getGroups', getGroups);

app.get('/getUsers/:groupId', getUsers);
