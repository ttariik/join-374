let initialsarrays = [];

async function addcontact(event) {
  event.preventDefault();
  let form = document.querySelector("form");

  if (!performCustomValidation()) {
    return;
  }

  let contactsPath = `/users/1/contacts`;
  let contactsResponse = await fetch(GLOBAL + contactsPath + ".json");
  let contactsData = await contactsResponse.json();

  if (!contactsData) {
    await putData(contactsPath, {});
  }
  let telefonename = document.getElementById("name").value;
  let nameParts = telefonename.trim().split(" ");
  let firstname = nameParts[0].charAt(0).toUpperCase();
  let lastname = nameParts[1]?.charAt(0).toUpperCase();
  let initials = firstname + (lastname || "");
  let color = getColorFromString(telefonename);
  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;

  await addEditSingleUser(1, {
    name: telefonename,
    email: email,
    telefone: phone,
    initials: initials,
    color: color,
  });

  emptyinputs();
  closecontactstemplate();
  showcontactlog();
}

function showcontactlog() {
  const overlay = document.getElementById("successfullcontactlogoverlay");
  
  overlay.style = "transform: translateX(126%); transition: transform 0.2s ease;";
  setTimeout(() => {
    overlay.classList.remove("d-none"); 
    overlay.style.transform = "translateX(0%)"; 
  }, 50);

  setTimeout(() => {
    overlay.style.transform = "translateX(126%)"; 
  }, 4000); 
}

function emptyinputs() {
  document.getElementById("name").value = "";
  document.getElementById("emailarea").value = "";
  document.getElementById("phone").value = "";
  showcontacts();
}

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

async function addEditSingleUser(id = 1, contact = { name: "Kevin" }) {
  let userContacts = await getUserContacts(id);

  if (!userContacts) {
    userContacts = {};
  }

  let existingIndexes = Object.keys(userContacts).map(Number);

  let nextIndex =
    existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;

  await putData(`users/${id}/contacts/${nextIndex}`, contact);
}

async function getUserContacts(id) {
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  return await response.json();
}

async function showinitials(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();

  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );

  responsestoJson.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  for (let index = 0; index < responsestoJson.length; index++) {
    let firstlastname = responsestoJson[index].name.trim().split(" ");
    let firstname = firstlastname[0].charAt(0).toUpperCase();
    let lastname = firstlastname[1].charAt(0).toUpperCase();
    if (firstname && lastname) {
      initials = firstname + lastname;
    } else {
      initials = firstname;
    }
    initialsarrays.push(initials);
  }
  console.log(initialsarrays);
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
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

const nameInput = document.getElementById("name");
const errorMessage = document.getElementById("error-message");

const phoneInput = document.getElementById("phone");
const phoneErrorMessage = document.getElementById("phone-error-message");

function validatePhoneNumber(value) {
  const phonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phonePattern.test(value);
}

function validateEmail(value) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(value);
}

function performCustomValidation() {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("emailarea");

  const nameErrorMessage = document.getElementById("name-error-message");
  const phoneErrorMessage = document.getElementById("phone-error-message");
  const emailErrorMessage = document.getElementById("email-error-message");

  let isValid = true;

  const namePattern = /^[a-zA-Z\s\-]+$/;
  const phonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!namePattern.test(nameInput.value.trim())) {
    nameErrorMessage.innerHTML =
      "Please enter a valid name (letters, spaces, and hyphens only).";
    nameErrorMessage.classList.remove("d-none");
    nameInput.classList.add("invalid");
    isValid = false;
  } else {
    nameErrorMessage.innerHTML = "";
    nameInput.classList.remove("invalid");
  }

  if (!phonePattern.test(phoneInput.value.trim())) {
    phoneErrorMessage.style.display = "flex";
    phoneErrorMessage.innerHTML = "Please enter a valid phone number.";
    phoneInput.classList.add("invalid");
    isValid = false;
  } else {
    phoneErrorMessage.innerHTML = "";
    phoneInput.classList.remove("invalid");
  }

  if (!emailPattern.test(emailInput.value.trim())) {
    emailErrorMessage.style.display = "flex";
    emailErrorMessage.innerHTML = "Please enter a valid email address.";
    emailInput.classList.add("invalid");
    isValid = false;
  } else {
    emailErrorMessage.innerHTML = "";
    emailInput.classList.remove("invalid");
  }

  return isValid;
}
