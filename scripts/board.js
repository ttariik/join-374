let completedtasks = 0;
let fullnames = [];
let colors = [];
let todos = [];
let inprogress = [];
let awaitingfeedback = [];
let donetasks = [];
const searchInput = document.getElementById("searchInput");
const tasks = document.querySelectorAll(".task");

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(filter) ? "" : "none";
  });
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  // Get the task ID and set it for the drag event
  const taskId = event.target.id;
  event.dataTransfer.setData("text", taskId);

  // Remove task from the correct array based on its ID
  removeFromArray(taskId);
  console.log("After dragging:", {
    todos,
    inprogress,
    awaitingfeedback,
    donetasks,
  });
}

function drop(event) {
  event.preventDefault();

  // Retrieve the task ID and task element
  const taskId = event.dataTransfer.getData("text");
  const taskElement = document.getElementById(taskId);

  // Identify the drop target and append the task to the appropriate container and array
  if (event.target.id === "inprogress-folder") {
    inprogress.push({ id: taskId, title: taskElement.innerText });
  } else if (event.target.id === "review-folder") {
    awaitingfeedback.push({ id: taskId, title: taskElement.innerText });
  } else if (event.target.id === "done-folder") {
    donetasks.push({ id: taskId, title: taskElement.innerText });
  } else if (event.target.id === "todo-folder") {
    todos.push({ id: taskId, title: taskElement.innerText });
  }

  // Append the task element to the new container in the DOM
  event.target.appendChild(taskElement);

  console.log("After dropping:", {
    todos,
    inprogress,
    awaitingfeedback,
    donetasks,
  });
}

function removeFromArray(taskId) {
  // Function to find and remove task from an array
  const removeTask = (array) => {
    const index = array.findIndex((task) => task.id === taskId);
    if (index > -1) array.splice(index, 1);
  };

  // Remove from all arrays
  removeTask(todos);
  removeTask(inprogress);
  removeTask(awaitingfeedback);
  removeTask(donetasks);
}

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

async function loadtasks(id = 1) {
  const responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  const responsestoJson = await responses.json();

  const tasks = Object.entries(responsestoJson || {})
    .filter(([taskID, task]) => task) // Remove null/undefined tasks
    .map(([taskID, task]) => ({ id: taskID, ...task }))
    .filter(
      (task) =>
        task &&
        task.asignedto &&
        task.category &&
        task.description &&
        task.duedate &&
        task.prio &&
        task.title
    );

  document.getElementById("article").innerHTML = ""; // Clear article
  tasks.forEach((task) => todos.push(task));
  for (const [index, task] of tasks.entries()) {
    // Ensure task.subtask is an array and filter out any null or undefined subtasks
    const validSubtasks = Array.isArray(task.subtask) ? task.subtask : [];
    const completedtasks = validSubtasks.filter(
      (subtask) => subtask && subtask.completed
    ).length;

    let taskHTML;
    if (task.category === "Technical") {
      taskHTML = await Technicaltasktemplate(task, index); // Await technical task template
    } else {
      taskHTML = await userstorytemplate(task, index, completedtasks); // Await user story template
    }

    // Insert the HTML into the DOM
    document
      .getElementById("article")
      .insertAdjacentHTML("beforeend", taskHTML);

    // Ensure `task.id` exists to attach the event listener
    if (task.id) {
      document.getElementById(task.id).addEventListener("click", () => {
        if (task.category === "Technical Task") {
          opentechnicaltemplate(index, task); // Open the technical template for the clicked task
        } else {
          openprofiletemplate(index, task); // Open the profile template for the clicked task
        }
      });
    } else {
      console.warn(`Task with index ${index} has no valid id.`);
    }
  }
}

async function userstorytemplate(task, index, completedtasks) {
  // Ensure initials is an array
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];

  // Fetch all colors from Firebase or use a locally cached version
  // Assume `getContactColor(initial)` retrieves the color from Firebase
  const initialsHTMLPromises = initialsArray
    .filter((initial) => initial) // Remove any falsy values (including null)
    .map(async (initial) => {
      // Fetch color from Firebase for each initial
      const color = await getContactColor(initial);
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    });

  // Resolve all color-fetching promises
  const initialsHTML = (await Promise.all(initialsHTMLPromises)).join("");

  // Ensure subtask is an array
  const totalSubtasks = Array.isArray(task.subtasks) ? task.subtasks.length : 0;

  // Calculate percentage completion for progress bar
  const completionPercent =
    totalSubtasks > 0 ? (completedtasks / totalSubtasks) * 100 : 0;

  // Return the template HTML
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

// Helper function to get contact color from Firebase
async function getContactColor(initial) {
  try {
    // Assume the color data for each contact is stored by `initial`
    const response = await fetch(`${GLOBAL}contacts/${initial}/color.json`);
    const colorData = await response.json();
    return colorData || "rgb(200, 200, 200)"; // Default color if none found
  } catch (error) {
    console.error("Error fetching color for initial:", initial, error);
    return "rgb(200, 200, 200)"; // Fallback color on error
  }
}

// Technical Task Template
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
document.getElementById("review-folder").addEventListener("drop", drop);
document.getElementById("done-folder").addEventListener("drop", drop);

// Allow drop on specific folders
document.getElementById("todo-folder").addEventListener("dragover", allowDrop);
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("review-folder")
  .addEventListener("dragover", allowDrop);
document.getElementById("done-folder").addEventListener("dragover", allowDrop);
