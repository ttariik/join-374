let completedtasks = 0;
let fullnames = [];
let colors = [];
let initialsss = [];
let taskss = [];
const searchInput = document.getElementById("searchInput");
const tasks = document.querySelectorAll(".task");

// Search filter
searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(filter) ? "" : "none";
  });
});

// Drag and Drop Handlers
function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const task = document.getElementById(data);
  event.target.appendChild(task);
}

// Task Counters
function countAndStoreTasks() {
  const folders = [
    "todo-folder",
    "inprogress-folder",
    "review-folder",
    "done-folder",
  ];
  let totalTaskCount = 0;

  folders.forEach((folderId) => {
    const folder = document.getElementById(folderId);
    const taskCount = folder
      ? folder.getElementsByClassName("article").length
      : 0;
    localStorage.setItem(`${folderId}Count`, taskCount);
    totalTaskCount += taskCount;
  });

  localStorage.setItem("totalTaskCount", totalTaskCount);
}

document.addEventListener("DOMContentLoaded", countAndStoreTasks);

// Color Generator
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

// Load Tasks Function
async function loadtasks(id = 1) {
  const responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  const responsestoJson = await responses.json();

  const tasks = Object.entries(responsestoJson || {})
    .map(([taskID, task]) => ({ id: taskID, ...task }))
    .filter(
      (task) =>
        task &&
        task.asignedto &&
        task.category &&
        task.description &&
        task.duedate &&
        task.prio &&
        task.subtask &&
        task.title
    );

  document.getElementById("article").innerHTML = "";

  tasks.forEach((task, index) => {
    let completedtasks = task.subtask.filter(
      (subtask) => subtask.completed
    ).length;

    // Generate the HTML using userstorytemplate and add it to article
    document
      .getElementById("article")
      .insertAdjacentHTML(
        "beforeend",
        userstorytemplate(task, index, completedtasks)
      );

    // Attach the click event listener after inserting HTML
    document.getElementById(`task${index}`).addEventListener("click", () => {
      openprofiletemplate(index, task);
    });
  });
}

// User Story Template
function userstorytemplate(task, index, completedtasks) {
  const initialsHTML = task.initials
    .map(
      (initial, a) =>
        `<div class="badgestyle" style="background-color:${colors[a]}">${initial}</div>`
    )
    .join("");

  return /*html*/ `
    <div  class="user-container task" draggable="true" ondragstart="drag(event)" id="task${index}">
      <div class="task-detailss">
        <span>${task.category}</span>
      </div>
      <div class="titlecontainer">
        <div class="section-one">${task.title}</div>
        <div class="section-two">${task.description}</div>
      </div>
      <div class="outsidebox">
        <div class="progressbar">
          <div class="progressbar-inside" style="width:${
            (completedtasks / task.subtask.length) * 100
          }%"></div>
        </div>
        <div class="subtask-info"><span>${completedtasks}/${
    task.subtask.length
  } Subtasks</span></div>
      </div>
      <div class="asignbox badge">
        <div id="initialsarea" class="initialsbox">${initialsHTML}</div>
        <img src="/img/${task.prio}.png" alt="">
      </div>
    </div>
  `;
}

// Technical Task Template
function Technicaltasktemplate(task, index) {
  const initialsHTML = task.initials
    .map(
      (initial, a) =>
        `<div class="badgestyle" style="background-color:${colors[a]}">${initial}</div>`
    )
    .join("");

  return /*html*/ `
    <div class="task-container task" draggable="true" ondragstart="drag(event)" id="task${index}" onclick="opentechnicaltemplate(${index})">
      <div class="task-category">
        <span class="task-category-name">${task.category}</span>
      </div>
      <div class="task-details">
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
      </div>
      <div class="task-statuss">
        <div id="initialsbox" class="initialsboxdesign">${initialsHTML}</div>
        <img src="/img/${task.prio}.png" alt="" />
      </div>
    </div>
  `;
}

async function openprofiletemplate(index, task) {
  const response = await fetch("./profile-template.html");
  if (!response.ok) throw new Error("Network response was not ok");
  const htmlContent = await response.text();
  document.getElementById("templateoverlay").innerHTML = htmlContent;
  document.getElementById("templateoverlay").classList.add("overlayss");
  inputacess(task);
  console.log(task.title);
}

function inputacess(task) {
  document.getElementById("profiletitle").innerHTML = `${task.title}`;
  document.getElementById(
    "profiledescription"
  ).innerHTML = `${task.description}`;
  document.getElementById("profileduedate").innerHTML = `${task.duedate}`;
  document.getElementById("profilepriority").innerHTML = `${task.prio}`;
  document.getElementById("profileicon").src = `../img/${task.prio}.png`;
}

async function opentechnicaltemplate() {
  const response = await fetch("./techinical-task-template.html");
  if (!response.ok) throw new Error("Network response was not ok");
  const htmlContent = await response.text();
  document.getElementById("templateoverlay").innerHTML = htmlContent;
  document.getElementById("templateoverlay").classList.add("overlays");
  inputacess(task);
}

async function getusernames(id = 1) {
  const response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  const contacts = await response.json();

  fullnames = contacts
    .filter((contact) => contact && contact.name)
    .map((contact) => contact.name);
  colors = fullnames.map(getColorFromString);
}

function opentasktemplate() {
  const overlay = document.querySelector(".overlayss");
  overlay.style.display = "flex";
  setTimeout(() => (overlay.style.transform = "translateX(0%)"), 10);
}

function closeaddtasktemplate() {
  const overlay = document.querySelector(".overlayss");
  overlay.style.transform = "translateX(126%)";
  setTimeout(() => (overlay.style.display = "none"), 50);
}
