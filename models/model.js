/**
 * userInfo format:
 * {
 *  username: username_,
    password: password_,
    role: role_
 * }
 */

/**
 * HTTP log request:
 * {
    Timestamp: date.getTime(),
    Method: method_,
    Path: path_,
    Query: query_,
    Status Code": status_
   }
 */

/**
 * List request:
 * {
    username: username_,
    list: list_ -> an objest in itself
   }
 */

const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
// password for MongoDB create .env file if not exist
const password = process.env.MONGODB_KEY; 
// MongoDB connection URI
const uri = `mongodb+srv://matthewphilip123:${password}@cluster0.ylzxijs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const localUri = "mongodb://localhost:27017";

// Creating a new MongoClient instance
let client;

// Database and collection names
const dbName = "mhw-checklist";
const userInfoCollectionName = "user-info";
const logCollectionName = "log";
const listsCollectionName = "lists";
const saltRound = 10;
const date = new Date();

// Collections
let userInfo;
let log;
let lists;

/**
 * Connect to MongoDB and initialize collections
 */
async function connectToDatabase(local = false) {
  try {
    // singleton design pattern
    if (!client) {
      if (local) client = new MongoClient(localUri);
      else client = new MongoClient(uri);
    }

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
async function insertCredential(username_, password_, role_) {
  try {
    let hashedPassword = await bcrypt.hash(password_, saltRound);

    // Create a new user object
    let newUser = {
      username: username_,
      password: hashedPassword,
      role: role_,
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
async function logRequest(method_, path_, query_, status_) {
  try {
    // Create a request object
    let request = {
      Timestamp: date.getTime(),
      Method: method_,
      Path: path_,
      Query: query_,
      "Status Code": status_,
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
    let searchResult = await userInfo.find({ username: username_ }).toArray();
    console.log(searchResult);

    // see if user exists
    if (searchResult.length === 0) {
      console.log("no user found");
      return 0;
    }

    // compare with bcrypt
    let result = await bcrypt.compare(password_, searchResult[0].password);

    // returns the user information
    return result ? searchResult[0] : 0;
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
    if ((await getList(username_)) !== false) {
      //  UPDATE OPERATION
      // Update the list document in the lists collection
      await lists.updateOne({ username: username_ }, { $set: { list: list_ } });
      console.log(`A list was updated for usename : ${username_}`);
      return;
    }
    // Create a new document to save the list
    let savedList = {
      username: username_,
      list: list_,
    };

    // Insert the list document into the lists collection
    let result = await lists.insertOne(savedList);
    console.log(`A list was saved with the _id: ${result.insertedId}`);
  } catch (error) {
    console.error("Error saving list:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
}

/**
 * Retrieves the list of the user
 * @param {*} username_
 * @returns
 */
async function getList(username_) {
  try {
    // Queries saved list with given username
    let result = await lists.find({ username: username_ }).toArray();

    // returns the list associated with the user
    if (result.length > 0) {
      return result[0].list;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error saving list:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
}

async function deleteList(username_) {
  try {
    // Delete the list document from the lists collection
    let response = await lists.deleteOne({ username: username_ });
    console.log(response.deletedCount);
    if (response.deletedCount === 0) {
      console.log("No list found for the user");
      return false;
    }
    console.log(`A list was deleted for usename : ${username_}`);
    return true;
  } catch (error) {
    console.error("Error deleting list:", error);
    throw error; // Rethrow the error to handle it at a higher level if needed
  }
}

// Exporting functions and connecting to the database
module.exports = {
  connectToDatabase,
  insertCredential,
  logRequest,
  findUser,
  saveList,
  getList,
  deleteList,
};
