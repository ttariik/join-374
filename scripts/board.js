let completedtasks = 0;
let fullnames = [];
let colors = [];
let initialsss = [];
let taskss = [];
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
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const task = document.getElementById(data);
  event.target.appendChild(task);
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

// Load Tasks Function
async function loadtasks(id = 1) {
  const responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  const responsestoJson = await responses.json();

  // Filter and map tasks, avoiding null/undefined entries
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

  for (const [index, task] of tasks.entries()) {
    // Ensure task.subtask is an array and filter out any null or undefined subtasks
    const validSubtasks = Array.isArray(task.subtask) ? task.subtask : [];
    const completedtasks = validSubtasks.filter(
      (subtask) => subtask && subtask.completed
    ).length;

    // Log task id to verify
    console.log(task.id);

    // Await the HTML string from the appropriate template
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

  // Generate the HTML for initials with corresponding colors
  const initialsHTML = initialsArray
    .filter((initial) => initial) // Remove any falsy values (including null)
    .map((initial) => {
      const color = getColorFromString(initial); // Generate color directly from the initial
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");

  // Ensure subtask is an array
  const totalSubtasks = Array.isArray(task.subtasks) ? task.subtasks.length : 0;

  // Return the template HTML
  return `
      <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${
        task.id
      }">
          <div class="task-detailss">
              <span>${task.category}</span>
          </div>
          <div class="titlecontainer">
              <div class="section-one">${task.title}</div>
              <div class="section-two">${task.description}</div>
          </div>
          <div class="outsidebox">
              <div class="progressbar">
                  <div class="progressbar-inside" style="width=${
                    totalSubtasks > 0
                      ? (completedtasks / totalSubtasks) * 100
                      : 0
                  }%"></div>
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

// Technical Task Template
function Technicaltasktemplate(task, index) {
  const initialsHTML = task.initials.map((initial, a) => ``).join("");
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
