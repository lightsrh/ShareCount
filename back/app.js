const express = require("express");
const multer = require("multer");
const path = require("path");
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

require('dotenv').config();


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sharecount', // Nom de la base de données que vous avez créée
    password: 'postgres',
    port: 5432,
});

const { getUsers, addMember, getGroups, addGroup, createUser } = require("./queries");
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

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

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

app.post('/login', (req, res) => {
    try {
      pool.query('SELECT login, password FROM utilisateurs WHERE login = $1 LIMIT 1', [req.body.username], (error, results) => {
        if (error) {
          console.error('Erreur lors de la requête SQL :', error);
          return res.sendStatus(500);
        }
  
        if (results.rows.length === 0) {
          // Aucun utilisateur trouvé avec ce nom d'utilisateur
          return res.sendStatus(401);
        }
  
        const user = results.rows[0];
  
        if (user && bcrypt.compare(req.body.password, user.password)) {
          // Créer une session pour l'utilisateur
          req.session.userid = user.login;
  
          // Rediriger vers la page d'accueil
          return res.sendFile(path.join(__dirname, "../front/views/home.html"));
        } else {
          return res.send('Identifiant ou mot de passe incorrect');
        }
      });
    } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return res.sendStatus(500);
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

app.get('/create-user', (req, res) => {
  res.sendFile(path.join(__dirname, "../front/views/createuser.html"));
});


app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/addMember', addMember);

app.post('/addGroup', addGroup);

app.post('/create-user', async (req, res) => {
  try {
      const { nom, prenom, photo, username, password } = req.body;
      const hashedPassword = await hashPassword(req.body.password);

      createUser(req, res, nom, prenom, photo, username, hashedPassword);
      
  } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return res.sendStatus(500);
  }
});


app.get('/getGroups', getGroups);

app.get('/getUsers/:groupId', getUsers);
