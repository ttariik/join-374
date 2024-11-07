let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null;
let subtasks = [];
let initialsarra = [];
let asignedtousers = [];
let usernamecolor = [];
let initialsArray = [];

function selectbutton_1() {
  document.getElementById("button1").classList.toggle("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");

  const urgentImg = document.getElementById("urgentImg");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";

  const urgentText = document.getElementById("urgent");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";
}

function selectbutton_2() {
  document.getElementById("button2").classList.toggle("lightorange");
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button3").classList.remove("lightgreen");

  const mediumImg = document.getElementById("mediumImg");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";

  const mediumText = document.getElementById("medium");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("low").style.color = "black";
}

function selectbutton_3() {
  document.getElementById("button3").classList.toggle("lightgreen");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightred");

  const lowImg = document.getElementById("lowImg");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";

  const lowText = document.getElementById("low");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
}

function clearinputs() {
  document.getElementById("myform").reset();
  emptyinputs();
}

function resetsubtaskinput() {
  subtaskiconsreset();
}

function handleButtonClick(priority) {
  selectedPriority = priority;
}

async function addtask(event) {
  event.preventDefault();

  const form = document.querySelector("form");
  if (!form.checkValidity() || !selectedPriority) {
    form.reportValidity();
    if (!selectedPriority) alert("Please select a priority!");
    return;
  }
  let userResponse = await getAllUsers("users");
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let duedate = document.getElementById("date").value;
  let category = document.getElementById("Category").value;
  let UserKeyArray = Object.keys(userResponse);
  if (!selectedPriority) {
    alert("Please select a priority!");
    return;
  }
  for (let index = 0; index < UserKeyArray.length; index++) {
    users.push({
      id: UserKeyArray[index],
      user: userResponse[UserKeyArray[index]],
    });
  }
  await addEditSingleUser((id = 1), {
    title: title,
    description: description,
    asignedto: asignedtousers,
    prio: selectedPriority,
    duedate: duedate,
    category: category,
    subtask: subtasks.map((subtask) => ({
      subtask: subtask,
      completed: false,
    })),
    initials: initialsArray,
  });
  emptyinputs();
}

function emptyinputs() {
  let form = document.querySelector("form");
  form.reset();
  document.getElementById("assignedusers").innerHTML = "";
  document.getElementById("subtasksbox").innerHTML = "";
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button1").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightgreen");
  asignedtousers = [];
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

async function addEditSingleUser(id = 1, tasks) {
  let usertasks = await getUserTasks(id);
  if (!usertasks) {
    usertasks = {};
  }
  let existingIndexes = Object.keys(usertasks).map(Number);
  let nextIndex =
    existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;
  await putData(`users/${id}/tasks/todo-folder/${nextIndex}`, tasks);
}

async function getUserTaskss(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
}

async function getUserTasks(id) {
  let response = await fetch(
    GLOBAL +
      `users/${id}/tasks/todo-folder
.json`
  );
  return await response.json();
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

function subtaskchangeicons() {
  document.getElementById("inputsubtask1").classList.add("d-none");
  document.getElementById("inputsubtask2").classList.remove("d-none");
  document.getElementById("inputsubtask3").classList.remove("d-none");
  document.getElementById("seperate").classList.remove("d-none");
}

function subtaskiconsreset() {
  document.getElementById("inputsubtask1").classList.remove("d-none");
  document.getElementById("inputsubtask2").classList.add("d-none");
  document.getElementById("inputsubtask3").classList.add("d-none");
  document.getElementById("seperate").classList.add("d-none");
  document.getElementById("subtaskinput").value = "";
}

function addsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  document.getElementById("subtasksbox").innerHTML +=
    subtaskstemplate(subtaskinput1);
  subtasks.push(subtaskinput1);
  subtaskiconsreset();
}

function resetsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  subtaskinput1.reset();
  document.getElementById("subtasksbox").innerHTML = "";
}

function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
    <div class="subbox">
      <div>•</div>
      <div>${subtaskinput1}</div>
      <button class="d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button class="d-none"><img src="/img/check.png" alt="Check" /></button>
    </div>
  `;
}

function smallerfunction() {
  document.getElementById("contacts-box").style.display = "flex";
  document.getElementById("selectboxbutton").onclick = "";
}

async function showcontacts(id = 1) {
  smallerfunction();
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await response.json();

  responsestoJson = Object.entries(responsestoJson).map(
    ([firebaseId, contact]) => {
      if (contact && contact.name) {
        return {
          firebaseId,
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
        };
      }
      return null;
    }
  );
  document.getElementById("selectboxbutton").onclick = resetsearchbar;

  document.getElementById("selectboxbutton").innerHTML = searchbar(); // Assuming `searchbar()` returns HTML

  let contactHTML = "";

  responsestoJson.forEach((contact) => {
    if (contact !== null) {
      users.push(contact.name);
      const color = getColorFromString(contact.name);
      usernamecolor.push(color);

      contactHTML += contactstemplate(contact, color);
    }
  });

  document.getElementById("contacts-box").innerHTML = contactHTML;
}

function resetsearchbar() {
  document.getElementById("selectboxbutton").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />
  `;
  document.getElementById("contacts-box").innerHTML = "";
  document.querySelector(".outsidedesign").style.position = "absolute";
  document.getElementById("selectboxbutton").onclick = function () {
    showcontacts();
  };
}

function searchbar() {
  return /*html*/ `
  <input type="text" class="searchbar"> <img src="/img/drop-up-arrow.png" alt="">
  `;
}

function contactstemplate(contact, color) {
  return /*html*/ `
    <li class="contact-menudesign" id="div${contact.id}" onclick="selectcontact(${contact.id})">
      <div class="splitdivs">
        <div class="contactbox-badge badge" style="background-color:${color}">${contact.initials}</div>
        <div>${contact.name}</div>
      </div>
      <label class="custom-checkbox" >
        <input type="checkbox" id="checkbox${contact.id}" class="checkboxdesign" />
        <span class="checkmark" ></span>
      </label>
    </li>
  `;
}

function variables(contact) {
  const contactDiv = document.getElementById(`div${contact.id}`);
  const checkbox = document.getElementById(`checkbox${contact.id}`);

  const initials = contact.initials;
  const color = getColorFromString(initials);
  const assignedUsersDiv = document.getElementById("assignedusers");
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
    variables(selectedContact);

  console.log("Contact ID:", selectedContact.id);
  console.log("Contact:", selectedContact);

  checkbox.addEventListener("change", () => {
    checkbox.checked = !checkbox.checked;
    contactDiv.classList.toggle("dark-blue", checkbox.checked);

    iffunction(
      initials,
      selectedContact.name,
      color,
      contactDiv,
      assignedUsersDiv,
      selectedContact.id
    );
  });

  checkbox.dispatchEvent(new Event("change"));
}

function iffunction(
  initials,
  name,
  color,
  contactDiv,
  assignedUsersDiv,
  firebaseId
) {
  if (!asignedtousers.includes(initials)) {
    asignedtousers.push(initials);

    initialsArray.push({
      id: firebaseId,
      initials: initials,
      name: name,
    });
    const badge = document.createElement("div");
    badge.className = "badgeassigned badge";
    badge.style.backgroundColor = color;
    badge.textContent = initials;
    assignedUsersDiv.appendChild(badge);
  }
}

function elsefunction(initials, firebaseId) {
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== firebaseId);
}

function filternumbers(input) {
  let date = document.getElementById("date").value;
  date = date.replace(/[^0-9:/-]/g, "");
  document.getElementById("date").value = date;
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

window.addEventListener("resize", () => {
  const requiredmessage = document.getElementById("requiredmessage");
  const parent = document.getElementById("parent");
  const spanplace = document.getElementById("spanplace");

  if (window.innerWidth < 400) {
    spanplace.appendChild(requiredmessage);
  } else {
  }
});

window.dispatchEvent(new Event("resize"));
