let completedtasks = 0;
let fullnames = [];
let colors = [];
let todos = [];
let inprogress = [];
let awaitingfeedback = [];
let donetasks = [];
const searchInput = document.getElementById("searchInput");


const saveTaskPositions = () => {
  const positions = {
    todos: todos.map(task => task.id),
    inprogress: inprogress.map(task => task.id),
    awaitingfeedback: awaitingfeedback.map(task => task.id),
    donetasks: donetasks.map(task => task.id),
  };
  localStorage.setItem('taskPositions', JSON.stringify(positions));
};


const loadTaskPositions = () => {
  const positions = JSON.parse(localStorage.getItem('taskPositions'));
  if (positions) {
    todos = positions.todos.map(id => ({ id, title: id })); // Dummy title, anpassen wie nötig
    inprogress = positions.inprogress.map(id => ({ id, title: id }));
    awaitingfeedback = positions.awaitingfeedback.map(id => ({ id, title: id }));
    donetasks = positions.donetasks.map(id => ({ id, title: id }));
  }
};


searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(filter) ? "" : "none";
  });
});


function allowDrop(event) {
  event.preventDefault();
}


function drag(event) {
  const taskId = event.target.id;
  event.dataTransfer.setData("text", taskId);
  removeFromArray(taskId); 
}


function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text");
  const taskElement = document.getElementById(taskId);

  // Überprüfen, ob die Aufgabe bereits im Zielordner ist
  let updatedArray;
  switch (event.target.id) {
      case "inprogress-folder":
          if (!inprogress.some(task => task.id === taskId)) { // Nur hinzufügen, wenn nicht vorhanden
              inprogress.push({ id: taskId, title: taskElement.innerText });
          }
          updatedArray = inprogress;
          break;
      case "awaiting-feedback-folder":
          if (!awaitingfeedback.some(task => task.id === taskId)) {
              awaitingfeedback.push({ id: taskId, title: taskElement.innerText });
          }
          updatedArray = awaitingfeedback;
          break;
      case "done-folder":
          if (!donetasks.some(task => task.id === taskId)) {
              donetasks.push({ id: taskId, title: taskElement.innerText });
          }
          updatedArray = donetasks;
          break;
      case "todo-folder":
          if (!todos.some(task => task.id === taskId)) {
              todos.push({ id: taskId, title: taskElement.innerText });
          }
          updatedArray = todos;
          break;
      default:
          return; // Falls das Ziel kein gültiger Ordner ist
  }

  // Aufgabe dem Zielordner hinzufügen und speichern
  event.target.appendChild(taskElement);
  saveTaskPositions();
  countTasks(); // Zähle die Aufgaben nach dem Drag-and-Drop
}


function removeFromArray(taskId) {
  const removeTask = (array) => {
      const index = array.findIndex((task) => task.id === taskId);
      if (index > -1) array.splice(index, 1);
  };

  removeTask(todos);
  removeTask(inprogress);
  removeTask(awaitingfeedback);
  removeTask(donetasks);
}

async function loadtasks(id = 1) {
  const responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  const responsestoJson = await responses.json();
  
  // Tasks laden und sortieren
  const tasks = Object.entries(responsestoJson || {})
    .filter(([taskID, task]) => task)
    .map(([taskID, task]) => ({ id: taskID, ...task }))
    .filter((task) => task.asignedto && task.category && task.description && task.duedate && task.prio && task.title);

  document.getElementById("article").innerHTML = ""; // Artikel zurücksetzen
  tasks.forEach((task) => todos.push(task));

  for (const task of tasks) {
    // HTML für die Aufgaben erstellen
    let taskHTML = task.category === "Technical" ? await Technicaltasktemplate(task) : await userstorytemplate(task);
    document.getElementById("article").insertAdjacentHTML("beforeend", taskHTML);
  }
  
  // Nach dem Laden die Positionen wiederherstellen
  restoreTaskPositions();
  countTasks(); 
}

function restoreTaskPositions() {
  loadTaskPositions(); // Positionen laden

  const folders = {
    "todo-folder": todos,
    "inprogress-folder": inprogress,
    "awaiting-feedback-folder": awaitingfeedback,
    "done-folder": donetasks,
  };

  for (const [folderId, tasks] of Object.entries(folders)) {
    const folderElement = document.getElementById(folderId);
    tasks.forEach(task => {
      const taskElement = document.getElementById(task.id);
      if (taskElement) {
        folderElement.appendChild(taskElement);
      }
    });
  }
}

// Drag-and-Drop-Ereignisse zuordnen
["todo-folder", "inprogress-folder", "awaiting-feedback-folder", "done-folder"].forEach(folderId => {
  const folderElement = document.getElementById(folderId);
  if (folderElement) {
    folderElement.addEventListener("drop", drop);
    folderElement.addEventListener("dragover", allowDrop);
  } else {
    console.error(`Element mit ID ${folderId} wurde nicht gefunden.`);
  }
});

function countTasks() {
  const taskCounts = {
    todos: todos.length,
    inprogress: inprogress.length,
    awaitingfeedback: awaitingfeedback.length,
    donetasks: donetasks.length,
  };
  const totalTasks = taskCounts.todos + taskCounts.inprogress + taskCounts.awaitingfeedback + taskCounts.donetasks;
  localStorage.setItem('taskCounts', JSON.stringify(taskCounts));
  localStorage.setItem('totalTasks', totalTasks); 
}


async function userstorytemplate(task, index, completedtasks) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const initialsHTMLPromises = initialsArray
    .filter((initial) => initial) // Remove any falsy values (including null)
    .map(async (initial) => {
      // Fetch color from Firebase for each initial
      const color = await getContactColor(initial);
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    });

  const initialsHTML = (await Promise.all(initialsHTMLPromises)).join("");
  const totalSubtasks = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
  const completionPercent =
    totalSubtasks > 0 ? (completedtasks / totalSubtasks) * 100 : 0;

  return `
      <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${task.id}">
          <div class="task-detailss">
              <span>${task.category}</span>
          </div>
          <div class="titlecontainer">
              <div class="section-one">${task.title}</div>
              <div class="section-two">${task.description}</div>
          </div>
          <div class="outsidebox">
              <div class="progressbar">
                  <div class="progressbar-inside" style="width:${completionPercent}%"></div>
              </div>
              <div class="subtask-info"><span>${completedtasks}/${totalSubtasks} Subtasks</span></div>
          </div>
          <div class="asignbox">
              <div id="initialsarea" class="initialsbox">${initialsHTML}</div>
              <img src="/img/${task.prio}.png" alt="">
          </div>
      </div>
  `;
}


async function getContactColor(initials) {
  try {
    const response = await fetch(`${GLOBAL}contacts/${initials}/color.json`);
    const colorData = await response.json();
    return colorData || "rgb(200, 200, 200)"; // Default color if none found
  } catch (error) {
    console.error("Error fetching color for initial:", initial, error);
    return "rgb(200, 200, 200)"; // Fallback color on error
  }
}


function Technicaltasktemplate(task, index) {
  document.getElementById(
    "initialsbox"
  ).innerHTML = `<div class="badgestyle" style="background-color:${task.color}">${initial}</div>`;
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
  opentasktemplate();
  inputacessprofile(task);
}

function inputacessprofile(task) {
  document.getElementById("profiletitle").innerHTML = `${task.title}`;
  document.getElementById(
    "profiledescription"
  ).innerHTML = `${task.description}`;
  document.getElementById("profileduedate").innerHTML = `${task.duedate}`;
  document.getElementById("profilepriority").innerHTML = `${task.prio}`;
  document.getElementById("profileicon").src = `../img/${task.prio}.png`;
}

function inputacesstechnicall(task) {
  document.getElementById("title").innerHTML = `${task.title}`;
  document.getElementById("descriptioninput").innerHTML = `${task.description}`;
  document.getElementById(
    "due-date-containerinput"
  ).innerHTML = `${task.duedate}`;
  document.getElementById("showprio").innerHTML = `${task.prio}`;
  document.getElementById("assigned-containercontent").innerHTML = "";
  document.getElementById("assigned-containercontent").innerHTML +=
    assignedtotemplate(task);
}

function assignedtotemplate(task) {
  return /*html*/ `<div class="align" id="showassignedperson">
  <div>${task.initials}</div><span>${task.asignedto}</span>
</div>`;
}

async function opentechnicaltemplate(index, task) {
  opentasktemplate();
  const response = await fetch("./techinical-task-template.html");
  if (!response.ok) throw new Error("Network response was not ok");
  const htmlContent = await response.text();
  document.getElementById("templateoverlay").innerHTML = htmlContent;
  inputacesstechnicall(task);
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
  document.getElementById("templateoverlay").classList.add("overlayss");
  setTimeout(() => {
    document.querySelector(".overlayss").style = "transform: translateX(0%);";
  }, 0.5);
}

function closeaddtasktemplate() {
  document.getElementById("templateoverlay").style =
    "transform: translateX(126%)";
  setTimeout(() => {
    document.getElementById("templateoverlay").innerHTML = "";
  }, 0.5);
}

async function calladdtasktemplate() {
  const response = await fetch("./overlay.html");
  if (!response.ok) throw new Error("Network response was not ok");
  const htmlContent = await response.text();
  document.getElementById("templateoverlay").innerHTML = htmlContent;
  document.getElementById("templateoverlay").classList.add("overlayss");
}

document
  .getElementById("add-tasktemplate")
  .addEventListener("click", function () {
    calladdtasktemplate();
  });

// Define a function that applies the hover effect and click event
function applyHoverEffect(buttonId, imageId, hoverSrc) {
  const buttonElement = document.getElementById(buttonId);
  const imageElement = document.getElementById(imageId);

  // Mouseover to change the image source
  buttonElement.addEventListener("mouseover", function () {
    imageElement.src = hoverSrc;
  });

  // Mouseout to reset the image
  buttonElement.addEventListener("mouseout", function () {
    imageElement.src = "/img/status-item.png"; // original source
  });

  // Click to call the template function
  buttonElement.addEventListener("click", function () {
    calladdtasktemplate();
  });
}

// Apply the function to each button/image combination
applyHoverEffect("buttonicon1", "pic1", "/img/pic1hovered.png");
applyHoverEffect("buttonicon2", "pic2", "/img/pic1hovered.png");
applyHoverEffect("buttonicon3", "pic3", "/img/pic1hovered.png");

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

// Add event listeners for drop areas to enable dragging and dropping
document.getElementById("todo-folder").addEventListener("drop", drop);
document.getElementById("inprogress-folder").addEventListener("drop", drop);
document.getElementById("awaiting-feedback-folder").addEventListener("drop", drop);
document.getElementById("done-folder").addEventListener("drop", drop);

// Allow drop on specific folders
document.getElementById("todo-folder").addEventListener("dragover", allowDrop);
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("dragover", allowDrop);
document.getElementById("done-folder").addEventListener("dragover", allowDrop);
