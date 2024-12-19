/**
 * Loads the task information for a technical task (part 1), including task title, due date, and priority buttons.
 * Sets listeners for priority buttons and loads assigned users and subtasks.
 * @param {Object} task - The task object containing task details.
 */
function loadinfosifpart1(task) {
  document.getElementById("technicaltasktitle").children[1].value = task.title;
  document.getElementById("date23").value = task.duedate;
  document.getElementById("button11").style.maxWidth = "136px";
  document.getElementById("button22").style.maxWidth = "136px";
  document.getElementById("button33").style.maxWidth = "136px";
  document.getElementById("button11").style.height = "56px";
  document.getElementById("button22").style.height = "56px";
  document.getElementById("button33").style.height = "56px";
  setButton11Listener(task);
  showsavedinitials(task.id, task);
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}

/**
 * Sets the event listener for the "Urgent" priority button (button 11) to trigger the selectbutton_11 function.
 * @param {Object} task - The task object containing task details.
 */
function setButton11Listener(task) {
  document.getElementById("button11").addEventListener("click", function () {
    selectbutton_11(task);
  });
}

/**
 * Sets the event listener for the "Medium" priority button (button 22) to trigger the selectbutton_22 function.
 * @param {Object} task - The task object containing task details.
 */
function setButton22Listener(task) {
  document.getElementById("button22").addEventListener("click", function () {
    selectbutton_22(task);
  });
}

/**
 * Sets the event listener for the "Low" priority button (button 33) to trigger the selectbutton_33 function.
 * @param {Object} task - The task object containing task details.
 */
function setButton33Listener(task) {
  document.getElementById("button33").addEventListener("click", function () {
    selectbutton_33(task);
  });
}

/**
 * Sets the event listener for the "Urgent" priority button (button 1-1) to trigger the selectbutton_11 function for non-technical tasks.
 * @param {Object} task - The task object containing task details.
 */
function setButton1_1Listener(task) {
  document.getElementById("button1-1").addEventListener("click", function () {
    selectbutton_11(task);
  });
}

/**
 * Sets the event listener for the "Medium" priority button (button 2-2) to trigger the selectbutton_22 function for non-technical tasks.
 * @param {Object} task - The task object containing task details.
 */
function setButton2_2Listener(task) {
  document.getElementById("button2-2").addEventListener("click", function () {
    selectbutton_22(task);
  });
}

/**
 * Sets the event listener for the "Low" priority button (button 3-3) to trigger the selectbutton_33 function for non-technical tasks.
 * @param {Object} task - The task object containing task details.
 */
function setButton3_3Listener(task) {
  document.getElementById("button3-3").addEventListener("click", function () {
    selectbutton_33(task);
  });
}

/**
 * Loads task information, including priority button listeners, assigned users, and subtasks.
 * Based on the task category (Technical Task or Non-Technical Task), it loads different sets of information.
 * @param {Object} task - The task object containing task details.
 */
async function loadinfos(task) {
  if (!task || typeof task !== "object") {
    return;
  }
  const assignedUsersElement = document.getElementById("assignedusers1");
  if (assignedUsersElement) {
    assignedUsersElement.innerHTML = "";
  }
  if (!task.category) {
    return;
  }
  if (task.category === "Technical Task") {
    assignedtousers = [];
    initialsArray = [];
    subtasks = [];
    await loadtechnicaltask(task);
  } else {
    assignedtousers = [];
    initialsArray = [];
    subtasks = [];
    await loaduserstory(task);
  }
}

async function loaduserstory(task) {
  setButton1_1Listener(task);
  setButton2_2Listener(task);
  setButton3_3Listener(task);
  setNonTechnicalTaskValues(task);
  showsavedinitials(task.id, task);
  loadsubtasks(task); 
  setPriorityButtonListeners(task);
}

async function loadtechnicaltask(task) {
  loadinfosifpart1(task);
  await loadsubtasks(task);
  setButton22Listener(task);
  setButton33Listener(task);
  setPriorityForTechnicalTask(task);
}

/**
 * Sets the selected priority for a technical task based on its priority value.
 * @param {Object} task - The task object containing its priority.
 */
function setPriorityForTechnicalTask(task) {
  if (task.prio === "Urgent") {
    selectbutton_11(task);
  } else if (task.prio === "Medium") {
    selectbutton_22(task);
  } else if (task.prio === "Low") {
    selectbutton_33(task);
  }
}

/**
 * Sets the task values for non-technical tasks, including title, due date, priority buttons, and description.
 * @param {Object} task - The task object containing task details.
 */
function setNonTechnicalTaskValues(task) {
  document.querySelector(".titleinputdesign").value = task.title;
  document.getElementById("date23").value = task.duedate;
  document.getElementById("button1-1").style.maxWidth = "136px";
  document.getElementById("button2-2").style.maxWidth = "136px";
  document.getElementById("button3-3").style.maxWidth = "136px";
  document.getElementById("button1-1").style.height = "56px";
  document.getElementById("button2-2").style.height = "56px";
  document.getElementById("button3-3").style.height = "56px";
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}

/**
 * Sets priority button listeners for non-technical tasks based on the task's priority value.
 * @param {Object} task - The task object containing task details.
 */
function setPriorityButtonListeners(task) {
  if (task.prio === "Urgent") {
    selectbutton_11(task);
  } else if (task.prio === "Medium") {
    selectbutton_22(task);
  } else if (task.prio === "Low") {
    selectbutton_33(task);
  }
}

/**
 * Displays the saved initials for assigned users on the task.
 * Fetches the contacts and displays them as badges.
 * @param {string} id - The task ID.
 * @param {Object} task - The task object containing assigned users.
 */
async function showsavedinitials(id, task) {
  document.getElementById("assignedusers1").innerHTML = "";
  const { entries, contactMap } = await fetchsavedinitials();
  if (task.asignedto === undefined) {
    return;
  }
  for (let index = 0; index < task.asignedto.length; index++) {
    const assignedInitial = task.asignedto[index];
    const selectedContact = contactMap.get(assignedInitial);
    asignedtousers.push(assignedInitial);
    if (selectedContact) {
      forasignedto(selectedContact, index);
    }
  }
}

/**
 * Fetches saved initials from a remote source and maps them to contacts.
 * @returns {Promise<Object>} - The entries and contact map.
 */
async function fetchsavedinitials() {
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  const responsestoJson = await response.json();
  const entries = Object.entries(responsestoJson).map(([firebaseId, contact]) =>
    contact && contact.name
      ? {
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
          color: contact.color,
          email: contact.email,
          telefone: contact.telefone,
        }
      : null
  );
  const contactMap = new Map(
    entries
      .filter((contact) => contact)
      .map((contact) => [contact.initials, contact])
  );
  return { entries, contactMap };
}

/**
 * Creates a badge for a contact assigned to the task and displays it in the UI.
 * @param {Object} selectedContact - The contact object containing user details.
 * @param {number} index - The index of the contact in the assigned users list.
 */
function forasignedto(selectedContact, index) {
  document.getElementById("assignedusers1").style.width = "100%";
  const badge = document.createElement("div");
  badge.className = "badgeassigned badge";
  badge.style.width = "32px";
  badge.style.height = "32px";
  badge.id = `${selectedContact.id}_${index}`;
  badge.style.backgroundColor = selectedContact.color;
  badge.textContent = selectedContact.initials;
  badge.setAttribute("data-initials", selectedContact.initials);
  if (!document.getElementById(badge.id)) {
    document.getElementById("assignedusers1").appendChild(badge);
    badge.style.marginLeft = "0";
  }
  initialsArray.push({
    id: selectedContact.id,
    initials: selectedContact.initials,
    name: selectedContact.name,
  });
}

/**
 * Resets the profile template and includes the HTML content based on the task type.
 */
async function firstcondition() {
  closeoverlayprofiletemplate();
  const response2 = await fetch(GLOBAL + "users/1/contacts.json");
  const contacts = await response2.json();
  const profiletemplate = document.getElementById("overlayprofile-template");
  profiletemplate.innerHTML = "";
  profiletemplate.setAttribute("w3-include-html", "profile-template.html");
  includeHTML();
  w3.includeHTML();
}

/**
 * Resets the task template based on the task type (User Story or Technical Task).
 * @param {Object} task - The task object containing task details.
 */
async function resettemplate(task) {
  asignedtousers = [];
  initialsArray = [];
  subtasks = [];
  if (task.category === "User Story") {
    firstcondition();
  } else {
    closeoverlayprofiletemplate();
    const response2 = await fetch(GLOBAL + "users/1/contacts.json");
    const contacts = await response2.json();
    const profiletemplate = document.getElementById(
      "overlaytechinical-task-template"
    );
    profiletemplate.innerHTML = "";
    profiletemplate.setAttribute(
      "w3-include-html",
      "techinical-task-template.html"
    );
    includeHTML();
    w3.includeHTML();
  }
}
