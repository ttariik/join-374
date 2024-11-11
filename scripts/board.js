let completedtasks = 0;
let fullnames = [];
let colors = [];
let todos = [];
let inprogress = [];
let awaitingfeedback = [];
let donetasks = [];
let currentid = [];
const taskFolders = {
  "todo-folder": todos,
  "inprogress-folder": inprogress,
  "awaiting-feedback-folder": awaitingfeedback,
  "done-folder": donetasks,
};
const searchInput = document.getElementById("searchInput");

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
  const parentFolderId = event.target.parentElement.id;

  event.dataTransfer.setData("taskId", taskId);
  event.dataTransfer.setData("parentFolderId", parentFolderId);
}

async function drop(event) {
  event.preventDefault();

  const taskId = event.dataTransfer.getData("taskId");
  const parentFolderId = event.dataTransfer.getData("parentFolderId");
  const targetFolder = event.currentTarget.id;
  const taskElement = document.getElementById(taskId);

  if (!taskElement) {
    console.error("Task element not found in the DOM.");
    return;
  }

  try {
    const response = await fetch(
      GLOBAL + `users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();

    if (!taskData) {
      console.error("Task not found in the source folder.");
      return;
    }

    await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);

    await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);

    const targetContainer = document.getElementById(targetFolder);
    if (targetContainer) {
      targetContainer.appendChild(taskElement);
    } else {
      console.error("Target container not found in the DOM.");
    }
  } catch (error) {
    console.error("Error during drop operation:", error);
  }
}

async function loadtasks() {
  const todos = [];
  const inprogress = [];
  const awaitingfeedback = [];
  const donetasks = [];

  try {
    const response = await fetch(GLOBAL + `users/1/tasks.json`);
    const userData = await response.json();

    console.log("Fetched userData:", userData);

    const pushTasksFromFolder = (folderData, taskArray) => {
      if (folderData && typeof folderData === "object") {
        Object.entries(folderData).forEach(([key, task]) => {
          if (task !== null) {
            task.id = key;
            taskArray.push(task);
          }
        });
      }
    };

    if (userData["todo-folder"]) {
      pushTasksFromFolder(userData["todo-folder"], todos);
      console.log("Loaded tasks for todo-folder:", todos);
    }

    if (userData["inprogress-folder"]) {
      pushTasksFromFolder(userData["inprogress-folder"], inprogress);
      console.log("Loaded tasks for inprogress-folder:", inprogress);
    }

    if (userData["awaiting-feedback-folder"]) {
      pushTasksFromFolder(
        userData["awaiting-feedback-folder"],
        awaitingfeedback
      );
      console.log(
        "Loaded tasks for awaiting-feedback-folder:",
        awaitingfeedback
      );
    }

    if (userData["done-folder"]) {
      pushTasksFromFolder(userData["done-folder"], donetasks);
      console.log("Loaded tasks for done-folder:", donetasks);
    }

    document.getElementById("todo-folder").innerHTML = "";
    document.getElementById("inprogress-folder").innerHTML = "";
    document.getElementById("awaiting-feedback-folder").innerHTML = "";
    document.getElementById("done-folder").innerHTML = "";

    const renderTasksWithTemplate = async (tasks, containerId) => {
      const container = document.getElementById(containerId);
      tasks.forEach(async (task) => {
        if (task && task.category) {
          const taskId = task.id;
          let taskHTML;

          if (task.category === "Technical Task") {
            taskHTML = await Technicaltasktemplate({ ...task, id: taskId });
          } else {
            taskHTML = await userstorytemplate({ ...task, id: taskId });
          }

          container.insertAdjacentHTML("beforeend", taskHTML);

          const taskElement = document.getElementById(taskId);
          if (taskElement) {
            taskElement.setAttribute("draggable", "true");
            taskElement.addEventListener("dragstart", (event) => {
              event.dataTransfer.setData("taskId", taskId);
              event.dataTransfer.setData("parentFolderId", containerId);
            });
          }
          document
            .getElementById(taskId)
            .addEventListener("click", function () {
              if (task.category === "Technical Task") {
                opentechnicaltemplate(task);
              } else {
                openprofiletemplate(task);
              }
            });
        }
      });
    };

    await renderTasksWithTemplate(todos, "todo-folder");
    await renderTasksWithTemplate(inprogress, "inprogress-folder");
    await renderTasksWithTemplate(awaitingfeedback, "awaiting-feedback-folder");
    await renderTasksWithTemplate(donetasks, "done-folder");
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

async function userstorytemplate(task) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const initialsHTML = initialsArray
    .map((initialObj) => {
      const initial = initialObj.initials;
      const color = getColorFromInitials(initial);
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");

  const totalSubtasks = Array.isArray(task.subtask) ? task.subtask.length : 0;
  const completedTasks = task.subtask
    ? task.subtask.filter((subtask) => subtask.completed).length
    : 0;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;

  const progressBarHTML =
    totalSubtasks > 0
      ? `
      <div class="outsidebox" id="progress${task.id}">
        <div class="progressbar">
          <div class="progressbar-inside" style="width:${completionPercent}%"></div>
        </div>
        <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
      </div>`
      : "";

  const htmlTemplate = /*html*/ `
      <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${task.id}">
        <div class="task-detailss">
          <span>${task.category}</span>
        </div>
        <div class="titlecontainer">
          <div class="section-one">${task.title}</div>
          <div class="section-two">${task.description}</div>
        </div>
        ${progressBarHTML}
        <div class="asignbox">
          <div class="initialsbox" id="initialbox">${initialsHTML}</div>
          <img src="/img/${task.prio}.png" alt="">
        </div>
      </div>
    `;

  return htmlTemplate;
}

function getColorFromInitials(initial) {
  let hash = 0;
  for (let i = 0; i < initial.length; i++) {
    hash = initial.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = hash % 360;
  const saturation = 60 + (hash % 20);
  const lightness = 50 + (hash % 20);

  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  return color;
}

async function Technicaltasktemplate(task) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const initialsHTML = initialsArray
    .map((initialObj) => {
      const initial = initialObj.initials;
      const color = getColorFromInitials(initial);
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");

  const totalSubtasks = Array.isArray(task.subtask) ? task.subtask.length : 0;
  const completedtaskss = task.subtask
    ? task.subtask.filter((subtask) => subtask.completed).length
    : 0;
  const completionPercent =
    totalSubtasks > 0 ? (completedtaskss / totalSubtasks) * 100 : 0;

  return /*html*/ `
    <div class="task-container task" draggable="true" ondragstart="drag(event)" id="${task.id}" >
      <div class="task-category">
        <span class="task-category-name">${task.category}</span>
      </div>
      <div class="task-details">
        <div class="task-title">${task.title}</div>
        <div class="task-description">${task.description}</div>
      </div>
      <div class="outsidebox">
              <div class="progressbar">
                  <div class="progressbar-inside" style="width:${completionPercent}%"></div>
              </div>
              <div class="subtask-info"><span>${completedtaskss}/${totalSubtasks} Subtasks</span></div>
          </div>
      <div class="task-statuss">
        <div class="initialsboxdesign">${initialsHTML}</div>
        <img src="/img/${task.prio}.png" alt="Priority" />
      </div>
    </div>
  `;
}

async function openprofiletemplate(task) {
  document.getElementById("overlayprofile-template").classList.add("overlayss");
  document.getElementById("overlayprofile-template").classList.remove("d-none");

  setTimeout(() => {
    document.querySelector(".overlayss").style = "transform: translateX(0%);";
  }, 0.5);

  inputacessprofile(task);
}

async function inputacessprofile(task) {
  document.getElementById("profiletitle").innerHTML = task.title || "";
  document.getElementById("profiledescription").innerHTML =
    task.description || "";
  document.getElementById("profileduedate").innerHTML = task.duedate || "";
  document.getElementById("profilepriority").innerHTML = task.prio || "";
  document.getElementById("profileicon").src = `../img/${
    task.prio || "default"
  }.png`;

  const initialsArray = Array.isArray(task.initials) ? task.initials : [];

  const initialsHTMLPromises = initialsArray
    .filter((item) => item.initials)
    .map(async (item) => {
      const color = getColorFromInitials(item.initials);
      return /*html*/ `
        <div class="alignsubdiv">
          <div class="badgestyle badge" style="background-color:${color}">${
        item.initials
      }</div>
          <div>${item.name || ""}</div>
        </div>`;
    });

  const initialsHTML = (await Promise.all(initialsHTMLPromises)).join("");

  document.getElementById("profileassingedarea").innerHTML = initialsHTML;

  const subtaskArray = Array.isArray(task.subtask) ? task.subtask : [];
  const subtaskHTMLPromises = subtaskArray.map(async (subtask) => {
    return /*html*/ `
    <div class="alignsubdiv2">
      <div></div><div>${subtask.subtask}</div>
    </div>`;
  });

  const subtaskHTML = (await Promise.all(subtaskHTMLPromises)).join("");

  document.getElementById("subtaskarea").innerHTML = subtaskHTML;
}

async function inputacesstechnicall(task) {
  document.getElementById("technicaltasktitle").innerHTML = `${task.title}`;
  document.getElementById("descriptioninput").innerHTML = `${task.description}`;
  document.getElementById(
    "due-date-containerinput"
  ).innerHTML = `${task.duedate}`;
  document.getElementById("showprio").innerHTML = `${task.prio}`;
  document.getElementById("showassignedperson").innerHTML = "";
  document.getElementById("showassignedperson").innerHTML +=
    await assignedtotemplate(task);
  document.getElementById("subtaskbox").innerHTML += await showsubtaskstemplate(
    task
  );
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

async function showsubtaskstemplate(task) {
  if (!Array.isArray(task.subtask)) return "";

  const subtasksHTML = task.subtask
    .map((subtaskItem, index) => {
      return /*html*/ `
        <div class="designlayout">
          <label class="custom-checkbox">
            <input type="checkbox" id="${task.id}-${index}" ${
        subtaskItem.completed ? "checked" : ""
      } class="checkboxdesign" />
            <span class="checkmark"></span>
          </label>
          <span class="subtask-title">${subtaskItem.subtask}</span>
        </div>
      `;
    })
    .join("");

  return /*html*/ `
    <div class="subtasks-container">
      ${subtasksHTML}
    </div>
  `;
}

async function assignedtotemplate(task) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];

  console.log("Initials Array:", initialsArray);

  const initialsHTMLPromises = initialsArray
    .filter((item) => item.initials)
    .map(async (item) => {
      const color = getColorFromInitials(item.initials);
      const html = `
        <div class="alignsubdiv">
          <div class="badgestyle badge" style="background-color:${color}">${item.initials}</div>
          <div>${item.name}</div> <!-- Assuming name is associated with initials -->
        </div>`;
      console.log("Generated HTML for Initial:", html);
      return html;
    });

  const initialsHTML = await Promise.all(initialsHTMLPromises);
  console.log("Initials HTML Array Before Joining:", initialsHTML);

  const finalHTML = initialsHTML.filter(Boolean).join("");
  console.log("Final HTML:", finalHTML);

  return /*html*/ `
      <div class="align" id="showassignedperson">
        ${finalHTML}  
      </div>
  `;
}

async function opentechnicaltemplate(task) {
  document
    .getElementById("overlaytechinical-task-template")
    .classList.add("overlayss");
  document
    .getElementById("overlaytechinical-task-template")
    .classList.remove("d-none");
  setTimeout(() => {
    document.querySelector(".overlayss").style = "transform: translateX(0%);";
  }, 0.5);
  inputacesstechnicall(task);
}

function closeaddtasktemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("overlay-addtask").classList.add("d-none");
    document.getElementById("overlay-addtask").classList.remove("overlayss");
  }, 1000);
}

function closeoverlayprofiletemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";

  setTimeout(() => {
    document.getElementById("overlayprofile-template").classList.add("d-none");
    document
      .getElementById("overlayprofile-template")
      .classList.remove("overlayss");
  }, 1000);
}

function closeoverlaytechnicaltemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";

  setTimeout(() => {
    document
      .getElementById("overlaytechinical-task-template")
      .classList.add("d-none");
    document
      .getElementById("overlaytechinical-task-template")
      .classList.remove("overlayss");
  }, 1000);
}

async function calladdtasktemplate() {
  document.getElementById("overlay-addtask").classList.remove("d-none");
  document.getElementById("overlay-addtask").classList.add("overlayss");
  setTimeout(() => {
    document.getElementById("overlay-addtask").style.transform =
      "translateX(0%)";
  }, 0.9);
}

document
  .getElementById("add-tasktemplate")
  .addEventListener("click", function () {
    calladdtasktemplate();
  });

function applyHoverEffect(buttonId, imageId, hoverSrc) {
  const buttonElement = document.getElementById(buttonId);
  const imageElement = document.getElementById(imageId);

  buttonElement.addEventListener("mouseover", function () {
    imageElement.src = hoverSrc;
  });

  buttonElement.addEventListener("mouseout", function () {
    imageElement.src = "/img/status-item.png";
  });

  buttonElement.addEventListener("click", function () {
    calladdtasktemplate();
  });
}

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

document.getElementById("todo-folder").addEventListener("drop", drop);
document.getElementById("inprogress-folder").addEventListener("drop", drop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("drop", drop);
document.getElementById("done-folder").addEventListener("drop", drop);

document.getElementById("todo-folder").addEventListener("dragover", allowDrop);
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("dragover", allowDrop);
document.getElementById("done-folder").addEventListener("dragover", allowDrop);
