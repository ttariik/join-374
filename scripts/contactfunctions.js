// Function to display the contact box
function showcontactbox() {
  const contactsBox = document.getElementById("contacts-box");
  const contactsBox1 = document.getElementById("contacts-box1");

  if (contactsBox) {
    contactsBox.classList.remove("d-none");
    contactsBox.style.display = "flex";
    document.getElementById("selectbutton").innerHTML = searchbar();
    document.getElementById("selectbutton").onclick = resetsearchbar;
  }

  if (contactsBox1) {
    contactsBox1.classList.remove("d-none");
    contactsBox1.style.display = "flex";
    document.getElementById("selectbutton1").innerHTML = searchbar();
    document.getElementById("selectbutton1").onclick = resetsearchbar;
  }
}

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
  checkAddTaskInputs();
}

function initialsdiv() {}

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

function resetsearchbar() {
  const contactsBox = document.getElementById("contacts-box");
  const contactsBox1 = document.getElementById("contacts-box1");

  if (contactsBox1) {
    document.getElementById("selectbutton1").innerHTML = `
        <span>Select contacts to assign</span>
        <img src="/img/arrow_drop_down.png" alt="" />`;
    contactsBox1.classList.add("d-none");
    contactsBox1.style.display = "none";
    document.getElementById("selectbutton1").onclick = showcontactbox;
  }

  if (contactsBox) {
    document.getElementById("selectbutton").innerHTML = `
        <span>Select contacts to assign</span>
        <img src="/img/arrow_drop_down.png" alt="" />`;
    contactsBox.classList.add("d-none");
    contactsBox.style.display = "none";
    document.getElementById("selectbutton").onclick = showcontactbox;
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

async function showcontacts() {
  smallerfunction();
  let response = await fetch(GLOBAL + `users/1/contacts.json`);
  let responsestoJson = await response.json();

  // Process the response to create a list of contact objects
  contacts = Object.entries(responsestoJson)
    .map(([firebaseId, contact]) => {
      if (contact && contact.name) {
        return {
          firebaseId,
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
        };
      }
      return null;
    })
    .filter((contact) => contact !== null);
  // Check if assignedusers1 is not empty and find corresponding contacts

  // Initialize the search bar
  if (document.getElementById("selectbutton1")) {
    document.getElementById("selectbutton1").onclick = resetsearchbar;
    document.getElementById("selectbutton1").innerHTML = searchbar();
  } else {
    document.getElementById("selectbutton").onclick = resetsearchbar;
    document.getElementById("selectbutton").innerHTML = searchbar();
  }

  // Render the contact list
  renderContacts(contacts);
}

// Function to render contacts
function renderContacts(contactList) {
  let contactHTML = "";
  contactList.forEach((contact) => {
    if (contact !== null) {
      const color = getColorFromString(contact.name);
      contactHTML += contactstemplate(contact, color);
    }
  });

  // Display the contacts inside the contact box
  const contactsBox =
    document.getElementById("contacts-box1") ||
    document.getElementById("contacts-box");
  contactsBox.innerHTML = contactHTML;
  if (
    document.getElementById("assignedusers1") &&
    document.getElementById("assignedusers1").innerHTML.trim() !== ""
  ) {
    initialsArray.forEach(function (initialsObj) {
      // Find the contact in the 'contacts' array that matches the initials
      const matchedContact = contacts.find(
        (contact) => contact.initials === initialsObj.initials
      );

      if (matchedContact) {
        const contactElement = document.querySelector(
          `#contacts-box1 #div${matchedContact.id}`
        );

        if (contactElement) {
          console.log("Found Contact Element:", contactElement);
          // Additional logic for highlighting, checking, etc.
          contactElement.classList.add("dark-blue");
          document.getElementById(
            `checkbox${matchedContact.id}`
          ).checked = true;
        } else {
          console.log(`Element with id div${matchedContact.id} not found.`);
        }
      } else {
        console.log(
          `Contact with initials ${initialsObj.initials} not found in contacts.`
        );
      }
    });
  } else {
  }
}
