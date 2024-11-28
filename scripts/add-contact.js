let initialsarrays = [];


const nameInput = document.getElementById("name");
const errorMessage = document.getElementById("error-message");
const phoneInput = document.getElementById("phone");
const phoneErrorMessage = document.getElementById("phone-error-message");


async function addcontact(event) {
  event.preventDefault();
  if (!performCustomValidation()) return;
  let contactsPath = `/users/1/contacts`;
  let contactsData = await (await fetch(GLOBAL + contactsPath + ".json")).json() || await putData(contactsPath, {});
  let telefonename = document.getElementById("name").value;
  let [firstname, lastname] = telefonename.split(" ");
  let initials = (firstname.charAt(0) + (lastname?.charAt(0) || "")).toUpperCase();
  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;
  let color = getColorFromString(telefonename);
  await addEditSingleUser(1, { name: telefonename, email, telefone: phone, initials, color });
  emptyinputs();
  closecontactstemplate();
  showcontactlog();
}


function showcontactlog() {
  const overlay = document.getElementById("successfullcontactlogoverlay");
  overlay.style.transform = "translateX(126%)";
  setTimeout(() => { overlay.classList.remove("d-none"); overlay.style.transform = "translateX(0%)"; }, 50);
  setTimeout(() => { overlay.style.transform = "translateX(126%)"; }, 4000);
}


function emptyinputs() {
  document.getElementById("name").value = "";
  document.getElementById("emailarea").value = "";
  document.getElementById("phone").value = "";
  showcontacts();
}


async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
  });
  return await response.json();
}


async function addEditSingleUser(id = 1, contact = { name: "Kevin" }) {
  let userContacts = await getUserContacts(id) || {};
  let nextIndex = Math.max(...Object.keys(userContacts).map(Number), 0) + 1;
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

  contacts.forEach((contact) => initialsarrays.push((contact.name.trim().split(" ")[0]?.charAt(0) + (contact.name.split(" ")[1]?.charAt(0) || "")).toUpperCase()));
}


async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return await response.json();
}


function getColorFromString(str) {
  let hash = 0; for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  let r = (hash >> 24) & 0xff, g = (hash >> 16) & 0xff, b = (hash >> 8) & 0xff;
  return `rgb(${Math.floor(r + (255 - r) * 0.4)}, ${Math.floor(g + (255 - g) * 0.4)}, ${Math.floor(b + (255 - b) * 0.4)})`;
}


function validatePhoneNumber(value) {
  const phonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phonePattern.test(value);
}


function validateInput(el, pattern, errorMsg) {
  const errorEl = document.getElementById(`${el.id}-error-message`);
  if (errorEl) {
    if (!pattern.test(el.value.trim())) {
      errorEl.innerHTML = errorMsg; errorEl.style.display = "flex"; el.classList.add("invalid"); return false;
    } else { errorEl.innerHTML = ""; el.classList.remove("invalid"); return true; }
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
