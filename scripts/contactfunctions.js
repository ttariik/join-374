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

function bodylistener(event, contactDiv, checkbox, selectedContact, initials) {
  contactDiv.onclick = (event) => {
    resetcontact(contactDiv, checkbox, selectedContact.id, initials, event);
  };
}

function addcontactbadge(
  existingContact,
  initials,
  selectedContact,
  color,
  assignedUsersDiv,
  checkbox,
  contactDiv
) {
  // If the contact already exists, reset it
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

function resetcontact(contactDiv, checkbox, id, initials, event) {
  checkbox.checked = false; // Ensure checkbox is unchecked
  contactDiv.classList.remove("dark-blue");

  // Remove the contact from assigned lists
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== id);

  // Remove the associated badge
  const badge = document.querySelector(
    `.badgeassigned[data-initials="${initials}"]`
  );
  if (badge) {
    badge.remove();
  }

  // Reset the click event to allow re-selecting
  contactDiv.onclick = (event) => {
    selectcontact(id, event);
  };
}

// Function to filter contacts based on search input
function filterContacts(event) {
  const filter = event.target.value.toLowerCase();

  // Filter contacts based on the search input
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter)
  );

  // Re-render the filtered contacts
  renderContacts(filteredContacts);
}

// Function to generate the search bar HTML and add event listener for filtering
function searchbar() {
  return /*html*/ `
      <input id="search" type="text" class="searchbar" onclick="event.stopPropagation()" oninput="filterContacts(event)">
      <img src="/img/drop-up-arrow.png" alt="">
    `;
}

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

async function showcontacts(event) {
  let contactsBox;

  // Stop event propagation to prevent any outer handlers from being triggered
  if (event) event.stopPropagation();

  // Call smaller function
  smallerfunction();

  // Get the button or span target correctly
  const target = event.target.closest("button"); // Get the closest button to target (handles both button and span)

  // Check if target is inside the button
  if (target) {
    const parent = target.parentElement;
    if (parent.children[2].id === "contacts-box") {
      contactsBox = parent.children[2];
    } else {
      contactsBox = parent.children[1];
    }

    // If contactsBox is empty, fetch and render contacts, else open contacts box
    if (contactsBox && contactsBox.innerHTML.trim() === "") {
      await fetchAndRenderContacts();
      initializeSearchBar(contactsBox);
    } else {
      openContactsBox(contactsBox);
      initializeSearchBar(contactsBox);
    }
  }
}

async function fetchAndRenderContacts() {
  let response = await fetch(GLOBAL + `users/1/contacts.json`);
  let responsestoJson = await response.json();
  const contactss = processContacts(responsestoJson);
  contacts = contactss;
  initializeSearchBar();
  renderContacts(contacts);
}

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

function initializeSearchBar(contactsBox) {
  const selectButton =
    document.getElementById("selectbutton1") ||
    document.getElementById("selectbutton");
  selectButton.innerHTML = searchbar();
  selectButton.onclick = resetsearchbar;

  // Prevent body click listener from closing the dropdown
  document.getElementById("contacts-box").addEventListener("click", (event) => {
    event.stopPropagation(); // Stops the event from propagating to the body listener
  });

  if (document.getElementById("contacts-box1")) {
    document
      .getElementById("contacts-box1")
      .addEventListener("click", (event) => {
        event.stopPropagation(); // Prevents the event from bubbling up
      });
  }

  // Global click handler to close dropdown when clicking outside
  document.body.addEventListener("click", function (event) {
    const contactsBox1 = document.getElementById("contacts-box1");
    const contactsBox = document.getElementById("contacts-box");

    // Allow clicks inside open dropdowns
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

    // If clicked outside, reset the search bar
    resetsearchbar(event);
  });
}

function openContactsBox(contactsBox) {
  contactsBox.classList.remove("d-none");
  updateSelectButton();
}

function closeContactsBox(contactsBox) {
  contactsBox.classList.add("d-none");
  resetsearchbar(); // Reset search or related UI.
}

function updateSelectButton() {
  const selectButton =
    document.getElementById("selectbutton1") ||
    document.getElementById("selectbutton");
  selectButton.innerHTML = searchbar();
}

function renderContacts(contactList) {
  const contactHTML = generateContactHTML(contactList);
  const contactsBox = getContactsBox();
  contactsBox.innerHTML = contactHTML;

  if (isAssignedUsersPopulated()) {
    highlightAssignedUsers();
  }
}

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

function getContactsBox() {
  return (
    document.getElementById("contacts-box1") ||
    document.getElementById("contacts-box")
  );
}

function isAssignedUsersPopulated() {
  const assignedUsers = document.getElementById("assignedusers1");
  return assignedUsers && assignedUsers.innerHTML.trim() !== "";
}

function highlightAssignedUsers() {
  initialsArray.forEach((initialsObj) => {
    const matchedContact = findMatchedContact(initialsObj.initials);
    if (matchedContact) {
      highlightContact(matchedContact);
    } else {
    }
  });
}

function findMatchedContact(initials) {
  return contacts.find((contact) => contact.initials === initials);
}

function highlightContact(contact) {
  const contactElement = document.querySelector(
    `#contacts-box1 #div${contact.id}`
  );

  if (contactElement) {
    contactElement.classList.add("dark-blue");
    document.getElementById(`checkbox${contact.id}`).checked = true;
  } else {
  }
}
