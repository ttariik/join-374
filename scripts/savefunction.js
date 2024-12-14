/**
 * Saves changes made to the task by sending an update request to the server.
 * @param {string} taskId - The unique ID of the task to update.
 * @param {Object} task - The task object containing all task details.
 */
async function savechanges(taskId, task) {
  const parentElement = getParentElementId(taskId);
  const { title, description, duedate } = extractCurrentValues(task);
  const changes = prepareChanges(task, title, description, duedate, taskId);
  const contacts = await fetchContacts();
  await updateTask(parentElement, task.id, changes);
  await finalizeChanges(task, contacts, changes, parentElement);
}

/**
 * Retrieves the parent element of the given task ID.
 * @param {string} taskId - The unique ID of the task.
 * @returns {HTMLElement} The parent element of the task.
 */
function getParentElementId(taskId) {
  return document.getElementById(`${taskId}`).parentElement;
}

/**
 * Extracts the current values (title, description, due date) from the task inputs.
 * @param {Object} task - The task object.
 * @returns {Object} An object containing the extracted values.
 */
function extractCurrentValues(task) {
  const title = document.querySelector(".titleinputdesign").value;
  const description =
    document.querySelector(".description")?.children[1]?.value ||
    document.getElementById("descriptioninput")?.children[1]?.value;
  const duedate = document.getElementById("date1").value;
  const taskId = task.id;
  return { title, description, duedate, taskId };
}

/**
 * Prepares the changes to be sent to the server by mapping task properties.
 * @param {Object} task - The task object.
 * @param {string} title - The updated title of the task.
 * @param {string} description - The updated description of the task.
 * @param {string} duedate - The updated due date of the task.
 * @param {string} id - The unique ID of the task.
 * @returns {Object} An object containing the prepared changes.
 */
function prepareChanges(task, title, description, duedate, id) {
  const changes = {};
  templatemap(changes, task, title, description, duedate, id);
  return changes;
}

/**
 * Fetches the list of contacts from the server.
 * @returns {Promise<Object>} A promise that resolves to the fetched contacts.
 */
async function fetchContacts() {
  const response = await fetch(GLOBAL + "users/1/contacts.json");
  return response.json();
}

/**
 * Updates the task on the server with the provided changes.
 * @param {HTMLElement} parentElement - The parent element of the task.
 * @param {string} taskId - The unique ID of the task.
 * @param {Object} changes - The changes to be applied to the task.
 */
async function updateTask(parentElement, taskId, changes) {
  await putData(`/users/1/tasks/${parentElement.id}/${taskId}`, changes);
}

/**
 * Finalizes the changes by refreshing tasks and updating the overlay template.
 * @param {Object} task - The task object.
 * @param {Object} contacts - The fetched contacts.
 * @param {Object} changes - The applied changes.
 */
async function finalizeChanges(task, contacts, changes, parentElement) {
  loadtasks(task.id, parentElement.id);
  await updateOverlayTemplateBasedOnCategory(task, contacts, changes);
  subtasks = [];
}

/**
 * Determines the template ID and file based on the task category.
 * @param {Object} task - The task object.
 * @returns {Object} An object containing the template ID and file.
 */
function templateid(task) {
  const templateId =
    task.category === "User Story"
      ? "overlayprofile-template"
      : "overlaytechinical-task-template";
  const templateFile =
    task.category === "User Story"
      ? "profile-template.html"
      : "techinical-task-template.html";
  return { templateId, templateFile };
}

/**
 * Updates the overlay template based on the task category.
 * @param {Object} task - The task object.
 * @param {Object} contacts - The fetched contacts.
 * @param {Object} changes - The applied changes.
 */
async function updateOverlayTemplateBasedOnCategory(task, contacts, changes) {
  const { templateId, templateFile } = templateid(task);
  document.getElementById(templateId).innerHTML = "";
  resetOverlayTemplate(templateId, templateFile);
  setTimeout(() => {
    if (task.category === "User Story") {
      inputacessprofile(changes, contacts);
    } else {
      inputacesstechnicall(changes, contacts);
    }
  }, 15);
}

/**
 * Sets the title for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} title - The updated title of the task.
 */
function setTitle(changes, task, title) {
  changes.title = title || task.title;
}

/**
 * Sets the description for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} description - The updated description of the task.
 */
function setDescription(changes, task, description) {
  changes.description = description === "" ? task.description : description;
}

/**
 * Sets the due date for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} duedate - The updated due date of the task.
 */
function setDueDate(changes, task, duedate) {
  changes.duedate = duedate === "" ? task.duedate : duedate;
}

/**
 * Sets the priority for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string|null} selectedPriority - The selected priority of the task.
 */
function setpriority(changes, task, selectedPriority) {
  changes.prio = selectedPriority === null ? task.prio : selectedPriority;
}

/**
 * Sets the ID for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 */
function getid(changes, task) {
  changes.id = task.id;
}

/**
 * Sets the category for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 */
function setCategory(changes, task) {
  changes.category = task.category;
}

/**
 * Sets the assigned users for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {Array} asignedtousers - The list of assigned users.
 */
function setAssignedTo(changes, task, asignedtousers) {
  changes.asignedto =
    asignedtousers.length === 0 ? task.asignedto : asignedtousers;
}

/**
 * Sets the initials for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {Array} initialsArray - The list of initials.
 */
function setInitials(changes, task, initialsArray) {
  changes.initials = initialsArray.length === 0 ? task.initials : initialsArray;
}

/**
 * Sets the subtasks for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {Array} subtasks - The list of subtasks.
 * @param {HTMLElement} parentElement - The parent element of the task.
 * @param {string} taskId - The unique ID of the task.
 */
function setSubtasks(changes, task, subtasks) {
  if (!task.subtask) {
    changes.subtask = {}; // Initialize as empty object if subtasks are not defined.
  }
  if (changes.subtask === 0 || !changes.subtask) {
    changes.subtask = {}; // Initialize as empty object if subtasks are not defined.
  } else if (subtasks.length > 0) {
    changes.subtask = subtasks.map((subtask) => ({
      subtask,
      completed: false,
    }));
  } else {
    changes.subtask = task.subtask || {};
  }
}

/**
 * Maps the task properties to the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} title - The updated title of the task.
 * @param {string} description - The updated description of the task.
 * @param {string} duedate - The updated due date of the task.
 * @param {string} id - The unique ID of the task.
 */
function templatemap(changes, task, title, description, duedate, id) {
  setTitle(changes, task, title);
  getid(changes, task, id);
  setDescription(changes, task, description);
  setDueDate(changes, task, duedate);
  setpriority(changes, task, selectedPriority);
  setCategory(changes, task);
  setAssignedTo(changes, task, asignedtousers);
  setInitials(changes, task, initialsArray);
  setSubtasks(changes, task, subtasks);
}
