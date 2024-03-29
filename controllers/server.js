/**
 * ACTS AS A CONTROLLER
 */
// declarations
const PORT = process.env.PORT || 1010;
const express = require('express');
const app = express();
const model = require('./models/model.js'); // the model
const path = require('path'); // built-in module to manipulate paths
const roles = {
    admin: 'admin',
    user: 'user',
    guest: 'guest',
}; // roles
let currentUser = roles.guest; // current user


// setting up view
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); // embedded javascript

// default endpoint
app.get('/', (req, res) => {
    res.redirect('/view/index.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});