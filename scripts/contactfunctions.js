function contactstemplate(contact, color) {
  return /*html*/ `
      <li class="contact-menudesign" id="div${contact.id}" onclick="selectcontact(${contact.id})">
        <div class="splitdivs">
          <div class="contactbox-badge" style="background-color:${color}">${contact.initials}</div>
          <div>${contact.name}</div>
        </div>
        <label class="custom-checkbox" >
          <input type="checkbox" id="checkbox${contact.id}" class="checkboxdesign" />
          <span class="checkmark" ></span>
        </label>
      </li>
    `;
}

async function variables(contact) {
  const contactDiv = document.getElementById(`div${contact.id}`);
  const checkbox = document.getElementById(`checkbox${contact.id}`);

  const initials = contact.initials;
  const color = contact.color;
  const assignedUsersDiv =
    document.getElementById("assignedusers1") ||
    document.getElementById("assignedusers");
  return { contactDiv, checkbox, initials, color, assignedUsersDiv };
}

async function selectcontact(id) {
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
  const selectedContact = entries.find(
    (contact) => contact && contact.id === String(id)
  );

  const { contactDiv, checkbox, initials, color, assignedUsersDiv } =
    await variables(selectedContact);
  asignedtousers.push(initials);

  initialsArray.push({
    id: selectedContact.id, // Use selectedContact's ID
    initials: initials,
    name: selectedContact.name, // Correctly reference the name
  });

  checkbox.checked = !checkbox.checked;
  const badge = document.createElement("div");
  badge.className = "badgeassigned badge";
  badge.style.backgroundColor = color;
  badge.textContent = initials;
  badge.setAttribute("data-initials", initials);
  badge.style.width = "32px";
  badge.style.height = "32px";
  badge.style.marginLeft = "0";
  assignedUsersDiv.appendChild(badge);
  contactDiv.classList.add("dark-blue");
  contactDiv.onclick = function () {
    resetcontact(contactDiv, checkbox, selectedContact.id, initials);
  };
}

function resetcontact(contactDiv, checkbox, id, initials) {
  checkbox.checked = false;
  contactDiv.classList.remove("dark-blue");
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== id); // Corrected from firebaseId to id

  const badge = document.querySelector(
    `.badgeassigned[data-initials="${initials}"]`
  );
  if (badge) {
    badge.remove();
  }
  contactDiv.onclick = function () {
    selectcontact(id);
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
  if (event) event.stopPropagation();
  smallerfunction();
  const contactsBox =
    document.getElementById("contacts-box") ||
    document.getElementById("contacts-box1");

  if (contactsBox && contactsBox.innerHTML.trim() === "") {
    await fetchAndRenderContacts();
    initializeSearchBar(contactsBox);
  } else {
    openContactsBox(contactsBox);
    initializeSearchBar(contactsBox);
  }
}

function toggleContactsBox(contactsBox) {
  if (
    contactsBox.classList.contains("d-none") ||
    contactsBox.innerHTML.trim() === ""
  ) {
    openContactsBox(contactsBox);
  } else {
    closeContactsBox(contactsBox);
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
  document.body.addEventListener("click", function (event) {
    if (
      event.target.parentElement.id === "contacts-box" &&
      !document.getElementById("contacts-box").classList.contains("d-none")
    ) {
      return;
    } else {
      resetsearchbar(event);
    }
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
