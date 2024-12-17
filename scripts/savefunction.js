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
  const title = document.querySelector(".titleinputdesign")
    ? document.querySelector(".titleinputdesign").value
    : "";
  const description =
    document.querySelector(".description")?.children[1]?.value ||
    document.getElementById("descriptioninput")?.children[1]?.value ||
    "";
  const duedate = document.getElementById("date23")
    ? document.getElementById("date23").value
    : "";
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
  }, 150);
}

/**
 * Sets the title for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} title - The updated title of the task.
 */
async function setTitle(changes, task, title) {
  changes.title = title || task.title;
}

/**
 * Sets the description for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} description - The updated description of the task.
 */
async function setDescription(changes, task, description) {
  changes.description = description === "" ? task.description : description;
}

/**
 * Sets the due date for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string} duedate - The updated due date of the task.
 */
async function setDueDate(changes, task, duedate) {
  changes.duedate = duedate === "" ? task.duedate : duedate;
}

/**
 * Sets the priority for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {string|null} selectedPriority - The selected priority of the task.
 */
async function setpriority(changes, task, selectedPriority) {
  changes.prio = selectedPriority === null ? task.prio : selectedPriority;
}

/**
 * Sets the ID for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 */
async function getid(changes, task) {
  changes.id = task.id;
}

/**
 * Sets the category for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 */
async function setCategory(changes, task) {
  changes.category = task.category;
}

/**
 * Sets the assigned users for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {Array} asignedtousers - The list of assigned users.
 */
async function setAssignedTo(changes, task, asignedtousers) {
  // Combine existing assigned users with the new ones, avoiding duplicates
  changes.asignedto = [...new Set([...task.asignedto, ...asignedtousers])];
}

/**
 * Sets the initials for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {Array} initialsArray - The list of initials.
 */
function setInitials(changes, task, initialsArray) {
  // Merge task initials and initialsArray, then deduplicate
  const combined = [...task.initials, ...initialsArray];
  const uniqueInitials = new Map();

  combined.forEach((item) => {
    uniqueInitials.set(item.id, item); // 'id' is the unique key
  });

  changes.initials = Array.from(uniqueInitials.values());
}

/**
 * Sets the subtasks for the changes object.
 * @param {Object} changes - The changes object.
 * @param {Object} task - The task object.
 * @param {Array} subtasks - The list of subtasks.
 * @param {HTMLElement} parentElement - The parent element of the task.
 * @param {string} taskId - The unique ID of the task.
 */
async function setSubtasks(changes, task, subtasks) {
  if (!Array.isArray(changes.subtask)) {
    changes.subtask = [];
  }
  if (!Array.isArray(task.subtask)) {
    task.subtask = [];
  }

  const addedSubtasks = new Set();

  task.subtask.forEach((sub) => {
    if (!addedSubtasks.has(sub.subtask)) {
      changes.subtask.push({
        subtask: sub.subtask,
        completed: sub.completed,
      });
      addedSubtasks.add(sub.subtask);
    }
  });

  subtasks.forEach((subtaskText) => {
    if (!addedSubtasks.has(subtaskText)) {
      changes.subtask.push({
        subtask: subtaskText,
        completed: false,
      });
      addedSubtasks.add(subtaskText);
    }
  });

  task.subtask.forEach((sub) => {
    if (!subtasks.includes(sub.subtask)) {
      changes.subtask = changes.subtask.filter(
        (change) => change.subtask !== sub.subtask
      );
    }
  });
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
async function templatemap(changes, task, title, description, duedate, id) {
  await setTitle(changes, task, title);
  await getid(changes, task, id);
  await setDescription(changes, task, description);
  await setDueDate(changes, task, duedate);
  await setpriority(changes, task, selectedPriority);
  await setCategory(changes, task);
  await setAssignedTo(changes, task, asignedtousers);
  await setInitials(changes, task, initialsArray);
  await setSubtasks(changes, task, subtasks);
}
