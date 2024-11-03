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
    ? "/img/urgent white.png"
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
    ? "/img/medium white.png"
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
    ? "/img/low white.png"
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
      <button class="d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
    </div>
  `;
}

function smallerfunction() {
  document.getElementById("contacts-box").style.display = "flex";
  document.getElementById("selectboxbutton").onclick = "";
}

async function showcontacts(id = 1) {
  smallerfunction(); // Assuming this initializes something needed for your function
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await response.json();

  // Filter out any invalid contacts
  responsestoJson = responsestoJson
    .filter((contact) => contact && contact.name) // Filter valid contacts
    .map((contact) => ({
      // Map to include id, initials, and name
      id: contact.id, // Assuming `contact.id` is the unique identifier
      initials: contact.initials,
      name: contact.name,
    }));

  document.getElementById("selectboxbutton").innerHTML = searchbar();

  for (let index = 0; index < responsestoJson.length; index++) {
    const contact = responsestoJson[index]; // Get the current contact
    users.push(contact.name);

    // Get the color associated with the user's name
    const color = getColorFromString(contact.name);
    usernamecolor.push(color);

    // Append contact template to the contacts box
    document.getElementById("contacts-box").innerHTML += contactstemplate(
      responsestoJson,
      index,
      color
    );

    // Add initials and name to initialsArray and initials only to asignedto
    if (contact.initials && contact.name) {
      initialsArray.push({
        initials: contact.initials,
        name: contact.name,
      });
      asignedtousers.push(contact.initials); // Only push initials to asignedto
    }
  }

  // Set click event for the search reset button
  document.getElementById("selectboxbutton").onclick = resetsearchbar;

  // Now you can use initialsArray and asignedto as needed
  console.log(initialsArray); // For debugging purposes
  console.log(asignedto); // For debugging purposes
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

function contactstemplate(responsestoJson, index, color) {
  return /*html*/ `
    <li class="contact-menudesign"  id="div${responsestoJson.id}" onclick="selectcontact(${index})"> 
     <div class="splitdivs"><div class="contactbox-badge badge" style="background-color:${color}"> ${responsestoJson[index].initials} </div>
     <div> ${responsestoJson[index].name}</div></div>
     <label class="custom-checkbox">
    <input type="checkbox" id="checkbox${index}" class="checkboxdesign" />
    <span class="checkmark"></span>
  </label></li>
  `;
}

function variables(index, responsestoJson) {
  const contactDiv = document.getElementById(`div${index}`);
  const checkbox = document.getElementById(`checkbox${index}`);
  const initials = responsestoJson[index].initials;
  const color = getColorFromString(responsestoJson[index].name);
  const assignedUsersDiv = document.getElementById("assignedusers");
  checkbox.checked = !checkbox.checked;
  contactDiv.classList.toggle("dark-blue", checkbox.checked);
  return { contactDiv, checkbox, initials, color, assignedUsersDiv };
}

async function selectcontact(index, id = 1) {
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await response.json();
  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );
  const { contactDiv, checkbox, initials, color, assignedUsersDiv } = variables(
    index,
    responsestoJson
  );

  if (checkbox.checked) {
    iffunction(initials, color, contactDiv, assignedUsersDiv);
  } else {
    elsefunction(initials);
  }
}

function iffunction(initials, color, contactDiv, assignedUsersDiv) {
  if (!asignedtousers.includes(initials)) {
    asignedtousers.push(initials);
    console.log(asignedtousers);
    const badge = document.createElement("div");
    badge.className = "badgeassigned badge";
    badge.style.backgroundColor = color;
    badge.textContent = initials;
    assignedUsersDiv.appendChild(badge);
  }
}

function elsefunction(initials) {
  const userIndex = asignedtousers.indexOf(initials);
  if (userIndex !== -1) {
    asignedtousers.splice(userIndex, 1);

    const badges = document.querySelectorAll("#assignedusers .badgeassigned");
    badges.forEach((badge) => {
      if (badge.textContent === initials) {
        badge.remove();
      }
    });
  }
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
