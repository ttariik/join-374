let completedtasks = 0;
let fullnames = [];
let colors = [];
let taskss = [];
const searchInput = document.getElementById("searchInput");

// Event listener for search input
searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".task");

  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(filter) ? "" : "none";
  });
});

// Allow drop event for drag and drop
function allowDrop(event) {
  event.preventDefault();
}

// Drag event handler
function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

// Drop event handler
function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const task = document.getElementById(data);
  event.target.appendChild(task);
}

// Count tasks and store in local storage
function countTasks() {
  const folders = [
    "todo-folder",
    "inprogress-folder",
    "review-folder",
    "done-folder",
  ];
  folders.forEach((folderId) => {
    const folder = document.getElementById(folderId);
    const taskCount = folder
      ? folder.getElementsByClassName("article").length
      : 0;
    localStorage.setItem(`${folderId}Count`, taskCount);
  });
}

// Count tasks on DOM content loaded
document.addEventListener("DOMContentLoaded", countTasks);

// Load tasks from API
async function loadtasks(id = 1) {
  completedtasks = 0; // Reset completed tasks count
  await getusernames(id); // Ensure fullnames are populated

  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();

  // Filter valid tasks
  responsestoJson = responsestoJson.filter(
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

  // Prepare colors based on fullnames
  colors = fullnames.map((name) => getColorFromString(name));

  // Render tasks
  responsestoJson.forEach((task, index) => {
    const completedSubtasks = task.subtask.filter(
      (sub) => sub.completed
    ).length; // Calculate completed subtasks
    if (task.category === "User Story") {
      document.getElementById("article").innerHTML += userstorytemplate(
        task,
        index,
        completedSubtasks
      );
    } else if (task.category === "Technical Task") {
      document.getElementById("article").innerHTML += Technicaltasktemplate(
        task,
        index
      );
    }
  });
}

// Get color from a string
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

// User story template
function userstorytemplate(task, index, completedSubtasks) {
  const initials = task.initials; // Use task's initials directly
  let initialsHTML = "";

  // Generate initials badges
  for (let a = 0; a < initials.length; a++) {
    initialsHTML += `<div class="badgestyle" style="background-color:${colors[a]}">${initials[a]}</div>`;
  }

  return /*html*/ `
    <div onclick="showtemplate(${index})" class="user-container task" draggable="true" ondragstart="drag(event)" id="task${index}">
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
            (completedSubtasks / task.subtask.length) * 100
          }%"></div>
        </div>
        <div class="subtask-info"><span>${completedSubtasks}/${
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

// Technical task template
function Technicaltasktemplate(task, index) {
  const initials = task.initials; // Use task's initials directly
  let initialsHTML = "";

  // Generate initials badges
  for (let s = 0; s < initials.length; s++) {
    initialsHTML += `<div class="badgestyle" style="background-color:${colors[index]}">${initials[s]}</div>`;
  }

  return /*html*/ `
    <div class="task-container task" draggable="true" ondragstart="drag(event)" id="task${index}" onclick="opentechnicaltemplate(${index})">
      <div class="task-category">
        <span class="task-category-name">${task.category}</span>
      </div>
      <div class="task-details">
        <div class="task-title">
          <span class="task-title-name">${task.title}</span>
        </div>
        <div class="task-description">${task.description}</div>
      </div>
      <div class="task-statuss">
        <div id="initialsbox" class="initialsboxdesign">${initialsHTML}</div>
        <img src="/img/${task.prio}.png" alt="">
      </div>
    </div>
  `;
}

// Get user names and populate fullnames
async function getusernames(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();
  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );

  fullnames = responsestoJson.map((contact) => contact.name); // Reset fullnames and map names to the array
}

// Show template overlay
function showtemplate(index) {
  document.getElementById("templateoverlay").classList.add("overlays");
  fetch("profile-template.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById("templateoverlay").innerHTML = html;
      // Further processing if needed
    })
    .catch((error) => {
      console.error("Error loading HTML:", error);
    });
}

// Open task template
function opentasktemplate() {
  document.querySelector(".overlays").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlays").style.transform = "translateX(0%)";
  }, 10);
}

// Close task template
function closeaddtasktemplate() {
  document.querySelector(".overlays").style.transform = "translateX(126%)";
  setTimeout(() => {
    document.querySelector(".overlays").style.display = "none";
  }, 50);
}

// Call loadtasks to initiate loading
loadtasks(); // Call the function to load tasks on initial page load
