const express = require("express");
const multer = require("multer");
const path = require("path");
const sessions = require('express-session');
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');

require('dotenv').config();


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'sharecount', // Nom de la base de données que vous avez créée
    password: 'postgres',
    port: 5432,
});

const { getUsers, getGroups, createUser, addToGroup, getToken, getDepenses, rembourser } = require("./queries");
const { get } = require("http");
const port = 8080;
const app = express();

const storage = multer.memoryStorage();

const oneDay = 1000 * 60 * 60 * 24;     //milliseconds in a day
app.use(sessions({
    secret: process.env.SECRET_SESSION,       //random unique key to authenticate session
    saveUninitialized:true,                            //don't save unmodified
    cookie: { maxAge: oneDay },             //session expires after one day of inactivity
    resave: false                        //don't refresh session if unmodified
}));

const checkSession = (req, res, next) => {
    session = req.session;
    if (session.userLogin) {
      next();
    } else {
      res.redirect('/');
    }
  };

app.use(['/home.html', '/group.html', '/addgroup.html', 'creergroupe.html', 'rejoindregroupe.html'], checkSession);

const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

function generateUniqueToken() {
  return uuidv4();
}

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
    if(session.userLogin){
        res.sendFile(path.join(__dirname, "../front/views/home.html"));
    }else
    res.sendFile(path.join(__dirname, "../front/views/login.html"));
});

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
          req.session.userLogin = user.login;
  
          // Rediriger vers la page d'accueil
          return res.sendFile(path.join(__dirname, "../front/views/home.html"));
        } else {
          res.status(500).json({ error: 'Echec de l\authentification' });
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



app.get('/front/views/group.html', (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/group.html"));
});

app.get('/creergroupe.html', (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/creergroupe.html"));
});

app.get('/rejoindregroupe.html', (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/rejoindregroupe.html"));
});

app.get('/depense.html', (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/depense.html"));
});

app.get('/create-user', (req, res) => {
  res.sendFile(path.join(__dirname, "../front/views/creermembre.html"));
});



app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/');
});

app.post('/create-user', async (req, res) => {
  try {
      const { nom, prenom, photo, username, password } = req.body;
      const hashedPassword = await hashPassword(password);
      createUser(req, res, nom, prenom, photo, username, hashedPassword);
  } catch (error) {
      console.error('Erreur lors de la connexion :', error);
      return res.sendStatus(500);
  }
});

app.post('/create-group', async (req, res) => {
  const { nom, photo } = req.body;
  const token = generateUniqueToken(); 

  try {
    const result = await pool.query('INSERT INTO groupe (nom, photo, token) VALUES ($1, $2, $3) RETURNING *', [nom, photo, token]);
    const result2 = await pool.query('SELECT id FROM utilisateurs WHERE login = $1', [req.session.userLogin]);
    const id_utilisateur = result2.rows[0].id;
    const id_groupe = result.rows[0].id;
    await addToGroup(res, id_utilisateur, id_groupe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création du groupe' });
  }
});

app.post('/create-depense', async (req, res) => {
  const { payer, rembourser, groupe, montant, date, infos } = req.body;
  const utilisateur_dette = rembourser.split(', ');
  const insertedRows = [];

  try {
    for (let i = 0; i < utilisateur_dette.length; i++) {
      const userdetteLogin = utilisateur_dette[i];
      //get id of userdetteLogin and of payer
      const result1 = await pool.query('SELECT id FROM utilisateurs WHERE login = $1', [userdetteLogin]);
      console.log(result1.rows);
      const userdette = result1.rows[0].id;
      const result2 = await pool.query('SELECT id FROM utilisateurs WHERE login = $1', [payer]);
      const utilisateur_acheteur = result2.rows[0].id;
      const result = await pool.query('INSERT INTO depense (utilisateur_acheteur, utilisateur_dette, groupe, prix, date, informations) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [utilisateur_acheteur, userdette, groupe, montant / utilisateur_dette.length, date, infos]);
      insertedRows.push(result.rows[0]);
    }
    res.status(200).json(insertedRows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la dépense' });
  }
});



app.post('/joinGroup', async (req, res) => {
  const { token } = req.body;
  try {
    const result = await pool.query('SELECT id FROM utilisateurs WHERE login = $1', [req.session.userLogin]);
    const id_utilisateur = result.rows[0].id;
    const result2 = await pool.query('SELECT id FROM groupe WHERE token = $1', [token]);
    const id_groupe = result2.rows[0].id;
    await addToGroup(res, id_utilisateur, id_groupe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'ajout au groupe' });
  }
});


app.get('/getGroups', getGroups);

app.get('/getUsers/:groupId', getUsers);
app.get('/getToken/:groupId', getToken);
app.get('/getDepenses/:groupId', getDepenses);

app.post('/rembourser', rembourser);



app.get('/getLogin', async (req, res) => {
  let responseData = [];
  if (req.session.userLogin) {
    responseData.push(req.session.userLogin);
    const result = await pool.query('SELECT id FROM utilisateurs WHERE login = $1', [req.session.userLogin]);
    if (result.rows && result.rows.length > 0) {
      responseData.push(result.rows[0].id);
      console.log(responseData);
      console.log(result.rows[0].id)
    }
  }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(responseData));
});

