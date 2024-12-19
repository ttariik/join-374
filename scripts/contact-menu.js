/**
 * Set to track displayed letters in the contact menu.
 * @type {Set<string>}
 */
let displayedLetters = new Set();
async function showcontacts(id = 1) {
  const response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  const responsestoJson = await response.json();
  contactUsers = Object.entries(responsestoJson || {})
    .map(([key, contact]) => ({ key, ...contact }))
    .filter((contact) => contact && contact.name)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  lastpart();
}

function lastpart() {
  displayedLetters.clear();
  const contactMenu =
    document.getElementById("contactmenu") ||
    document.getElementById("contacts-box");
  contactMenu.innerHTML = "";
  contactUsers.forEach((contact) => {
    contactMenu.innerHTML += contactsmenutemplate(contact);
  });
}

/**
 * Opens the "add contact" template with an overlay effect.
 * @returns {Promise<void>}
 */
async function opencontactstemplate() {
  document.getElementById("overlayaddcontact").classList.remove("d-none");
  document.getElementById("overlayaddcontact").classList.add("overlay2");
  document.querySelector(".overlay2").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay2").style.transform = "translateX(0%)";
    initializeFormValidation();
  }, 0.5);
}

/**
 * Closes the "add contact" template overlay.
 */
function closecontactstemplate() {
  document.querySelector(".overlay2").style.transform = "translateX(126%)";
}

/**
 * Fetches and displays the list of contacts.
 * @param {number} [id=1] - ID of the user whose contacts are to be displayed.
 * @returns {Promise<void>}
 */

/**
 * Generates an HTML template for a single contact.
 * @param {Object} contact - Contact object containing details like name and email.
 * @returns {string} HTML template for the contact.
 */
function contactsmenutemplate(contact) {
  let firstLetter = contact.name.charAt(0).toUpperCase();
  let title = "";
  if (!displayedLetters.has(firstLetter)) {
    title = `<h2>${firstLetter}</h2>
             <div class="lineseperator"></div>`;
    displayedLetters.add(firstLetter);
  }
  const color = getColorFromString(contact.name);
  return /*html*/ `
      ${title}
      <div class="align" id="${contact.key}" onclick="showcontacttemplate('${
    contact.key
  }'); ">
        <div class="badge" style="background-color: ${contact.color};">
          ${contact.initials || contact.name.charAt(0).toUpperCase()}
        </div>
        <div class="secondpart">
          <div class="name">${contact.name}</div>
          <div class="email">${contact.email || ""}</div>
        </div>
      </div>
  `;
}

/**
 * Generates a color based on a string.
 * @param {string} str - Input string.
 * @returns {string} RGB color value.
 */
function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let r = (hash >> 24) & 0xff;
  let g = (hash >> 16) & 0xff;
  let b = (hash >> 8) & 0xff;

  const lightnessFactor = 0.4;
  r = Math.floor(r + (255 - r) * lightnessFactor);
  g = Math.floor(g + (255 - g) * lightnessFactor);
  b = Math.floor(b + (255 - b) * lightnessFactor);

  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Opens the "edit contact" template for a specific contact.
 * @param {string} contactKey - Key of the contact to edit.
 * @returns {Promise<void>}
 */
async function edicontact(contactKey) {
  initializeFormValidation();
  document.getElementById("overlayaddcontact").classList.remove("d-none");
  document.getElementById("overlayaddcontact").classList.add("overlay2");
  document.getElementById("spantitle").innerHTML = "Edit contact";
  const contact = contactUsers.find((user) => user.key === contactKey);
  document.getElementById("name").value = contact.name;
  document.getElementById("emailarea").value = contact.email || "";
  document.getElementById("phone").value = contact.telefone || "";
  lastpartofeditcontact(contactKey);
}

function lastpartofeditcontact(contactKey) {
  document.getElementById("spandescription").innerHTML = "";
  document.getElementById("overlayaddcontact").style.display = "flex";
  setTimeout(() => {
    document.getElementById("overlayaddcontact").style.transform =
      "translateX(0%)";
  }, 0.5);
  document.getElementById("addbutton").addEventListener("click", (event) => {
    event.preventDefault();
    savedata(contactKey);
  });
}

/**
 * Closes the "add contact" template and resets its fields.
 */
function closeaddcontacttemplate() {
  document.getElementById("overlayaddcontact").style.transform =
    "translateX(250%)";
  setTimeout(() => {
    document.getElementById("spantitle").innerHTML = "Add contact";
    document.getElementById("name").value = "";
    document.getElementById("emailarea").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("spandescription").innerHTML =
      "Tasks are better with a team!";
  }, 0.5);
}

/**
 * Deletes a contact and updates the contact list.
 * @param {string} contactKey - Key of the contact to delete.
 * @returns {Promise<void>}
 */
async function deletecontact(contactKey) {
  const contactIndex = contactUsers.findIndex(
    (contact) => contact.key === contactKey
  );
  if (contactIndex === -1) {
    return;
  }
  await deleteData(`/users/1/contacts/${contactKey}`);
  contactUsers.splice(contactIndex, 1);
  document.getElementById("contacttemplate").style = "display: none";
  showcontacts((id = 1));
}

/**
 * Sends a DELETE request to remove a contact.
 * @param {string} path - API endpoint for deleting the contact.
 * @returns {Promise<Object>} Response from the server.
 */
async function deleteData(path = "") {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

/**
 * Closes the contact template view for a specific contact.
 * @param {string} contactKey - Key of the contact.
 */
function closecontacttemplate(contactKey) {
  document.getElementById(`${contactKey}`).classList.remove("dark-blue");
  document.getElementById(`${contactKey}`).style.color = "";
  document.getElementById("contacttemplate").style.transform =
    "translateX(250%)";
  document.getElementById(`${contactKey}`).onclick = () =>
    showcontacttemplate(contactKey);
}

/**
 * Displays the details of a specific contact in the contact template.
 * @param {string} contactKey - Key of the contact to display.
 * @returns {Promise<void>}
 */

function deselectingcontactclass(contactKey) {
  document.querySelectorAll(".align").forEach((contact) => {
    contact.classList.remove("dark-blue");
    contact.style.color = "";
  });
  const currentContact = document.getElementById(`${contactKey}`);
  if (currentContact) {
    currentContact.classList.add("dark-blue");
    currentContact.style.color = "white";
  }
  document.getElementById("contacttemplate").classList.remove("d-none");
}

let lastSelectedContactKey = null;

async function showcontacttemplate(contactKey) {
  if (lastSelectedContactKey === contactKey) {
    closecontacttemplate(contactKey);
    lastSelectedContactKey = null;
    return;
  }
  lastSelectedContactKey = contactKey;

  deselectingcontactclass(contactKey);
  const contact = contactUsers.find((user) => user.key === contactKey);
  document.getElementById("title").innerHTML = contact.name;
  document.getElementById("email").innerHTML = contact.email || "";
  document.getElementById("telefone").innerHTML = contact.telefone || "";
  document.getElementById("badge").style.backgroundColor = `${contact.color}`;
  document.getElementById("badge").innerHTML = `${contact.initials}`;
  document.getElementById("editbutton").onclick = () => edicontact(contact.key);
  document.getElementById("deletebutton").onclick = () =>
    deletecontact(contact.key);
  lastpartofcontacttemplate(contact);
}

function lastpartofcontacttemplate(contact) {
  document.getElementById("editbutton-overlay").onclick = () =>
    edicontact(contact.key);
  closeaddcontacttemplate();
  document.getElementById("deletebutton-overlay").onclick = () =>
    deletecontact(contact.key);
  const contactTemplate = document.getElementById("contacttemplate");
  contactTemplate.style.display = "flex";
  contactTemplate.style.transform = "translateX(0%)";
}

/**
 * Returns the user interface to the main contact menu view.
 */
function returntomenu() {
  document.querySelector(".boxalignment").style.display = "none";
  document.querySelector(".contact-content-wrapper").style.display = "unset";
}

/**
 * Saves the updated data for a specific contact.
 * @param {string} contactKey - Key of the contact to save.
 * @returns {Promise<void>}
 */
function savedatainputs() {
  let telefonename = document.getElementById("name").value;
  let nameParts = telefonename.trim().split(" ");
  let firstname = nameParts[0].charAt(0).toUpperCase();
  let lastname = nameParts[1]?.charAt(0).toUpperCase();
  let initials = firstname + (lastname || "");
  let color = getColorFromString(telefonename);
  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;
  return { telefonename, initials, color, email, phone };
}

async function savedata(contactKey) {
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    return;
  }
  const { telefonename, initials, color, email, phone } =
    await savedatainputs();
  if (!telefonename || !email || !phone) {
    return;
  }
  const response = await putData(`/users/1/contacts/${contactKey}`, {
    color: color,
    initials: initials,
    name: telefonename,
    email: email,
    telefone: phone,
  });
  resultssaveddata(contactKey);
}

async function resultssaveddata(contactKey) {
  await showcontacts(1);
  closecontactstemplate();
  setTimeout(() => {
    showcontacttemplate(contactKey);
  }, 500);
}

/**
 * Sends a PUT request to update contact data.
 * @param {string} path - API endpoint for updating contact data.
 * @param {Object} data - Contact data to update.
 * @returns {Promise<Object>} Response from the server.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Toggles the visibility of a dropdown menu.
 */
function toggleMenu() {
  const menu = document.getElementById("dropupMenu");
  if (menu.style.display === "block" || menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

/**
 * Closes the dropdown menu when clicking outside of it.
 * @param {Event} event - Click event.
 */
window.onclick = function (event) {
  const menu = document.getElementById("dropupMenu");
  if (
    !event.target.closest("#dropupMenu") &&
    !event.target.matches(".overlay-options img")
  ) {
    menu.style.display = "none";
  }
};
