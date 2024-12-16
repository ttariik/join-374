/**
 * Tracks the number of completed tasks.
 * @type {number}
 */
let completedtasks = 0;

/**
 * Holds the full names of tasks.
 * @type {Array<string>}
 */
let fullnames = [];

/**
 * Holds the colors for tasks.
 * @type {Array<string>}
 */
let colors = [];

/**
 * Array to store todo tasks.
 * @type {Array<object>}
 */
let todos = [];

/**
 * Array to store in-progress tasks.
 * @type {Array<object>}
 */
let inprogress = [];

/**
 * Array to store tasks awaiting feedback.
 * @type {Array<object>}
 */
let awaitingfeedback = [];

/**
 * Array to store tasks marked as done.
 * @type {Array<object>}
 */
let donetasks = [];

/**
 * Object that maps task folder IDs to corresponding task arrays.
 * @type {object}
 */
const taskFolders = {
  "todo-folder": todos,
  "inprogress-folder": inprogress,
  "awaiting-feedback-folder": awaitingfeedback,
  "done-folder": donetasks,
};

/**
 * Search input field element.
 * @type {HTMLInputElement}
 */
const searchInput = document.getElementById("searchInput");

/**
 * Filters tasks based on the input search value.
 */
searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(filter) ? "" : "none";
  });
});

/**
 * Assigns a folder ID to task elements that don't already have one.
 */
document.querySelectorAll(".task").forEach((taskElement) => {
  if (!taskElement.hasAttribute("data-current-folder-id")) {
    taskElement.setAttribute(
      "data-current-folder-id",
      taskElement.parentElement.id
    );
  }
});

/**
 * Opens the profile template overlay for a task.
 * @param {object} task The task object to display.
 * @param {object} contacts The contacts to display for the task.
 */
async function openprofiletemplate(task, contacts) {
  document.getElementById("overlayprofile-template").classList.add("overlayss");
  document.getElementById("overlayprofile-template").classList.remove("d-none");
  await inputacessprofile(task, contacts);
  setTimeout(() => {
    document.querySelector(".overlayss").style.transform = "translateX(0%)";
  }, 0);
}

/**
 * Updates the profile title based on the task.
 * @param {object} task The task object containing the title.
 */
function updateProfileTitle(task) {
  const profileTitleElement = document.getElementById("profiletitle");
  if (profileTitleElement) {
    profileTitleElement.innerHTML = task.title || "";
  }
}

/**
 * Updates the profile description based on the task.
 * @param {object} task The task object containing the description.
 */
function updateProfileDescription(task) {
  const profileDescriptionElement =
    document.getElementById("profiledescription");
  if (profileDescriptionElement) {
    profileDescriptionElement.innerHTML = task.description || "";
  }
}

/**
 * Updates the profile due date based on the task.
 * @param {object} task The task object containing the due date.
 */
function updateProfileDueDate(task) {
  const profileDueDateElement = document.getElementById("profileduedate");
  if (profileDueDateElement) {
    profileDueDateElement.innerHTML = task.duedate || "";
  }
}

/**
 * Updates the profile priority based on the task.
 * @param {object} task The task object containing the priority.
 */
function updateProfilePriority(task) {
  const profilePriorityElement = document.getElementById("profilepriority");
  if (profilePriorityElement) {
    profilePriorityElement.innerHTML = task.prio || "";
  }
}

/**
 * Updates the profile icon based on the task priority.
 * @param {object} task The task object containing the priority.
 */
function updateProfileIcon(task) {
  const profileIconElement = document.getElementById("profileicon");
  if (profileIconElement) {
    profileIconElement.src = `../img/${task.prio || "default"}.png`;
  }
}

/**
 * Sets up the delete button for the task profile.
 * @param {object} task The task object to delete.
 */
function setupDeleteButton(task) {
  const btn1_10 = document.getElementById("btn1_10");
  if (btn1_10) {
    btn1_10.addEventListener("click", function () {
      deletetask(task.id, task);
    });
  }
}

/**
 * Sets up the edit button for the task profile.
 * @param {object} task The task object to edit.
 */
function setupEditButton(task) {
  const btn2_11 = document.getElementById("btn2-11");
  if (btn2_11) {
    btn2_11.addEventListener("click", function () {
      editprofile(task);
    });
  }
}

/**
 * Updates the profile with the task details and assigned contacts.
 * @param {object} task The task object.
 * @param {object} contacts The contacts to display in the profile.
 */
async function inputacessprofile(task, contacts) {
  updateProfileTitle(task);
  updateProfileDescription(task);
  updateProfileDueDate(task);
  updateProfilePriority(task);
  updateProfileIcon(task);
  setupDeleteButton(task);
  setupEditButton(task);
  const { initialsArray, contactsArray, profileAssignedArea, badgeHTML } =
    prepareprofileassignedarea(task, contacts);
  renderAssignedContactsAndSubtasks(
    initialsArray,
    contactsArray,
    profileAssignedArea,
    badgeHTML,
    task
  );
}

/**
 * Prepares the assigned area data for the profile view.
 * @param {object} task The task object.
 * @param {object} contacts The contacts for the task.
 * @returns {object} The prepared profile assigned area data.
 */
function prepareprofileassignedarea(task, contacts) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const contactsArray = (
    Array.isArray(contacts) ? contacts : contacts ? Object.values(contacts) : []
  ).filter((contact) => contact !== null && contact !== undefined);
  const profileAssignedArea = document.getElementById("profileassingedarea");
  let badgeHTML = "";
  return { initialsArray, contactsArray, profileAssignedArea, badgeHTML };
}

/**
 * Renders the assigned contacts and subtasks in the profile.
 * @param {Array<object>} initialsArray Array of initials.
 * @param {Array<object>} contactsArray Array of contacts.
 * @param {HTMLElement} profileAssignedArea The profile assigned area element.
 * @param {string} badgeHTML The badge HTML string.
 * @param {object} task The task object.
 */
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

/**
 * Generates HTML for a contact badge.
 * @param {object} matchingInitials The matching initials object.
 * @param {object} contact The contact object.
 * @param {string} badgeHTML The existing badge HTML.
 * @returns {string} The updated badge HTML.
 */
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

/**
 * Updates the task's technical details in the input form.
 * @param {object} task The task object.
 */
async function inputaccess(task) {
  setupEditButton();
  if (document.getElementById("technicaltasktitle")) {
    document.getElementById("technicaltasktitle").innerHTML = task.title;
    document.getElementById("descriptioninput").innerHTML = task.description;
    document.getElementById("due-date-containerinput").innerHTML = task.duedate;
    document.getElementById("showprio").innerHTML = task.prio;
    document.getElementById("prioiconid").src = `/img/${task.prio}.png`;
  }
}

/**
 * Updates the task's technical details and renders assigned users and subtasks.
 * @param {object} task The task object.
 * @param {object} contacts The contacts for the task.
 */
async function inputacesstechnicall(task, contacts) {
  await inputaccess(task);
  await assignedtotemplate(task, contacts);
  const subtaskHTML = await showsubtaskstemplate(task);
  const subtaskBox = document.getElementById("subtaskbox");
  if (subtaskBox) {
    subtaskBox.innerHTML = subtaskHTML;
  }
  const deleteButton = document.getElementById("btn1");
  const editButton = document.getElementById("btn2");

  if (deleteButton && editButton) {
    const newDeleteButton = deleteButton.cloneNode(true);
    const newEditButton = editButton.cloneNode(true);

    deleteButton.replaceWith(newDeleteButton);
    editButton.replaceWith(newEditButton);

    newDeleteButton.addEventListener("click", () => deletetask(task.id, task));
    newEditButton.addEventListener("click", () => editinputs(task));
  } else {
    console.warn("Buttons btn1 or btn2 not found in the DOM.");
  }
}


/**
 * Deletes a task from the list and updates the display.
 * 
 * @param {string} id - The ID of the task to be deleted.
 * @param {Object} task - The task object containing task details.
 */
function deletetask(id, task) {
  const taskId = id;
  const taskElement = document.getElementById(taskId);
  const parentFolder = taskElement.parentElement;
  const parentFolderId = parentFolder.id;
  deleteData(`users/1/tasks/${parentFolderId}/${taskId}`, task)
    .then(() => {
      taskElement.remove();
      displaynotasksmessage(parentFolder, parentFolderId);
    })
    .catch((error) => {});
  closeoverlaytechnicaltemplate();
  loadtasks();
}

/**
 * Displays a message when no tasks are available in a folder.
 * 
 * @param {HTMLElement} parentFolder - The parent folder element where the message will be displayed.
 * @param {string} parentFolderId - The ID of the parent folder.
 */
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

/**
 * Deletes data from the server using the DELETE HTTP method.
 * 
 * @param {string} path - The path to the resource to be deleted.
 * @param {Object} data - The data to be deleted.
 * @returns {Promise<Object>} - The response from the server after deletion.
 */
async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

/**
 * Opens the technical task template overlay and initializes its content.
 * 
 * @param {Object} task - The task object to be displayed in the overlay.
 * @param {Object} contacts - The contacts associated with the task.
 */
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

/**
 * Closes the add task template overlay.
 */
function closeaddtasktemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  document.getElementById("selectbutton").onclick = showcontacts;
  setTimeout(() => {
    document.getElementById("overlay-addtask").classList.add("d-none");
    document.getElementById("overlay-addtask").classList.remove("overlayss");
    emptyinputs();
    selectbutton_2();
    resetsearchbar();
  }, 1000);
}

/**
 * Closes the profile template overlay.
 */
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

/**
 * Closes the technical task template overlay.
 */
async function closeoverlaytechnicaltemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  setTimeout(() => {
    document
      .getElementById("overlaytechinical-task-template")
      .classList.add("d-none");
    document
      .getElementById("overlaytechinical-task-template")
      .classList.remove("overlayss");
    subtasks = [];
  }, 1000);
}

/**
 * Opens the "Add Task" template overlay.
 */
async function calladdtasktemplate() {
  document.getElementById("overlay-addtask").classList.remove("d-none");
  document.getElementById("overlay-addtask").classList.add("overlayss");
  styleofthebuttons();
  setTimeout(() => {
    document.getElementById("overlay-addtask").style.transform =
      "translateX(0%)";
  }, 0.9);
}

/**
 * Styles the buttons in the add task template.
 */
function styleofthebuttons() {
  document.getElementById("button1").style.maxWidth = "136px";
  document.getElementById("button2").style.maxWidth = "136px";
  document.getElementById("button3").style.maxWidth = "136px";
  document.getElementById("button1").style.height = "56px";
  document.getElementById("button2").style.height = "56px";
  document.getElementById("button3").style.height = "56px";
}

/**
 * Adds hover effect to buttons, changing the image source on hover.
 * 
 * @param {string} buttonId - The ID of the button to apply the hover effect to.
 * @param {string} imageId - The ID of the image element to change on hover.
 * @param {string} hoverSrc - The source URL for the hover image.
 */
function applyHoverEffect(buttonId, imageId, hoverSrc) {
  const buttonElement = document.getElementById(buttonId);
  const imageElement = document.getElementById(imageId);
  buttonElement.addEventListener("mouseover", function () {
    imageElement.src = hoverSrc;
  });
  buttonElement.addEventListener("mouseout", function () {
    imageElement.src = "/img/status-item.png";
  });
  buttonElement.addEventListener("click", function (event) {
    calladdtasktemplate();
    selectedbutton = buttonElement.id;
  });
}

/**
 * Changes the status of a subtask and updates the server.
 * 
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask whose status is changing.
 * @param {boolean} status - The new status of the subtask (true for completed, false for not completed).
 * @param {Event} event - The event that triggered the status change.
 */
async function changestatus(taskId, subtaskIndex, status, event) {
  try {
    const taskElement = document.getElementById(taskId);
    const parentFolderId = taskElement.parentElement.id;
    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();
    const subtask = taskData.subtask[subtaskIndex];
    if (subtask) {
      subtask.completed = !subtask.completed;
      await putData(`users/1/tasks/${parentFolderId}/${taskId}`, taskData);
    }
    loadtasks(taskId, parentFolderId);
  } catch (error) {}
}

/**
 * Applies a hover effect to a button and changes the image source on hover.
 * 
 * @param {string} buttonId - The ID of the button to apply the hover effect to.
 * @param {string} imageId - The ID of the image element to change on hover.
 * @param {string} hoverSrc - The source URL for the hover image.
 */
applyHoverEffect("buttonicon1", "pic1", "/img/pic1hovered.png");
applyHoverEffect("buttonicon2", "pic2", "/img/pic1hovered.png");
applyHoverEffect("buttonicon3", "pic3", "/img/pic1hovered.png");

/**
 * Adds an event listener to the "drop" event on the "todo-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document.getElementById("todo-folder").addEventListener("drop", drop);

/**
 * Adds an event listener to the "drop" event on the "inprogress-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document.getElementById("inprogress-folder").addEventListener("drop", drop);

/**
 * Adds an event listener to the "drop" event on the "awaiting-feedback-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("drop", drop);

/**
 * Adds an event listener to the "drop" event on the "done-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document.getElementById("done-folder").addEventListener("drop", drop);

/**
 * Adds an event listener to the "dragover" event on the "todo-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document.getElementById("todo-folder").addEventListener("dragover", allowDrop);

/**
 * Adds an event listener to the "dragover" event on the "inprogress-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);

/**
 * Adds an event listener to the "dragover" event on the "awaiting-feedback-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("dragover", allowDrop);

/**
 * Adds an event listener to the "dragover" event on the "done-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document.getElementById("done-folder").addEventListener("dragover", allowDrop);
