/**
 * Saves changes made to the task by sending an update request to the server.
 * @param {Object} task - The task object containing all task details.
 */
async function savechanges(taskId, task) {
  const parentElement = getParentElementId(taskId);
  const { title, description, duedate } = extractCurrentValues();
  const changes = prepareChanges(task, title, description, duedate);
  const contacts = await fetchContacts();
  await updateTask(parentElement, task.id, changes);
  await finalizeChanges(task, contacts, changes);
}

function getParentElementId(taskId) {
  return document.getElementById(`${taskId}`).parentElement;
}

function extractCurrentValues() {
  const title = document.querySelector(".titleinputdesign").value;
  const description =
    document.querySelector(".description")?.children[1]?.value ||
    document.getElementById("descriptioninput")?.children[1]?.value;
  const duedate = document.getElementById("date1").value;
  return { title, description, duedate };
}

function prepareChanges(task, title, description, duedate) {
  const changes = {};
  templatemap(changes, task, title, description, duedate);
  return changes;
}

async function fetchContacts() {
  const response = await fetch(GLOBAL + "users/1/contacts.json");
  return response.json();
}

async function updateTask(parentElement, taskId, changes) {
  await putData(`/users/1/tasks/${parentElement.id}/${taskId}`, changes);
}

async function finalizeChanges(task, contacts, changes) {
  await loadtasks();
  updateOverlayTemplateBasedOnCategory(task, contacts, changes);
  subtasks = [];
}

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

function updateOverlayTemplateBasedOnCategory(task, contacts, changes) {
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

function setTitle(changes, task, title) {
  changes.title = title || task.title;
}

function setDescription(changes, task, description) {
  changes.description = description === "" ? task.description : description;
}

function setDueDate(changes, task, duedate) {
  changes.duedate = duedate === "" ? task.duedate : duedate;
}

function setPriority(changes, task, selectedPriority) {
  changes.prio = selectedPriority === null ? task.prio : selectedPriority;
}

function setCategory(changes, task) {
  changes.category = task.category;
}

function setAssignedTo(changes, task, asignedtousers) {
  changes.asignedto =
    asignedtousers.length === 0 ? task.asignedto : asignedtousers;
}

function setInitials(changes, task, initialsArray) {
  changes.initials = initialsArray.length === 0 ? task.initials : initialsArray;
}

function setSubtasks(changes, task, subtasks, parentElement, taskId) {
  // If the task does not have subtasks, initialize it with an empty object (if no subtasks are provided)
  if (task.subtask === null || task.subtask === undefined) {
    changes.subtask = {}; // Initialize it as an empty object
  }

  // If there are subtasks, map through the subtasks and add them to changes.subtask
  if (subtasks.length > 0) {
    changes.subtask = subtasks.map((subtask) => ({
      subtask,
      completed: false,
    }));
  } else {
    // If no subtasks are provided, keep the existing subtasks or an empty object
    changes.subtask = task.subtask || {};
  }
}

function templatemap(changes, task, title, description, duedate) {
  setTitle(changes, task, title);
  setDescription(changes, task, description);
  setDueDate(changes, task, duedate);
  setPriority(changes, task, selectedPriority);
  setCategory(changes, task);
  setAssignedTo(changes, task, asignedtousers);
  setInitials(changes, task, initialsArray);
  setSubtasks(changes, task, subtasks);
}
