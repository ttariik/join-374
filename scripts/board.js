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
    todos: todos.map(formatTaskData),
    inprogress: inprogress.map(formatTaskData),
    awaitingfeedback: awaitingfeedback.map(formatTaskData),
    donetasks: donetasks.map(formatTaskData),
  };
  localStorage.setItem("taskPositions", JSON.stringify(positions));
};

function formatTaskData(task) {
  console.log("Formatting task:", task);
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
  const targetFolder = event.currentTarget.id;

  // Remove task from existing array
  removeFromArray(taskId);
  deleteData(`user/1/tasks/todo-folder/${taskId}`);
  // Determine target array and Firebase path
  let updatedArray;

  switch (targetFolder) {
    case "inprogress-folder":
      updatedArray = inprogress;
      putData("users/1/tasks/inprogress-folder");
      break;
    case "awaiting-feedback-folder":
      updatedArray = awaitingfeedback;
      putData("users/1/tasks/awaiting-feedback-folder");
      break;
    case "done-folder":
      updatedArray = donetasks;
      putData("users/1/tasks/inprogress-folder");
      break;
    case "todo-folder":
      updatedArray = todos;
      break;
    default:
      console.warn("Unknown target folder:", targetFolder);
      return;
  }

  updatedArray.push(formatTaskData(taskElement));

  event.currentTarget.appendChild(taskElement);

  saveTaskPositions();
  countTasks();
}

async function removeFromArray(taskId) {
  const removeTask = (array, firebasePath) => {
    const index = array.findIndex((task) => task.id === taskId);
    if (index > -1) {
      array.splice(index, 1);
      putData(firebasePath, array);
    }
  };

  // Remove from each array and update Firebase
  removeTask(todos, "/1/users/tasks/todo-folder");
  removeTask(inprogress, "/1/users/tasks/inprogress-folder");
  removeTask(awaitingfeedback, "/1/users/tasks/awaiting-feedback-folder");
  removeTask(donetasks, "/1/users/tasks/done-folder");
}

async function loadtasks(id = 1) {
  try {
    const response = await fetch(GLOBAL + `users/${id}/tasks.json`);
    const userData = await response.json();

    const todoTasks = Object.entries(userData["todo-folder"] || {}).filter(
      ([_, task]) => task !== null && task !== undefined
    );
    const inProgressTasks = Object.entries(
      userData["inprogress-folder"] || {}
    ).filter(([_, task]) => task !== null && task !== undefined);
    const awaitingFeedbackTasks = Object.entries(
      userData["awaiting-feedback-folder"] || {}
    ).filter(([_, task]) => task !== null && task !== undefined);
    const doneTasks = Object.entries(userData["done-folder"] || {}).filter(
      ([_, task]) => task !== null && task !== undefined
    );

    document.getElementById("todo-folder").innerHTML = "";
    document.getElementById("inprogress-folder").innerHTML = "";
    document.getElementById("awaiting-feedback-folder").innerHTML = "";
    document.getElementById("done-folder").innerHTML = "";

    const renderTasksWithTemplate = async (tasks, containerId) => {
      const container = document.getElementById(containerId);

      for (const [taskId, task] of tasks) {
        if (task && task.category) {
          let taskHTML;
          if (task.category === "Technical Task") {
            taskHTML = await Technicaltasktemplate({ ...task, id: taskId });
          } else {
            taskHTML = await userstorytemplate({ ...task, id: taskId });
          }

          container.insertAdjacentHTML("beforeend", taskHTML);

          const taskElement = document.getElementById(taskId);
          if (taskElement) {
            taskElement.addEventListener("click", function () {
              if (task.category === "Technical Task") {
                opentechnicaltemplate(task);
              } else {
                openprofiletemplate(task);
              }
            });
          }
        }
      }
    };

    await renderTasksWithTemplate(todoTasks, "todo-folder");
    await renderTasksWithTemplate(inProgressTasks, "inprogress-folder");
    await renderTasksWithTemplate(
      awaitingFeedbackTasks,
      "awaiting-feedback-folder"
    );
    await renderTasksWithTemplate(doneTasks, "done-folder");
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

function restoreTaskPositions() {
  loadTaskPositions();

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
      continue;
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
    <div class="user-container task"   draggable="true" ondragstart="drag(event)"  id="${
      task.id
    }" 
         ${totalSubtasks === 0 ? 'style="margin-top: 50px;"' : ""}>
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
  opentasktemplate(task);
  const response = await fetch("./profile-template.html");
  if (!response.ok) throw new Error("Network response was not ok");
  const htmlContent = await response.text();
  document.getElementById("templateoverlay").innerHTML = htmlContent;
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
    // Access a property on `subtask`, such as `subtask.name`
    return /*html*/ `
    <div class="alignsubdiv2">
      <div></div><div>${subtask.subtask}</div>
    </div>`;
  });

  const subtaskHTML = (await Promise.all(subtaskHTMLPromises)).join("");

  document.getElementById("subtaskarea").innerHTML = subtaskHTML;
}

async function inputacesstechnicall(task) {
  document.getElementById("title").innerHTML = `${task.title}`;
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
  opentasktemplate(task);
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
