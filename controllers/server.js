/**
 * ACTS AS A CONTROLLER
 */
// declarations
const PORT = process.env.PORT || 1010;
const express = require('express');
const app = express();
const model = require('../models/model.js'); // the model
const path = require('path'); // built-in module to manipulate paths
const bodyParser = require('body-parser');
let isSignedIn = false;
let currentRole;

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../views`));

// default endpoint
app.get('/', (req, res) => {
    model.connectToDatabase();
    let index = path.join(__dirname, "..", "views", "index.html");
    model.logRequest("GET", "/", index, 200);
    res.sendFile(index);
});

// signup endpoint
app.post('/signup', (req, res) => {
    const data = req.body;
    console.log(data);
    // model.insertCredential(data.)
    res.redirect(path.join(__dirname, "..", "views", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
