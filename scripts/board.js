/**
 * Tracks the number of completed tasks.
 * @type {number}
 */
let completedtasks = 0;

/**
 * Array holding the full names of contacts.
 * @type {string[]}
 */
let fullnames = [];

/**
 * Array holding the colors associated with contacts.
 * @type {string[]}
 */
let colors = [];

/**
 * Array for holding to-do tasks.
 * @type {Array}
 */
let todos = [];

/**
 * Array for holding tasks in progress.
 * @type {Array}
 */
let inprogress = [];

/**
 * Array for holding tasks awaiting feedback.
 * @type {Array}
 */
let awaitingfeedback = [];

/**
 * Array for holding completed tasks.
 * @type {Array}
 */
let donetasks = [];

/**
 * Tracks the current task folder IDs.
 * @type {Array}
 */
let currentid = [];

/**
 * Object mapping task folder IDs to respective task arrays.
 * @type {Object}
 */
const taskFolders = {
  "todo-folder": todos,
  "inprogress-folder": inprogress,
  "awaiting-feedback-folder": awaitingfeedback,
  "done-folder": donetasks,
};

/**
 * The search input element for filtering tasks.
 * @type {HTMLInputElement}
 */
const searchInput = document.getElementById("searchInput");

/**
 * Event listener to filter tasks based on input text.
 * @param {Event} event - The input event triggered by the search input.
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
 * Ensures all task elements have a data attribute for their folder ID.
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
 * Opens the profile template and applies a slide-in transition.
 * @param {Object} task - The task object to populate the profile with.
 * @param {Object} contacts - The contacts related to the task.
 * @returns {Promise<void>} - Resolves after the profile template transition is complete.
 */
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

/**
 * Updates the profile's title element based on the task's title.
 * @param {Object} task - The task object containing the title.
 */
function updateProfileTitle(task) {
  const profileTitleElement = document.getElementById("profiletitle");
  if (profileTitleElement) {
    profileTitleElement.innerHTML = task.title || "";
  }
}

/**
 * Updates the profile's description element based on the task's description.
 * @param {Object} task - The task object containing the description.
 */
function updateProfileDescription(task) {
  const profileDescriptionElement =
    document.getElementById("profiledescription");
  if (profileDescriptionElement) {
    profileDescriptionElement.innerHTML = task.description || "";
  }
}

/**
 * Updates the profile's due date element based on the task's due date.
 * @param {Object} task - The task object containing the due date.
 */
function updateProfileDueDate(task) {
  const profileDueDateElement = document.getElementById("profileduedate");
  if (profileDueDateElement) {
    profileDueDateElement.innerHTML = task.duedate || "";
  }
}

/**
 * Updates the profile's priority element based on the task's priority.
 * @param {Object} task - The task object containing the priority.
 */
function updateProfilePriority(task) {
  const profilePriorityElement = document.getElementById("profilepriority");
  if (profilePriorityElement) {
    profilePriorityElement.innerHTML = task.prio || "";
  }
}

/**
 * Updates the profile's icon based on the task's priority.
 * @param {Object} task - The task object containing the priority.
 */
function updateProfileIcon(task) {
  const profileIconElement = document.getElementById("profileicon");
  if (profileIconElement) {
    profileIconElement.src = `../img/${task.prio || "default"}.png`;
  }
}

/**
 * Sets up the delete button for the task profile.
 * @param {Object} task - The task object for which the delete button will be set up.
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
 * @param {Object} task - The task object for which the edit button will be set up.
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
 * Updates the profile with task details and sets up the UI.
 * @param {Object} task - The task object to update the profile with.
 * @param {Object} contacts - The contacts related to the task.
 * @returns {Promise<void>} - Resolves after profile updates are complete.
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
 * Prepares the assigned area for contacts by extracting necessary information.
 * @param {Object} task - The task object containing the assigned contacts.
 * @param {Object} contacts - The contacts related to the task.
 * @returns {Object} - An object containing the initials array, contacts array, and the profile assigned area.
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
 * Renders assigned contacts and subtasks in the profile.
 * @param {Object[]} initialsArray - The array of initials associated with the contacts.
 * @param {Object[]} contactsArray - The array of contact objects.
 * @param {HTMLElement} profileAssignedArea - The DOM element where the assigned contacts will be rendered.
 * @param {string} badgeHTML - The HTML string that will render the contact badges.
 * @param {Object} task - The task object containing subtasks.
 * @returns {Promise<void>} - Resolves after contacts and subtasks are rendered.
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
 * Renders subtasks for a given task.
 * @param {Object} task - The task object containing the subtasks.
 * @returns {Promise<void>} - Resolves after subtasks are rendered.
 */
async function renderSubtasks(task) {
  const subtaskHTML = await showsubtaskstemplate(task);
  const subtaskArea = document.getElementById("subtaskarea");
  if (subtaskArea) {
    subtaskArea.innerHTML = subtaskHTML;
  }
}

/**
 * Generates the HTML for a contact badge.
 * @param {Object} matchingInitials - The matching initials object for the contact.
 * @param {Object} contact - The contact object containing contact details.
 * @param {string} badgeHTML - The current HTML for the badge.
 * @returns {string} - The updated badge HTML.
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
 * Sets the task data (title, description, due date, and priority) in the input fields for editing.
 * @param {Object} task - The task object containing the details to populate the fields.
 * @returns {Promise<void>} - Resolves after the task details are populated.
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
 * Updates the task data and renders assigned contacts and subtasks in the technical template.
 * @param {Object} task - The task object containing the details to populate the fields.
 * @param {Object} contacts - The contacts related to the task.
 * @returns {Promise<void>} - Resolves after the task details are updated and the template is rendered.
 */
async function inputacesstechnicall(task, contacts) {
  await inputaccess(task);
  // Render assigned persons and subtasks
  await assignedtotemplate(task, contacts);
  const subtaskHTML = await showsubtaskstemplate(task);
  document.getElementById("subtaskbox").innerHTML = subtaskHTML;
  
  const deleteButton = document.getElementById("btn1");
  const editButton = document.getElementById("btn2");
  const newDeleteButton = deleteButton.cloneNode(true);
  const newEditButton = editButton.cloneNode(true);
  
  deleteButton.replaceWith(newDeleteButton);
  editButton.replaceWith(newEditButton);
  
  newDeleteButton.addEventListener("click", () => deletetask(task.id, task));
  newEditButton.addEventListener("click", () => editinputs(task));
}

/**
 * Deletes the specified task from the UI and backend.
 * @param {string} id - The ID of the task to delete.
 * @param {Object} task - The task object to delete.
 * @returns {Promise<void>} - Resolves after the task is deleted and the UI is updated.
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
 * @param {HTMLElement} parentFolder - The folder element to check for tasks.
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
 * Deletes data from the specified path.
 * @param {string} path - The path to send the DELETE request.
 * @param {Object} data - The data to delete.
 * @returns {Promise<Object>} - Resolves with the response data.
 */
async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

/**
 * Opens the technical task template and sets up the task data.
 * @param {Object} task - The task object to populate the technical template with.
 * @param {Object} contacts - The contacts related to the task.
 * @returns {Promise<void>} - Resolves after the template is opened and populated.
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
 * Closes the add task template and resets the input fields.
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
 * Closes the profile overlay template.
 * @returns {Promise<void>} - Resolves after the overlay is closed and the UI is reset.
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
 * Closes the technical task overlay template.
 * @returns {Promise<void>} - Resolves after the overlay is closed and the UI is reset.
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
 * Opens the add task template.
 * @returns {Promise<void>} - Resolves after the template is opened.
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
 * Styles the buttons for the add task template.
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
 * Adds hover effect to buttons.
 * @param {string} buttonId - The ID of the button to apply the hover effect to.
 * @param {string} imageId - The ID of the image to change on hover.
 * @param {string} hoverSrc - The source URL for the image on hover.
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
 * Changes the status of a subtask.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask to update.
 * @param {string} status - The new status for the subtask.
 * @param {Event} event - The event that triggered the status change.
 * @returns {Promise<void>} - Resolves after the status has been updated.
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

// Event listeners for drag and drop
document
  .getElementById("todo-folder")
  .addEventListener("drop", drop);
document
  .getElementById("inprogress-folder")
  .addEventListener("drop", drop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("drop", drop);
document
  .getElementById("done-folder")
  .addEventListener("drop", drop);

document
  .getElementById("todo-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("done-folder")
  .addEventListener("dragover", allowDrop);