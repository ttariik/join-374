/**
 * Saves changes made to the task by sending an update request to the server.
 * @param {Object} task - The task object containing all task details.
 */
async function savechanges(task) {
  const parentElement = document.getElementById(`${task.id}`).parentElement.id;
  // Extract current values from the UI
  const title = document.querySelector(".titleinputdesign").value;
  const description =
    document.querySelector(".description")?.children[1]?.value ||
    document.getElementById("descriptioninput")?.children[1]?.value;
  const duedate = document.getElementById("date1").value;
  // Create an object to store only the changed fields
  const changes = {};
  // Check for changes and add to the changes object
  templatemap(changes, task, title, description, duedate);
  const response2 = await fetch(GLOBAL + "users/1/contacts.json");
  const contacts = await response2.json();
  // Include the category (if it must be sent unchanged)
  await putData(`/users/1/tasks/${parentElement}/${task.id}`, changes);
  // Reload the tasks and close the overlay
  await loadtasks();
  updateOverlayTemplateBasedOnCategory(task, contacts, changes);
}

function updateOverlayTemplateBasedOnCategory(task, contacts, changes) {
  const templateId =
    task.category === "User Story"
      ? "overlayprofile-template"
      : "overlaytechinical-task-template";

  const templateFile =
    task.category === "User Story"
      ? "profile-template.html"
      : "techinical-task-template.html";

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

function setSubtasks(changes, task, subtasks) {
  changes.subtask =
    subtasks.length === 0
      ? task.subtask
      : subtasks.map((subtask) => ({ subtask, completed: false }));
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
