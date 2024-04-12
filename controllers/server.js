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
const bcrypt = require('bcrypt');
let isSignedIn = false;
let currentRole = "guest";
let currentUsername;

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../views`));

// connect to mongodb database
model.connectToDatabase()
    .then(() => {
        console.log("Mongodb connected");
    })
    .catch(error => {
        console.error("Error connecting to MongoDB:", error);
    });

// default endpoint
app.get('/', (req, res) => {
    let index = path.join(__dirname, "..", "views", "index.html");
    model.logRequest("GET", "/", index, 200);
    res.sendFile(index);
});

// signup endpoint
app.post('/signup', async (req, res) => {
    const data = req.body;
    console.log("signup hit")

    model.insertCredential(data.username, data.password, "user");

    model.logRequest("POST", "/signup", req.body, 300);
    res.sendStatus(300);
});

// signin endpoint
app.post('/signin', async (req, res) => {
    const data = req.body;
    console.log("signin hit");

    let result = await model.findUser(data.username, data.password);
    console.log(result);
    if (result) {
        currentRole = result.role;
        isSignedIn = true;
        currentUsername = result.username;
        model.logRequest("POST", "/signin", result, 300);
        res.sendStatus(300);
    } else {
        console.log("wrong password hit")
        res.sendStatus(200);
    }
})

// logout endpoint
app.get('/logout', async (req, res) => {
    isSignedIn = false;
    currentRole = "guest";
    currentUsername = "";
    model.logRequest("GET", "/logout", null, 200);
    res.redirect('/');
});

// isSignedIn endpoint
app.get('/isSignedIn', async (req, res) => { 
    model.logRequest("GET", "/isSignedIn", isSignedIn, 200);
    res.send(isSignedIn);
});

// fetch weapons
app.get('/weapon_brief/:weaponType', async (req, res) => {
    console.log("weapon_breif hit");
    let weaponType = req.params.weaponType;
    let url = new URL(`https://mhw-db.com/weapons?q={"type":"${weaponType}"}`);
   
    url.searchParams.set('p',JSON.stringify(
        {
        "id":true,   
        "name": true,
        "type": true,
        "assets": true,
        }
    ));
    fetch(url)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        model.logRequest("GET", "/weapon_brief", data, 200);
        res.json(data);
    })

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
