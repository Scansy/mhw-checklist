const { MongoClient } = require('mongodb');

// MongoDB connection URI
const uri = "mongodb+srv://matthewphilip123:U4CiOdjfvyLLghIK@cluster0.ylzxijs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Creating a new MongoClient instance
const client = new MongoClient(uri);

// Database and collection names
const dbName = "mhw-checklist";
const userInfoCollectionName = "user-info";
const logCollectionName = "log";
const listsCollectionName = "lists";

// Collections
let userInfo;
let log;
let lists;

/**
 * Connect to MongoDB and initialize collections
 */
async function connectToDatabase() {
    try {
        // Connect to MongoDB
        await client.connect();
        console.log("Connected to MongoDB");

        // Accessing the database
        const db = client.db(dbName);

        // Accessing collections
        userInfo = db.collection(userInfoCollectionName);
        log = db.collection(logCollectionName);
        lists = db.collection(listsCollectionName);
        
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
}

/**
 * Inserts credentials into database when signing up
 * @param {*} username 
 * @param {*} password 
 * @returns boolean
 */
async function insertCredential(username_, password_) {
    try {
        // Create a new user object
        let newUser = {
            username: username_,
            password: password_
        };

        // Insert the new user into the collection
        let result = await userInfo.insertOne(newUser);
        console.log(`A user was inserted with the _id: ${result.insertedId}`);
        return result;
    } catch (error) {
        console.error("Error inserting user credentials:", error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
}

/**
 * Logs an HTTP request
 * @param {*} time_ 
 * @param {*} method_ 
 * @param {*} path_ 
 * @param {*} query_ 
 * @param {*} status_ 
 * @returns boolean
 */
async function logRequest(time_, method_, path_, query_, status_) {
    try {
        // Create a request object
        let request = {
            Timestamp: time_,
            Method: method_,
            Path: path_,
            Query: query_,
            "Status Code": status_
        };

        // Insert the request into the log collection
        let result = await log.insertOne(request);
        console.log(`A HTTP request was logged with the _id: ${result.insertedId}`);
        return result;
    } catch (error) {
        console.error("Error logging HTTP request:", error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
}

/**
 * Queries a user to see if account exists
 * @param {*} username_ 
 * @param {*} password_ 
 * @returns boolean
 */
async function findUser(username_, password_) {
    try {
        // Find a user with the provided username and password
        let result = await userInfo.find({username: username_, password: password_}).toArray();
        return result.length > 0; // Return true if a matching user is found, otherwise false
    } catch (error) {
        console.error("Error finding user:", error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
}

/**
 * Saves a list for a user
 * @param {*} username_ 
 * @param {*} list_ 
 */
async function saveList(username_, list_) {
    try {
        // Create a new document to save the list
        let savedList = {
            username: username_,
            list: list_
        };

        // Insert the list document into the lists collection
        let result = await lists.insertOne(savedList);
        console.log(`A list was saved with the _id: ${result.insertedId}`);
    } catch (error) {
        console.error("Error saving list:", error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
}

// Exporting functions and connecting to the database
module.exports = {
    connectToDatabase,
    insertCredential,
    logRequest,
    findUser,
    saveList
};