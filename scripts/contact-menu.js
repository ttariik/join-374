function opencontactstemplate() {
  document.querySelector(".overlay2").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay2").style.transform = "translateX(0%)";
  }, 0.5);
}

function closecontactstemplate() {
  document.querySelector(".overlay2").style.transform = "translateX(126%)";
  setTimeout(() => {
    document.querySelector(".overlay2").style.display = "none";
  }, 100);
}

async function showcontacts(id = 1) {
  const responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();

  // Store Firebase data with keys
  contactUsers = Object.entries(responsestoJson || {})
    .map(([key, contact]) => ({ key, ...contact }))
    .filter((contact) => contact && contact.name)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  let displayedLetters = new Set();
  const contactMenu = document.getElementById("contactmenu");
  contactMenu.innerHTML = "";
  contactUsers.forEach((contact) => {
    contactMenu.innerHTML += contactsmenutemplate(contact, displayedLetters);
  });
}

function contactsmenutemplate(contact, displayedLetters) {
  let firstLetter = contact.name.charAt(0).toUpperCase();

  // Title for new letter
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
  }')">
        <div class="badge" style="background-color: ${color};">
          ${contact.initials || contact.name.charAt(0).toUpperCase()}
        </div>
        <div class="secondpart">
          <div class="name">${contact.name}</div>
          <div class="email">${contact.email || ""}</div>
        </div>
      </div>
  `;
}

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

function resetclick(contactKey) {
  document.getElementById("contacttemplate").style =
    "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("contacttemplate").style.display = "none";
  }, 10);
  document.getElementById(contactKey).onclick = () =>
    showcontacttemplate(contactKey);
}

async function edicontact(contactKey, id = 1) {
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  // Populate the form with the contact's details
  document.getElementById("name").value = contact.name;
  document.getElementById("emailarea").value = contact.email || "";
  document.getElementById("phone").value = contact.telefone || "";

  document.getElementById("spantitle").innerHTML = "Edit contact";
  document.getElementById("spandescription").remove();
  opencontactstemplate();
}

async function deletecontact(contactKey) {
  // Find the contact index using the key directly, and ensure it’s assigned before further operations
  const contactIndex = contactUsers.findIndex(
    (contact) => contact.key === contactKey
  );
  if (contactIndex === -1) {
    console.error("Contact not found");
    return;
  }

  // Perform the deletion in Firebase and refresh the UI
  await deleteData(`/users/1/contacts/${contactKey}`);
  await showcontacts(1); // Refresh the UI
  document.getElementById("contacttemplate").innerHTML = "";
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

function showcontacttemplate(contactKey) {
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  // Populate the template with contact details
  document.getElementById("contacttemplate").style.display = "flex";
  document.getElementById("title").innerHTML = contact.name;
  document.getElementById("email").innerHTML = contact.email || "";
  document.getElementById("telefone").innerHTML = contact.telefone || "";

  // Update the edit button
  const editButton = document.getElementById("editbutton");
  editButton.replaceWith(editButton.cloneNode(true)); // Clear previous listeners
  document.getElementById("editbutton").addEventListener("click", function () {
    edicontact(contactKey);
  });

  // Update the delete button
  const deleteButton = document.getElementById("deletebutton");
  deleteButton.replaceWith(deleteButton.cloneNode(true)); // Clear previous listeners
  document
    .getElementById("deletebutton")
    .addEventListener("click", function () {
      deletecontact(contactKey);
    });

  // Show the template with the selected contact's information
  document.getElementById("contacttemplate").style.transform = "translateX(0%)";
}
