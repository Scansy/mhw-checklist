/**
 * ACTS AS A CONTROLLER
 */
// declarations
const PORT = process.env.PORT || 1010;
const express = require('express');
const app = express();
const model = require('../models/model.js'); // the model
const mhw = require('../models/mhwAPI.js'); // the mhwAPI
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
    let data = await mhw.getSpecificWeapon(req.params.weaponType);
    model.logRequest("GET", "/weapon_brief", data, 200);
    res.json(data);
    // let weaponType = req.params.weaponType;
    // let url = new URL(`https://mhw-db.com/weapons?q={"type":"${weaponType}"}`);
   
    // url.searchParams.set('p',JSON.stringify(
    //     {
    //     "id":true,   
    //     "name": true,
    //     "type": true,
    //     "assets": true,
    //     }
    // ));
    // fetch(url)
    // .then(response => response.json())
    // .then(data => {
    //     console.log(data);
    //     model.logRequest("GET", "/weapon_brief", data, 200);
    //     res.json(data);
    // })

});

// save list to database
app.post('/saveList', async (req, res) => {
    console.log("saveList hit");
    let list = req.body;
    model.saveList(currentUsername, list);
    model.logRequest("POST", "/saveList", req.body, 200);
    res.sendStatus(200);
});
// get list from database
app.get('/getList', async (req, res) => {
    console.log("getList hit");
    let list = await model.getList(currentUsername);
    model.logRequest("GET", "/getList", list, 200);
    res.json(list);
});

// get weapon by name
app.get('/weapon_stat/:weaponType/:weaponName', async (req, res) => {
    console.log("weapon_stat hit");
    let weaponName = req.params.weaponName;
    let weaponType = req.params.weaponType;
    let data = await mhw.getWeaponByName(weaponType,weaponName);
    model.logRequest("GET", "/weapon_stat", data, 200);
    res.json(data);
});

// get role
app.get('/getRole', async (req, res) => {
    console.log("getRole hit");
    model.logRequest("GET", "/getRole", currentRole, 200);
    res.send(currentRole);
});

// delete a user's list
app.get('/deleteUserList/:username', async (req, res) => {
    console.log("deleteList hit");
    let currentUsername = req.params.username;
    let response = await model.deleteList(currentUsername);
    model.logRequest("GET", "/deleteList", null, 200);
    res.send(response);
});
app.get('/weapon_id/:weaponType/:id', async (req, res) => {
    console.log("weapon_id hit");
    let id = req.params.id;
    let weaponType = req.params.weaponType;
    let data = await mhw.getWeaponByid(weaponType,id);
    model.logRequest("GET", "/weapon_id", data, 200);
    res.json(data);
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
