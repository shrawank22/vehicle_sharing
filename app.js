require('dotenv').config();

const express = require('express');
const app = express();


app.get('/', (req, res) => {
    res.send("Aur btao, Kaise Ho")
});

const PORT = "8080" || process.env.PORT;
const IP = "0.0.0.0" || process.env.IP;
app.listen(PORT, IP, () => {
    console.log(`Server started at port ${PORT}`)
});
