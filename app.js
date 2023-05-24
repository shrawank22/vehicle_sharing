require('dotenv').config();

const express = require('express');
const bp = require('body-parser');
const methodOverride = require('method-override');
const app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(bp.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home.ejs');
});

const PORT = "8080" || process.env.PORT;
const IP = "0.0.0.0" || process.env.IP;
app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
});
