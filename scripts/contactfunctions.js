/**
 * Retrieves the elements related to a contact and prepares the variables for processing.
 * @param {Object} contact - The contact object containing contact details.
 * @param {Event} event - The event triggering the function call.
 * @returns {Object} - The contact-related elements and properties.
 */
async function variables(contact, event) {
  const contactDiv = document.getElementById(`div${contact.id}`);
  const checkbox = document.getElementById(`checkbox${contact.id}`);
  const initials = contact.initials;
  const color = contact.color;
  const assignedUsersDiv =
    document.getElementById("assignedusers1") ||
    document.getElementById("assignedusers");

  return { contactDiv, checkbox, initials, color, assignedUsersDiv };
}

/**
 * Fetches all contacts from the server.
 * @returns {Object} - An object containing the entries of all contacts.
 */
async function fetchcontacts() {
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  const responsestoJson = await response.json();
  const entries = Object.entries(responsestoJson).map(([firebaseId, contact]) =>
    contact && contact.name
      ? {
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
          color: contact.color,
          email: contact.email,
          telefone: contact.telefone,
        }
      : null
  );
  return { entries };
}

/**
 * Handles the contact selection process.
 * @param {string} id - The id of the selected contact.
 * @param {Event} event - The event triggering the contact selection.
 */
async function selectcontact(id, event) {
  const { entries } = await fetchcontacts();
  const selectedContact = entries.find(
    (contact) => contact && contact.id === String(id)
  );
  if (!selectedContact) {
    return;
  }
  const existingContact = initialsArray.find(
    (contact) => contact.id === selectedContact.id
  );
  const { contactDiv, checkbox, initials, color, assignedUsersDiv } =
    await variables(selectedContact);

  if (event.target.parentElement.classList.contains("custom-checkbox")) {
    event.stopPropagation();
    contactDiv.click();
    return;
  } else {
    checkbox.checked = true;
    contactDiv.classList.add("dark-blue");
  }
  addcontactbadge(
    existingContact,
    initials,
    selectedContact,
    color,
    assignedUsersDiv,
    checkbox,
    contactDiv
  );
  bodylistener(event, contactDiv, checkbox, selectedContact, initials);
}

/**
 * Attaches a listener to reset contact when clicked.
 * @param {Event} event - The event triggering the reset.
 * @param {Element} contactDiv - The contact's div element.
 * @param {Element} checkbox - The checkbox associated with the contact.
 * @param {Object} selectedContact - The contact object.
 * @param {string} initials - The initials of the contact.
 */
function bodylistener(event, contactDiv, checkbox, selectedContact, initials) {
  contactDiv.onclick = (event) => {
    resetcontact(contactDiv, checkbox, selectedContact.id, initials, event);
  };
}

/**
 * Adds a badge to the list of assigned users when a contact is selected.
 * @param {Object} existingContact - The previously selected contact (if any).
 * @param {string} initials - The initials of the selected contact.
 * @param {Object} selectedContact - The selected contact object.
 * @param {string} color - The color associated with the contact.
 * @param {Element} assignedUsersDiv - The div to append the badge to.
 * @param {Element} checkbox - The checkbox associated with the contact.
 * @param {Element} contactDiv - The contact's div element.
 */
function addcontactbadge(
  existingContact,
  initials,
  selectedContact,
  color,
  assignedUsersDiv,
  checkbox,
  contactDiv
) {
  if (existingContact) {
    resetcontact(contactDiv, checkbox, selectedContact.id, initials);
    return;
  }
  asignedtousers.push(initials);
  initialsArray.push({
    id: selectedContact.id,
    initials: initials,
    name: selectedContact.name,
  });
  const badge = badgecreation(color, initials);
  if (!assignedUsersDiv.querySelector(`[data-initials="${initials}"]`)) {
    assignedUsersDiv.appendChild(badge);
  }
}

/**
 * Creates a badge element for the assigned user.
 * @param {string} color - The color for the badge background.
 * @param {string} initials - The initials displayed on the badge.
 * @returns {Element} - The badge DOM element.
 */
function badgecreation(color, initials) {
  const badge = document.createElement("div");
  badge.className = "badgeassigned badge";
  badge.style.backgroundColor = color;
  badge.textContent = initials;
  badge.setAttribute("data-initials", initials);
  badge.style.width = "32px";
  badge.style.height = "32px";
  badge.style.marginLeft = "0";
  return badge;
}

/**
 * Resets the contact selection, removing the contact badge and resetting states.
 * @param {Element} contactDiv - The contact's div element.
 * @param {Element} checkbox - The checkbox associated with the contact.
 * @param {string} id - The id of the contact.
 * @param {string} initials - The initials of the contact.
 * @param {Event} event - The event triggering the reset.
 */
function resetcontact(contactDiv, checkbox, id, initials, event) {
  checkbox.checked = false; // Ensure checkbox is unchecked
  contactDiv.classList.remove("dark-blue");
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== id);
  const badge = document.querySelector(
    `.badgeassigned[data-initials="${initials}"]`
  );
  if (badge) {
    badge.remove();
  }
  contactDiv.onclick = (event) => {
    selectcontact(id, event);
  };
}

/**
 * Filters the contacts based on the input value.
 * @param {Event} event - The input event triggered by the user.
 */
function filterContacts(event) {
  const filter = event.target.value.toLowerCase();
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter)
  );
  renderContacts(filteredContacts);
}

/**
 * Renders the search bar for filtering contacts.
 * @returns {string} - The HTML string for the search bar.
 */
function searchbar() {
  return /*html*/ `
      <input id="search" type="text" class="searchbar" onclick="event.stopPropagation()" oninput="filterContacts(event)">
      <img src="/img/drop-up-arrow.png" alt="">
    `;
}

/**
 * Resets the search bar and hides the contacts dropdown.
 * @param {Event} event - The event triggered by the user.
 */
async function resetsearchbar(event) {
  const contactsBox = document.getElementById("contacts-box");
  const contactsBox1 = document.getElementById("contacts-box1");
  if (contactsBox1) {
    document.getElementById("selectbutton1").innerHTML = `
        <span>Select contacts to assign</span>
        <img src="/img/arrow_drop_down.png" alt="" />`;
    contactsBox1.classList.add("d-none");
    document.getElementById("selectbutton1").onclick = showcontacts;
  }
  if (contactsBox) {
    document.getElementById("selectbutton").innerHTML = `
        <span>Select contacts to assign</span>
        <img src="/img/arrow_drop_down.png" alt="" />`;
    contactsBox.classList.add("d-none");
    document.getElementById("selectbutton").onclick = showcontacts;
  }
}

/**
 * Handles the display of the contact box.
 */
function smallerfunction() {
  const contactsBox1 = document.getElementById("contacts-box1");
  const contactsBox = document.getElementById("contacts-box");

  if (contactsBox1) {
    contactsBox1.style.display = "flex";
    contactsBox1.style.top = "34%";
    contactsBox1.style.left = "-5px";
  } else if (contactsBox) {
    contactsBox.style.display = "flex";
  }
}

/**
 * Displays the contacts when the user interacts with the button.
 * @param {Event} event - The event triggering the function.
 */
async function showcontacts(event) {
  let contactsBox;
  if (event) event.stopPropagation();
  smallerfunction();
  const target = event.target.closest("button");
  if (target) {
    const parent = target.parentElement;
    if (parent.children[2].id === "contacts-box") {
      contactsBox = parent.children[2];
    } else {
      contactsBox = parent.children[1];
    }
    ifshowcontactspart(contactsBox);
  }
}

/**
 * Checks if the contact box is empty, fetches contacts if necessary, and opens the box.
 * @param {HTMLElement} contactsBox - The element representing the contacts box.
 */
async function ifshowcontactspart(contactsBox) {
  if (contactsBox && contactsBox.innerHTML.trim() === "") {
    await fetchAndRenderContacts();
    initializeSearchBar(contactsBox);
  } else {
    openContactsBox(contactsBox);
    initializeSearchBar(contactsBox);
  }
}

/**
 * Fetches and renders contacts, initializing the search bar.
 */
async function fetchAndRenderContacts() {
  let response = await fetch(GLOBAL + `users/1/contacts.json`);
  let responsestoJson = await response.json();
  const contactss = processContacts(responsestoJson);
  contacts = contactss;
  initializeSearchBar();
  renderContacts(contacts);
}

/**
 * Processes the raw contact data into a structured format.
 * @param {Object} responsestoJson - The raw contact data.
 * @returns {Array} - A list of processed contacts.
 */
function processContacts(responsestoJson) {
  return Object.entries(responsestoJson)
    .map(([firebaseId, contact]) =>
      contact?.name
        ? {
            firebaseId,
            id: firebaseId,
            initials: contact.initials,
            name: contact.name,
          }
        : null
    )
    .filter(Boolean);
}

/**
 * Initializes the search bar in the contact selection box.
 * @param {HTMLElement} contactsBox - The contacts box element.
 */
function initializeSearchBar(contactsBox) {
  const selectButton =
    document.getElementById("selectbutton1") ||
    document.getElementById("selectbutton");
  selectButton.innerHTML = searchbar();
  selectButton.onclick = resetsearchbar;
  document.getElementById("contacts-box").addEventListener("click", (event) => {
    event.stopPropagation();
  });
  if (document.getElementById("contacts-box1")) {
    document
      .getElementById("contacts-box1")
      .addEventListener("click", (event) => {
        event.stopPropagation();
      });
  }
  clickbodylistener();
}

/**
 * Adds a listener to the body to handle clicks outside the contacts box.
 */
function clickbodylistener() {
  document.body.addEventListener("click", function (event) {
    const contactsBox1 = document.getElementById("contacts-box1");
    const contactsBox = document.getElementById("contacts-box");
    if (
      (contactsBox &&
        event.target.parentElement.id === "contacts-box" &&
        !contactsBox.classList.contains("d-none")) ||
      (contactsBox1 &&
        event.target.parentElement.id === "contacts-box1" &&
        !contactsBox1.classList.contains("d-none"))
    ) {
      return;
    }
    openContactsBox(contactsBox);
    resetsearchbar(event);
  });
}

/**
 * Opens the contacts box and updates the select button.
 * @param {HTMLElement} contactsBox - The element representing the contacts box.
 */
function openContactsBox(contactsBox) {
  contactsBox.classList.remove("d-none");
  updateSelectButton();
}

/**
 * Closes the contacts box and resets the search bar.
 * @param {HTMLElement} contactsBox - The element representing the contacts box.
 */
function closeContactsBox(contactsBox) {
  contactsBox.classList.add("d-none");
  resetsearchbar(); // Reset search or related UI.
}

/**
 * Updates the select button to show the search bar.
 */
function updateSelectButton() {
  const selectButton =
    document.getElementById("selectbutton1") ||
    document.getElementById("selectbutton");
  selectButton.innerHTML = searchbar();
}

/**
 * Renders the contacts into the contacts box.
 * @param {Array} contactList - A list of contacts to be rendered.
 */
function renderContacts(contactList) {
  const contactHTML = generateContactHTML(contactList);
  const contactsBox = getContactsBox();
  contactsBox.innerHTML = contactHTML;
  if (isAssignedUsersPopulated()) {
    highlightAssignedUsers();
  }
}

/**
 * Generates the HTML content for a list of contacts.
 * @param {Array} contactList - The list of contacts.
 * @returns {string} - The HTML string for the contacts.
 */
function generateContactHTML(contactList) {
  let contactHTML = "";
  contactList.forEach((contact) => {
    if (contact !== null) {
      const color = getColorFromString(contact.name);
      contactHTML += contactstemplate(contact, color);
    }
  });
  return contactHTML;
}

/**
 * Retrieves the contacts box element.
 * @returns {HTMLElement} - The contacts box element.
 */
function getContactsBox() {
  return (
    document.getElementById("contacts-box1") ||
    document.getElementById("contacts-box")
  );
}

/**
 * Checks if the assigned users list is populated.
 * @returns {boolean} - True if the assigned users list has content, otherwise false.
 */
function isAssignedUsersPopulated() {
  const assignedUsers = document.getElementById("assignedusers1");
  return assignedUsers && assignedUsers.innerHTML.trim() !== "";
}

/**
 * Highlights the assigned users in the contact list.
 */
function highlightAssignedUsers() {
  initialsArray.forEach((initialsObj) => {
    const matchedContact = findMatchedContact(initialsObj.initials);
    if (matchedContact) {
      highlightContact(matchedContact);
    }
  });
}

/**
 * Finds a contact that matches the given initials.
 * @param {string} initials - The initials to match.
 * @returns {Object|null} - The matched contact or null if not found.
 */
function findMatchedContact(initials) {
  return contacts.find((contact) => contact.initials === initials);
}

/**
 * Highlights a contact in the contacts box.
 * @param {Object} contact - The contact to highlight.
 */
function highlightContact(contact) {
  const contactElement = document.querySelector(
    `#contacts-box1 #div${contact.id}`
  );
  if (contactElement) {
    contactElement.classList.add("dark-blue");
    document.getElementById(`checkbox${contact.id}`).checked = true;
  }
}
