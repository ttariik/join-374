let initialsarrays = [];


const nameInput = document.getElementById("name");
const errorMessage = document.getElementById("error-message");
const phoneInput = document.getElementById("phone");
const phoneErrorMessage = document.getElementById("phone-error-message");


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


async function showInitials(id = 1) {
  let contacts = (await (await fetch(GLOBAL + `users/${id}/contacts.json`)).json())
    .filter((c) => c && c.name)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  contacts.forEach((contact) => {
    let [first, last] = contact.name.trim().split(" ");
    let initials = (first?.charAt(0) + (last?.charAt(0) || "")).toUpperCase();
    initialsarrays.push(initials);
  });
}


async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}


function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let r = (hash >> 24) & 0xff, g = (hash >> 16) & 0xff, b = (hash >> 8) & 0xff;
  const factor = 0.4;
  return `rgb(${Math.floor(r + (255 - r) * factor)}, ${Math.floor(g + (255 - g) * factor)}, ${Math.floor(b + (255 - b) * factor)})`;
}


function validatePhoneNumber(value) {
  const phonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phonePattern.test(value);
}


function validateInput(el, pattern, errorMsg) {
  const errorEl = document.getElementById(`${el.id}-error-message`);
  if (errorEl) { 
    if (!pattern.test(el.value.trim())) {
      errorEl.innerHTML = errorMsg;
      errorEl.style.display = "flex";
      el.classList.add("invalid");
      return false;
    } else {
      errorEl.innerHTML = "";
      el.classList.remove("invalid");
      return true;
    }
  }
  return true; 
}


function performCustomValidation() {
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("emailarea");
  
  const namePattern = /^[a-zA-Z\s\-]+$/;
  const phonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  let isValid = true;
  isValid &= validateInput(nameInput, namePattern, "Please enter a valid name");
  isValid &= validateInput(phoneInput, phonePattern, "Please enter a valid phone number.");
  isValid &= validateInput(emailInput, emailPattern, "Please enter a valid email address.");

  return isValid;
}