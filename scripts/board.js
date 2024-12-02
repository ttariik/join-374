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

document.querySelectorAll(".task").forEach((taskElement) => {
  if (!taskElement.hasAttribute("data-current-folder-id")) {
    taskElement.setAttribute(
      "data-current-folder-id",
      taskElement.parentElement.id
    );
  }
});

async function openprofiletemplate(task, contacts) {
  document.getElementById("overlayprofile-template").classList.add("overlayss");
  document.getElementById("overlayprofile-template").classList.remove("d-none");
  // Ensure the content is updated before starting the transition
  await inputacessprofile(task, contacts);
  // Apply the transition after content is updated
  setTimeout(() => {
    document.querySelector(".overlayss").style.transform = "translateX(0%)";
  }, 0); // A slight delay for the transform effect
}

function styleSubtaskArea() {
  const subtaskArea = document.getElementById("subtaskarea");
  if (subtaskArea) {
    subtaskArea.style = "padding: 6px 0px 0px;";
  }
}

function updateProfileTitle(task) {
  const profileTitleElement = document.getElementById("profiletitle");
  if (profileTitleElement) {
    profileTitleElement.innerHTML = task.title || "";
  }
}

function updateProfileDescription(task) {
  const profileDescriptionElement =
    document.getElementById("profiledescription");
  if (profileDescriptionElement) {
    profileDescriptionElement.innerHTML = task.description || "";
  }
}

function updateProfileDueDate(task) {
  const profileDueDateElement = document.getElementById("profileduedate");
  if (profileDueDateElement) {
    profileDueDateElement.innerHTML = task.duedate || "";
  }
}

function updateProfilePriority(task) {
  const profilePriorityElement = document.getElementById("profilepriority");
  if (profilePriorityElement) {
    profilePriorityElement.innerHTML = task.prio || "";
  }
}

function updateProfileIcon(task) {
  const profileIconElement = document.getElementById("profileicon");
  if (profileIconElement) {
    profileIconElement.src = `../img/${task.prio || "default"}.png`;
  }
}

function setupDeleteButton(task) {
  const btn1_10 = document.getElementById("btn1_10");
  if (btn1_10) {
    btn1_10.addEventListener("click", function () {
      deletetask(task);
    });
  }
}

function setupEditButton(task) {
  const btn2_11 = document.getElementById("btn2-11");
  if (btn2_11) {
    btn2_11.addEventListener("click", function () {
      editprofile(task);
    });
  }
}

async function inputacessprofile(task, contacts) {
  styleSubtaskArea();
  updateProfileTitle(task);
  updateProfileDescription(task);
  updateProfileDueDate(task);
  updateProfilePriority(task);
  updateProfileIcon(task);
  setupDeleteButton(task);
  setupEditButton(task);

  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const contactsArray = (
    Array.isArray(contacts) ? contacts : Object.values(contacts)
  ).filter((contact) => contact !== null && contact !== undefined);

  const profileAssignedArea = document.getElementById("profileassingedarea");
  let badgeHTML = "";
  renderAssignedContactsAndSubtasks(
    initialsArray,
    contactsArray,
    profileAssignedArea,
    badgeHTML,
    task
  );
}

async function renderAssignedContactsAndSubtasks(
  initialsArray,
  contactsArray,
  profileAssignedArea,
  badgeHTML,
  task
) {
  contactsArray.forEach((contact) => {
    const matchingInitials = initialsArray.find(
      (initialObj) => initialObj.initials === contact.initials
    );
    badgeHTML = generatecontactbadgehtml(matchingInitials, contact, badgeHTML);
  });
  if (profileAssignedArea) {
    profileAssignedArea.innerHTML = badgeHTML;
  }
  await renderSubtasks(task);
}

async function renderSubtasks(task) {
  const subtaskHTML = await showsubtaskstemplate(task);
  const subtaskArea = document.getElementById("subtaskarea");

  if (subtaskArea) {
    subtaskArea.innerHTML = subtaskHTML;
  }
}

function generatecontactbadgehtml(matchingInitials, contact, badgeHTML) {
  if (matchingInitials) {
    const initials = matchingInitials.initials;
    const name = matchingInitials.name;
    const contactColor = contact.color || "#000";

    badgeHTML += `<div>
      <div class="badge alignment" style="background-color:${contactColor}">
        ${initials}
      </div>
      <span>${name}</span>
    </div>`;
  }
  return badgeHTML;
}

function inputaccess(task) {
  document.getElementById("technicaltasktitle").innerHTML = task.title;
  document.getElementById("descriptioninput").innerHTML = task.description;
  document.getElementById("due-date-containerinput").innerHTML = task.duedate;
  document.getElementById("showprio").innerHTML = task.prio;
  document.getElementById("prioiconid").src = `/img/${task.prio}.png`;
}

async function inputacesstechnicall(task, contacts) {
  inputaccess(task);
  const deleteButton = document.getElementById("btn1");
  const editButton = document.getElementById("btn2");
  const newDeleteButton = deleteButton.cloneNode(true);
  const newEditButton = editButton.cloneNode(true);
  deleteButton.replaceWith(newDeleteButton);
  editButton.replaceWith(newEditButton);
  newDeleteButton.addEventListener("click", () => deletetask(task));
  newEditButton.addEventListener("click", () => editinputs(task));
  // Render assigned persons and subtasks
  await assignedtotemplate(task, contacts);
  const subtaskHTML = await showsubtaskstemplate(task);
  document.getElementById("subtaskbox").innerHTML = subtaskHTML;
}

function deletetask(task) {
  const taskId = task.id;
  const taskElement = document.getElementById(taskId);
  const parentFolder = taskElement.parentElement;
  const parentFolderId = parentFolder.id;
  deleteData(`users/1/tasks/${parentFolderId}/${taskId}`, task)
    .then(() => {
      taskElement.remove();
      displaynotasksmessage(parentFolder, parentFolderId);
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
  closeoverlaytechnicaltemplate();
}

function displaynotasksmessage(parentFolder, parentFolderId) {
  if (parentFolder.children.length > 0) return;

  const noTasksMessage = document.createElement("div");
  noTasksMessage.className = "nothing";

  const messages = {
    "todo-folder": "No tasks To do",
    "inprogress-folder": "No tasks in progress",
    "awaiting-feedback-folder": "No tasks awaiting feedback",
    "done-folder": "No tasks done",
  };

  noTasksMessage.textContent = messages[parentFolderId] || "No tasks";
  parentFolder.appendChild(noTasksMessage);
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

async function opentechnicaltemplate(task, contacts) {
  document
    .getElementById("overlaytechinical-task-template")
    .classList.add("overlayss");
  document
    .getElementById("overlaytechinical-task-template")
    .classList.remove("d-none");
  setTimeout(() => {
    document.querySelector(".overlayss").style = "transform: translateX(0%);";
  }, 0);
  inputacesstechnicall(task, contacts);
}

function closeaddtasktemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("overlay-addtask").classList.add("d-none");
    document.getElementById("overlay-addtask").classList.remove("overlayss");
  }, 1000);
}

async function closeoverlayprofiletemplate() {
  asignedtousers = [];
  initialsArray = [];
  if (document.getElementById("assignedusers1")) {
    document.getElementById("assignedusers1").innerHTML = "";
  }
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("overlayprofile-template").classList.add("d-none");
    document
      .getElementById("overlayprofile-template")
      .classList.remove("overlayss");
  }, 1000);
}

async function closeoverlaytechnicaltemplate() {
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
