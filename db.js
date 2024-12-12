/**
 * Array to store user data.
 * @type {Array}
 */
let users = [];

/**
 * Base URL for the backend database.
 * @constant {string}
 */
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Sends data to a specified path in the database using the PUT method.
 *
 * @async
 * @function putData
 * @param {string} [path=""] - The path in the database where data should be stored.
 * @param {Object} [data={}] - The data to be stored in the database.
 * @returns {Promise<Object>} The response from the server in JSON format.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responsetoJson = await response.json());
}

/**
 * Adds or edits a single user's information in the database.
 *
 * @async
 * @function addEditSingleUser
 * @param {number} [id=1] - The unique ID of the user to be added or edited.
 * @param {Object} [contact={ name: "Kevin" }] - The user data to be added or updated.
 */
async function addEditSingleUser(id = 1, contact = { name: "Kevin" }) {
  putData(`users/${id}`, contact);
}

/**
 * Retrieves all user data from the specified path in the database.
 *
 * @async
 * @function getAllUsers
 * @param {string} path - The database path to retrieve the user data from.
 * @returns {Promise<Object>} The response from the server in JSON format.
 */
async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}
