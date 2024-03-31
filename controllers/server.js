/**
 * ACTS AS A CONTROLLER
 */
// declarations
const PORT = process.env.PORT || 1010;
const express = require('express');
const app = express();
const model = require('../models/model.js'); // the model
const path = require('path'); // built-in module to manipulate paths

app.use(express.static(`${__dirname}/../views`));

// default endpoint
app.get('/', (req, res) => {
    model.connectToDatabase();
    let index = path.join(__dirname, "..", "views", "index.html");
    model.logRequest("GET", "/", index, 200);
    res.sendFile(index);
});

// signup
app.get('/signup/username=:username/password=:password', (req, res) => {
    let username = req.username;
    let password = req.password;
    model.insertCredential(username, password);
    model.logRequest("GET", `/signup/username=${username}/password=${password}`, {username, password}, 200);
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
