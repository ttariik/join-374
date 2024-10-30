let completedtasks = 0;
let fullnames = [];
let colors = [];
let todos = [];
let inprogress = [];
let awaitingfeedback = [];
let donetasks = [];
let currentid = [];
const searchInput = document.getElementById("searchInput");

const saveTaskPositions = () => {
  const positions = {
    todos: todos.map(formatTaskData), // Save the full task object
    inprogress: inprogress.map(formatTaskData),
    awaitingfeedback: awaitingfeedback.map(formatTaskData),
    donetasks: donetasks.map(formatTaskData),
  };
  localStorage.setItem("taskPositions", JSON.stringify(positions));
};

function formatTaskData(task) {
  console.log("Formatting task:", task); // Debugging line
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    asignedto: task.asignedto,
    prio: task.prio,
    duedate: task.duedate,
    category: task.category,
    subtask: Array.isArray(task.subtask)
      ? task.subtask.map((subtask) => ({
          subtask: subtask,
          completed: false,
        }))
      : [],
    initials: task.initials,
  };
}

const loadTaskPositions = () => {
  const positions = JSON.parse(localStorage.getItem("taskPositions"));
  if (positions) {
    todos = positions.todos || [];
    inprogress = positions.inprogress || [];
    awaitingfeedback = positions.awaitingfeedback || [];
    donetasks = positions.donetasks || [];
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
  // Determine the drop target folder
  const targetFolder = event.currentTarget.id; // use currentTarget to get the right drop zone
  let color = getContactColor(taskId, colorData);
  console.log(color);

  // Find and remove the task from the current list
  removeFromArray(taskId);

  // Add the task to the new array based on the drop target
  let updatedArray;
  switch (targetFolder) {
    case "inprogress-folder":
      inprogress.push(formatTaskData(taskElement)); // Ensure task is properly formatted
      updatedArray = inprogress;
      break;
    case "awaiting-feedback-folder":
      awaitingfeedback.push(formatTaskData(taskElement));
      updatedArray = awaitingfeedback;
      break;
    case "done-folder":
      donetasks.push(formatTaskData(taskElement));
      updatedArray = donetasks;
      break;
    case "todo-folder":
      todos.push(formatTaskData(taskElement));
      updatedArray = todos;
      break;
    default:
      return; // If the target is not a valid folder
  }

  // Append the task element to the target folder in the DOM
  event.currentTarget.appendChild(taskElement);

  // Save the updated task positions
  saveTaskPositions();
  countTasks(); // Update task count after drop
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

  const tasks = Object.entries(responsestoJson || {})
    .filter(([taskID, task]) => task) // Ensure task exists
    .map(([taskID, task]) => ({ id: taskID, ...task }))
    .filter(
      (task) =>
        task.asignedto &&
        task.category &&
        task.description &&
        task.duedate &&
        task.prio &&
        task.title
    );

  // Clear previous tasks
  document.getElementById("article").innerHTML = "";
  todos.length = 0; // Reset `todos` array

  tasks.forEach((task) => todos.push(task));

  for (const task of tasks) {
    // Ensure template functions are asynchronous
    const taskHTML =
      task.category === "Technical Task"
        ? await Technicaltasktemplate(task)
        : await userstorytemplate(task);

    document
      .getElementById("article")
      .insertAdjacentHTML("beforeend", taskHTML);
  }

  // Restore positions and count tasks after rendering
  restoreTaskPositions();
  countTasks();
}

function restoreTaskPositions() {
  loadTaskPositions(); // Load positions from local storage

  const folders = {
    "todo-folder": todos,
    "inprogress-folder": inprogress,
    "awaiting-feedback-folder": awaitingfeedback,
    "done-folder": donetasks,
  };

  for (const [folderId, tasks] of Object.entries(folders)) {
    const folderElement = document.getElementById(folderId);
    if (!folderElement) {
      console.warn(`Folder element with id ${folderId} not found.`);
      continue; // Skip if the folder element doesn't exist
    }

    tasks.forEach((task) => {
      const taskElement = document.getElementById(task.id);
      if (taskElement) {
        folderElement.appendChild(taskElement);
      } else {
        console.warn(`Task element with id ${task.id} not found.`);
      }
    });
  }
}

// Drag-and-Drop-Ereignisse zuordnen
[
  "todo-folder",
  "inprogress-folder",
  "awaiting-feedback-folder",
  "done-folder",
].forEach((folderId) => {
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
  const totalTasks =
    taskCounts.todos +
    taskCounts.inprogress +
    taskCounts.awaitingfeedback +
    taskCounts.donetasks;
  localStorage.setItem("taskCounts", JSON.stringify(taskCounts));
  localStorage.setItem("totalTasks", totalTasks);
}

async function userstorytemplate(task, index) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];

  // Generate HTML for each initial with a color derived from initials
  const initialsHTMLPromises = initialsArray
    .filter((initial) => initial) // Exclude any falsy initials
    .map(async (initial) => {
      const color = getColorFromInitials(initial);
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    });

  const initialsHTML = (await Promise.all(initialsHTMLPromises)).join("");

  // Count completed subtasks
  const totalSubtasks = Array.isArray(task.subtask) ? task.subtask.length : 0;
  const completedtasks = task.subtask
    ? task.subtask.filter((subtask) => subtask.completed).length
    : 0;

  // Calculate the completion percentage
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

function getColorFromInitials(initial) {
  let hash = 0;
  for (let i = 0; i < initial.length; i++) {
    hash = initial.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  const saturation = 60 + (hash % 20); // Saturation between 60-80%
  const lightness = 50 + (hash % 20); // Lightness between 50-70%

  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  return color;
}

async function Technicaltasktemplate(task, index, completedtasks = 0) {
  // Ensure initials are retrieved correctly from `task.initials` if it's an array
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];

  // Generate initials HTML with assigned colors
  const initialsHTMLPromises = initialsArray
    .filter((initial) => initial) // Exclude any falsy initials
    .map(async (initial) => {
      const color = getColorFromInitials(initial); // Assuming this function returns a color for each initial
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    });

  const initialsHTML = (await Promise.all(initialsHTMLPromises)).join("");

  // Completion percentage (optional to include if relevant to technical tasks)
  const totalSubtasks = Array.isArray(task.subtasks) ? task.subtasks.length : 0;
  const completionPercent =
    totalSubtasks > 0 ? (completedtasks / totalSubtasks) * 100 : 0;

  // Return the HTML structure
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
        <div class="initialsboxdesign">${initialsHTML}</div>
        <img src="/img/${task.prio}.png" alt="Priority" />
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
  setTimeout(() => {
    document.getElementById("templateoverlay").style.transform =
      "translateX(0%)";
  }, 0.5);
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
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("drop", drop);
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
