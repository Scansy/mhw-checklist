/**
 * ACTS AS A CONTROLLER
 */
// declarations
const PORT = process.env.PORT || 1010;
const express = require('express');
const app = express();
const model = require('../models/model.js'); // the model
const path = require('path'); // built-in module to manipulate paths

app.use(express.static(`${__dirname}/../client`));

// default endpoint
app.get('/', (req, res) => {
    model.connectToDatabase()
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});