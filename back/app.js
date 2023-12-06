const express = require("express");
const path = require("path");
const { getAll, addMember } = require("./queries");
const port = 8080;

const app = express();

app.use(express.static(path.join(__dirname, '../front/public')));
app.use('/css', express.static(path.join(__dirname, '../front/public/css')));
app.use('/js', express.static(path.join(__dirname, '../front/public/js')));
app.use('/img', express.static(path.join(__dirname, '../front/public/img')));



app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/home.html"));
});

app.get("/home.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/home.html"));
});

app.get("/addmember.html", (req, res) => {
    res.sendFile(path.join(__dirname, "../front/views/addmember.html"));
});


app.get('/getAll', getAll);

app.post('/addMember', addMember);
