let displayedLetters = new Set();

async function opencontactstemplate() {
  document.getElementById("overlayaddcontact").classList.remove("d-none");
  document.getElementById("overlayaddcontact").classList.add("overlay2");
  document.querySelector(".overlay2").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay2").style.transform = "translateX(0%)";
  }, 0.5);
  document.getElementById("");
}

function closecontactstemplate() {
  document.querySelector(".overlay2").style.transform = "translateX(126%)";
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
  let firstLetter = contact.name.charAt(0).toUpperCase();
  let title = ""; // Define title here

  // Only create the title if it hasn't been displayed already
  if (!displayedLetters.has(firstLetter)) {
    title = `<h2>${firstLetter}</h2>
             <div class="lineseperator"></div>`;
    displayedLetters.add(firstLetter); // Add the letter to the set to prevent it from being repeated
  }

  const color = getColorFromString(contact.name);

  return /*html*/ `
      ${title} <!-- Only renders title once per letter -->
      <div class="align" id="${contact.key}" onclick="showcontacttemplate('${contact.key
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
  document.getElementById("overlayaddcontact").classList.remove("d-none");
  document.getElementById("overlayaddcontact").classList.add("overlay2");

  document.getElementById("spantitle").innerHTML = "Edit contact";
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }
  document.getElementById("name").value = contact.name;
  document.getElementById("emailarea").value = contact.email || "";
  document.getElementById("phone").value = contact.telefone || "";
  document.getElementById("spandescription").innerHTML = "";
  document.getElementById("formid").onsubmit = function (event) {
    event.preventDefault();
    savedata(contactKey);
  };
  document.getElementById("overlayaddcontact").style.display = "flex";
  setTimeout(() => {
    document.getElementById("overlayaddcontact").style.transform =
      "translateX(0%)";
  }, 0.5);
}

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

async function deletecontact(contactKey) {
  const contactIndex = contactUsers.findIndex(
    (contact) => contact.key === contactKey
  );
  if (contactIndex === -1) {
    console.error("Contact not found");
    return;
  }

  await deleteData(`/users/1/contacts/${contactKey}`);
  showcontacts((id = 1));
  document.getElementById("contacttemplate").classList.add("d-none");
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

function closecontacttemplate(contactkey) {
  document.getElementById("contacttemplate").style.transform =
    "translateX(250%)";
  document.getElementById(`${contactkey}`).onclick = () =>
    showcontacttemplate(contactkey);
}

async function showcontacttemplate(contactKey) {
  document.getElementById("contacttemplate").classList.remove("d-none");

  const contact = contactUsers.find((user) => user.key === contactKey);

  document.getElementById("title").innerHTML = contact.name;
  document.getElementById("email").innerHTML = contact.email || "";
  document.getElementById("telefone").innerHTML = contact.telefone || "";
  document.getElementById("badge").style.backgroundColor = `${contact.color}`;
  document.getElementById("badge").innerHTML = `${contact.initials}`;
  document.getElementById("editbutton").onclick = () => edicontact(contact.key);
  document.getElementById("deletebutton").onclick = () =>
    deletecontact(contact.key);
  document.getElementById("editbutton-overlay").onclick = () =>
    edicontact(contact.key);
    closeaddcontacttemplate();
  document.getElementById("deletebutton-overlay").onclick = () =>
    deletecontact(contact.key);

  const contactTemplate = document.getElementById("contacttemplate");
  contactTemplate.style.display = "flex";
  contactTemplate.style.transform = "translateX(0%)";
  document.getElementById(`${contact.key}`).onclick = () =>
    closecontacttemplate(contact.key);
}

function returntomenu() {
  document.querySelector(".boxalignment").style.display = "none";
  document.querySelector(".contact-content-wrapper").style.display = "unset";
}

async function savedata(contactKey) {
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  let telefonename = document.getElementById("name").value;
  let nameParts = telefonename.trim().split(" ");
  let firstname = nameParts[0].charAt(0).toUpperCase();
  let lastname = nameParts[1]?.charAt(0).toUpperCase();
  let initials = firstname + (lastname || "");
  let color = getColorFromString(telefonename);
  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;

  if (!telefonename || !email || !telefone) {
    alert("All fields must be filled out.");
    return;
  }

  const response = await putData(`/users/1/contacts/${contactKey}`, {
    color: color,
    initials: initials,
    name: telefonename,
    email: email,
    telefone: phone,
  });

  await showcontacts(1);
  closecontactstemplate();

  setTimeout(() => {
    showcontacttemplate(contactKey);
  }, 500);
}

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

async function addEditSingleUser(contactKey, contact) {
  const result = await putData(`/users/1/contacts/${contactKey}`, contact);
}

function toggleMenu() {
  const menu = document.getElementById("dropupMenu");
  if (menu.style.display === "block" || menu.style.display === "flex") {
    menu.style.display = "none";
  } else {
    menu.style.display = "flex";
  }
}

window.onclick = function (event) {
  const menu = document.getElementById("dropupMenu");
  if (
    !event.target.closest("#dropupMenu") &&
    !event.target.matches(".overlay-options img")
  ) {
    menu.style.display = "none";
  }
};
