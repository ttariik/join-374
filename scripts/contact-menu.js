let displayedLetters = new Set(); // Changed to a Set for better management

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
  const response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  const responsestoJson = await response.json();

  contactUsers = Object.entries(responsestoJson || {})
    .map(([key, contact]) => ({ key, ...contact }))
    .filter((contact) => contact && contact.name)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  displayedLetters.clear();
  const contactMenu = document.getElementById("contactmenu");
  contactMenu.innerHTML = "";

  contactUsers.forEach((contact) => {
    contactMenu.innerHTML += contactsmenutemplate(contact);
  });
}

function contactsmenutemplate(contact) {
  console.log(contact);

  let firstLetter = contact.name.charAt(0).toUpperCase();

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
  }');">
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

async function edicontact(contactKey) {
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }
  document.getElementById("name").value = contact.name;
  document.getElementById("emailarea").value = contact.email || "";
  document.getElementById("phone").value = contact.telefone || "";
  document.getElementById("spantitle").innerHTML = "Edit contact";
  document.getElementById("spandescription").innerHTML = "";
  document.getElementById("formid").onsubmit = function (event) {
    event.preventDefault();
    savedata(contactKey);
  };

  opencontactstemplate();
}

async function deletecontact(contactKey) {
  const contactIndex = contactUsers.findIndex(
    (contact) => contact.key === contactKey
  );
  if (contactIndex === -1) {
    console.error("Contact not found");
    return;
  }

  await deleteData(`/users/1/contacts/${contactKey}`);
  await showcontacts(1);
  closecontactstemplate();
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

async function showcontacttemplate(contactKey) {
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  const contactTemplate = document.getElementById("contacttemplate");
  contactTemplate.style.display = "flex";
  contactTemplate.style.transform = "translateX(0%)";

  document.getElementById("title").innerHTML = contact.name;
  document.getElementById("email").innerHTML = contact.email || "";
  document.getElementById("telefone").innerHTML = contact.telefone || "";

  const editButton = document.getElementById("editbutton");
  editButton.onclick = () => edicontact(contactKey);

  const deleteButton = document.getElementById("deletebutton");
  deleteButton.onclick = () => deletecontact(contactKey);
}

async function savedata(contactKey) {
  const contact = contactUsers.find((user) => user.key === contactKey);

  let name = document.getElementById("name").value;
  let email = document.getElementById("emailarea").value;
  let telefone = document.getElementById("phone").value;
  putData(`/users/1/contacts/${contactKey}`, {
    name: name,
    email: email,
    telefone: telefone,
  });
  await showcontacts(contactKey, (id = 1));
  closecontactstemplate();
  setTimeout(() => {
    showcontacttemplate(contactKey);
  }, 0.5);
}

async function putData(path = "", data = {}) {
  console.log(`PUT request to ${GLOBAL + path}.json with data:`, data);

  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.error("Failed to update data:", response.statusText);
    return null;
  }

  return await response.json();
}

async function addEditSingleUser(contactKey, contact) {
  const result = await putData(`/users/1/contacts/${contactKey}`, contact);

  if (result) {
    console.log("Contact updated successfully:", result);
  }
}
