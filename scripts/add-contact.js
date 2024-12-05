/**
 * Array to store initials of contacts.
 * @type {string[]}
 */
let initialsarrays = [];

/**
 * Adds a new contact and updates the contact list.
 *
 * @param {Event} event - The form submit event.
 */

async function fetchContactsData() {
  let contactsPath = `/users/1/contacts`;
  let contactsData = await fetch(GLOBAL + contactsPath + ".json")
    .then((response) => response.json())
    .catch(() => putData(contactsPath, {}));
  return contactsData;
}

function getContactData() {
  let telefonename = document.getElementById("name").value;
  let [firstname, lastname] = telefonename.split(" ");
  let initials = (
    firstname.charAt(0) + (lastname?.charAt(0) || "")
  ).toUpperCase();
  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;
  let color = getColorFromString(telefonename);
  return { telefonename, initials, email, phone, color };
}

async function addcontact(event) {
  event.preventDefault();
  if (initializeFormValidation()) return;
  const { telefonename, initials, email, phone, color } = getContactData();
  await addEditSingleUser(1, {
    name: telefonename,
    email,
    telefone: phone,
    initials,
    color,
  });
  emptyinputs();
  closecontactstemplate();
  showcontactlog();
}

/**
 * Shows a success message when a contact is added.
 */
function showcontactlog() {
  const overlay = document.getElementById("successfullcontactlogoverlay");
  overlay.style.transform = "translateX(126%)";
  setTimeout(() => {
    overlay.classList.remove("d-none");
    overlay.style.transform = "translateX(0%)";
  }, 50);
  setTimeout(() => {
    overlay.style.transform = "translateX(126%)";
  }, 4000);
}

/**
 * Clears the input fields in the contact form.
 */
function emptyinputs() {
  document.getElementById("name").value = "";
  document.getElementById("emailarea").value = "";
  document.getElementById("phone").value = "";
  showcontacts();
}

/**
 * Sends data to a specified path using a PUT request.
 *
 * @param {string} path - The API endpoint path.
 * @param {Object} data - The data to send.
 * @returns {Promise<Object>} - The response data.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Adds or edits a single user contact.
 *
 * @param {number} id - The user ID.
 * @param {Object} contact - The contact data.
 * @returns {Promise<void>} - A promise that resolves when the contact is updated.
 */
async function addEditSingleUser(id = 1, contact = { name: "Kevin" }) {
  let userContacts = (await getUserContacts(id)) || {};
  let nextIndex = Math.max(...Object.keys(userContacts).map(Number), 0) + 1;
  await putData(`users/${id}/contacts/${nextIndex}`, contact);
}

/**
 * Fetches the contacts of a specific user.
 *
 * @param {number} id - The user ID.
 * @returns {Promise<Object>} - The user's contacts.
 */
async function getUserContacts(id) {
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  return await response.json();
}

/**
 * Fetches all contacts and adds their initials to the `initialsarrays` array.
 *
 * @param {number} [id=1] - The user ID.
 */
async function showInitials(id = 1) {
  let contacts = (
    await (await fetch(GLOBAL + `users/${id}/contacts.json`)).json()
  )
    .filter((c) => c && c.name)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  contacts.forEach((contact) =>
    initialsarrays.push(
      (
        contact.name.trim().split(" ")[0]?.charAt(0) +
        (contact.name.split(" ")[1]?.charAt(0) || "")
      ).toUpperCase()
    )
  );
}

/**
 * Fetches all users from a specific path.
 *
 * @param {string} path - The API endpoint path.
 * @returns {Promise<Object>} - All users.
 */
async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return await response.json();
}

/**
 * Generates a color based on a string input.
 *
 * @param {string} str - The input string.
 * @returns {string} - The generated RGB color string.
 */
function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let r = (hash >> 24) & 0xff,
    g = (hash >> 16) & 0xff,
    b = (hash >> 8) & 0xff;
  return `rgb(${Math.floor(r + (255 - r) * 0.4)}, ${Math.floor(
    g + (255 - g) * 0.4
  )}, ${Math.floor(b + (255 - b) * 0.4)})`;
}
