let completedtasks = 0;
let fullnames = [];
let colors = [];
let todos = [];
let inprogress = [];
let awaitingfeedback = [];
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
  if (task.prio !== "") {
    profileIconElement.src = `../img/${task.prio}.png`;
  } else {
    profileIconElement.src = "";
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
      setTimeout(() => {
        deletetask(task.id, task);
      }, 0);
    });
  }
}

/**
 * Sets up the edit button for the task profile.
 * @param {object} task The task object to edit.
 */
async function setupEditButton(task) {
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
    document.getElementById("technicaltasktitle").innerHTML =
      task.title || "Untitled Task";
    document.getElementById("descriptioninput").innerHTML =
      task.description || "";
    document.getElementById("due-date-containerinput").innerHTML =
      task.duedate || "No due date.";
    if (task.prio) {
      document.getElementById("showprio").innerHTML = task.prio;
      document.getElementById(
        "technicaltaskprio"
      ).src = `/img/${task.prio}.png`;
    } else {
      document.getElementById("showprio").innerHTML = "";
      document.getElementById("technicaltaskprio").src = "";
      document.getElementById("technicaltaskprio").style.display = "none";
    }
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
  if (!taskElement) {
    return;
  }
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
    document.querySelector(".overlayss").style.transform = "translateX(0%)";
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
    resetsearchbar();
  }, 400);
}
