/**
 * Converts a contacts object or array into a valid array of contacts.
 * @param {Object|Array} contacts - The contacts data, either as an object or array.
 * @returns {Array} - A filtered array of valid contacts.
 */
function getValidContactsArray(contacts) {
  return Array.isArray(contacts)
    ? contacts
    : Object.values(contacts).filter(
        (contact) => contact !== null && contact !== undefined
      );
}

/**
 * Generates HTML for contact initials, limited to 5.
 * @param {Array} initials - The array of initials to display.
 * @param {Array} contactsArray - The array of valid contacts.
 * @returns {string} - The generated HTML string for initials.
 */
function getInitialsHTML(initials, contactsArray) {
  return (initials || [])
    .slice(0, 5)
    .map((initial) => {
      const contact = contactsArray.find(
        (c) => c?.initials === initial?.initials
      );
      return `<div class="badgestyle badge" style="background-color:${
        contact ? contact.color : "#ccc"
      }">${initial.initials}</div>`;
    })
    .join("");
}

/**
 * Generates HTML for the extra circle indicating additional initials.
 * @param {Array} initials - The array of initials to evaluate.
 * @returns {string} - The generated HTML for the extra initials badge.
 */
function getExtraCircleHTML(initials) {
  return initials.length > 5
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${
        initials.length - 5
      }</div>`
    : "";
}

/**
 * Creates the HTML for a progress bar displaying subtask completion status.
 * @param {Array} subtasks - The array of subtasks, each with a "completed" property.
 * @param {Object} task - The task object containing subtask details.
 * @returns {string} - The generated HTML for the progress bar.
 */
function getProgressBarHTML(subtasks, task) {
  if (!subtasks) return "";
  const completedTasks = subtasks.filter((sub) => sub.completed).length;
  const totalSubtasks = subtasks.length;
  const completionPercent = totalSubtasks
    ? (completedTasks / totalSubtasks) * 100
    : 0;
  return `<div class="outsidebox"><div class="progressbar"><div class="progressbar-inside" style="width:${completionPercent}%"></div></div><div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div></div>`;
}

/**
 * Generates and organizes the necessary task details for rendering.
 * @param {Object} task - The task object with task-related details.
 * @param {Object|Array} contacts - The contacts data associated with the task.
 * @returns {Object} - An object containing all task details as HTML or processed values.
 */
function generateTaskDetails(task, contacts) {
  const contactsArray = Array.isArray(contacts)
    ? getValidContactsArray(contacts)
    : [];
  const taskCategory = task?.category || "Uncategorized";
  const taskTitle = task?.title || "Untitled Task";
  const taskDescription = task?.description || "";
  const taskPrio = task?.prio?.png || "";
  const initialsHTML =
    contactsArray.length > 0
      ? getInitialsHTML(task?.initials || [], contactsArray)
      : "";
  const extraCircleHTML =
    contactsArray.length > 0 ? getExtraCircleHTML(task?.initials || []) : "";
  const progressBarHTML = getProgressBarHTML(task?.subtask || [], task);
  return {
    contactsArray,
    taskCategory,
    taskTitle,
    taskDescription,
    taskPrio,
    initialsHTML,
    extraCircleHTML,
    progressBarHTML,
  };
}

/**
 * Generates the HTML for the task header.
 * @param {string} taskCategory - The category of the task.
 * @param {Object} task - The task object.
 * @param {boolean} [isTechnicalTask=false] - Flag indicating if the task is a technical task.
 * @returns {string} - The generated HTML for the task header.
 */
function getTaskHeaderHTML(taskCategory, task, isTechnicalTask = false) {
  const categoryClass = isTechnicalTask ? "task-category-name" : "";
  const containerClass = isTechnicalTask ? "task-category" : "task-detailss";
  return `
    <div class="${containerClass}">
      <span class="${categoryClass}">${taskCategory}</span>
      <div class="pointerbox" style="pointer-events: auto;">
        <button id="upbutton${task.id}" class="buttonbackground1">
          <img src="/img/arrow_upsidedown.png" alt="">
        </button>
        <button id="downbutton${task.id}" class="buttonbackground2">
          <img src="/img/arrow_drop_down.png" alt="">
        </button>
      </div>
    </div>`;
}

/**
 * Generates the HTML for the task body.
 * @param {string} taskTitle - The title of the task.
 * @param {string} taskDescription - The description of the task.
 * @returns {string} - The generated HTML for the task body.
 */
function getTaskBodyHTML(taskTitle, taskDescription) {
  return `
    <div class="titlecontainer">
      <div class="section-one">${taskTitle}</div>
      <div class="section-two">${taskDescription}</div>
    </div>`;
}

/**
 * Generates the HTML for the task footer.
 * @param {string} initialsHTML - The HTML for the initials.
 * @param {string} extraCircleHTML - The HTML for the extra circle.
 * @param {string} taskPrio - The priority of the task.
 * @returns {string} - The generated HTML for the task footer.
 */
function getTaskFooterHTML(initialsHTML, extraCircleHTML, taskPrio) {
  return `
    <div class="asignbox">
      <div class="initialsbox" id="initialbox">
        ${initialsHTML}
        ${extraCircleHTML}
      </div>
      ${taskPrio ? `<img src="/img/${taskPrio}.png" alt="Priority">` : ""}
    </div>`;
}

/**
 * Generates the HTML template for a user story task.
 * @param {Object} task - The task object containing details to render.
 * @param {Object|Array} contacts - The contacts data for the task.
 * @returns {Promise<string>} - A promise resolving to the generated HTML string.
 */
async function userstorytemplate(task, contacts) {
  const {
    taskCategory,
    taskTitle,
    taskDescription,
    taskPrio,
    initialsHTML,
    extraCircleHTML,
    progressBarHTML,
  } = generateTaskDetails(task, contacts);

  return /*html*/ `
    <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${
      task?.id || ""
    }">
      ${getTaskHeaderHTML(taskCategory, task)}
      ${getTaskBodyHTML(taskTitle, taskDescription)}
      ${progressBarHTML}
      ${getTaskFooterHTML(initialsHTML, extraCircleHTML, taskPrio)}
    </div>`;
}

/**
 * Generates the HTML template for displaying subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @returns {Promise<string>} - A promise resolving to the generated HTML string for subtasks.
 */
async function showsubtaskstemplate(task) {
  if (!Array.isArray(task.subtask) || task.subtask.length === 0) return "";

  const subtasksHTML = task.subtask
    .map((subtaskItem, index) =>
      subtaskdesigntemplate(subtaskItem, index, task)
    )
    .join("");

  const containerclass = task.subtask.length > 3 ? "subtasks-container3" : "";

  return /*html*/ `
        <div class="${containerclass}">
          ${subtasksHTML}
        </div>`;
}

/**
 * Generates the HTML for a single subtask.
 * @param {Object} subtaskItem - The subtask item object.
 * @param {number} index - The index of the subtask.
 * @param {Object} task - The task object containing the subtask.
 * @returns {string} - The generated HTML for the subtask.
 */
function subtaskdesigntemplate(subtaskItem, index, task) {
  return /*html*/ `
          <div class="designlayout">
              <label class="custom-checkbox" onclick="changestatus(${
                task.id
              },${index},${subtaskItem.completed},event)">
                <input type="checkbox" id="${task.id}-${index}" ${
    subtaskItem.completed ? "checked" : ""
  } class="checkboxdesign" />
                <span class="checkmark"></span>
              </label>
              <span class="subtask-title">${
                subtaskItem.subtask || "Unnamed Subtask"
              }</span>
            </div>`;
}

/**
 * Generates the HTML template for displaying assigned contacts.
 * @param {Object} task - The task object containing assigned contacts.
 * @param {Object|Array} contacts - The contacts data for the task.
 * @returns {Promise<void>} - A promise that resolves when the HTML is generated and set.
 */
async function assignedtotemplate(task, contacts) {
  const initialsArray = getInitialsArray(task);
  const contactsArray = getFilteredContactsArray(contacts);
  const profileAssignedArea = document.getElementById("showassignedperson");
  const badgeHTML = generateBadgeHTML(
    contactsArray,
    initialsArray || [],
    new Set()
  );
  if (profileAssignedArea) {
    profileAssignedArea.innerHTML = badgeHTML;
  }
}

/**
 * Retrieves the initials array from the task.
 * @param {Object} task - The task object containing initials.
 * @returns {Array} - The array of initials.
 */
function getInitialsArray(task) {
  return Array.isArray(task?.initials) ? task.initials : [];
}

/**
 * Filters out invalid contacts from the contacts array.
 * @param {Object|Array} contacts - The contacts data, either as an object or array.
 * @returns {Array} - A filtered array of valid contacts.
 */
function getFilteredContactsArray(contacts) {
  return (Array.isArray(contacts) ? contacts : Object.values(contacts)).filter(
    (contact) => contact !== null && contact !== undefined
  );
}

/**
 * Generates the HTML for the badges of assigned contacts.
 * @param {Array} contactsArray - The array of valid contacts.
 * @param {Array} initialsArray - The array of initials to display.
 * @param {Set} displayedInitials - A set of displayed initials to avoid duplicates.
 * @returns {string} - The generated HTML for the badges.
 */
function generateBadgeHTML(contactsArray, initialsArray, displayedInitials) {
  let badgeHTML = "";
  contactsArray.forEach((contact) => {
    badgeHTML = addContactBadge(
      contact,
      initialsArray,
      displayedInitials,
      badgeHTML
    );
  });
  return badgeHTML;
}

/**
 * Adds a contact badge to the HTML.
 * @param {Object} contact - The contact object.
 * @param {Array} initialsArray - The array of initials to display.
 * @param {Set} displayedInitials - A set of displayed initials to avoid duplicates.
 * @param {string} badgeHTML - The current HTML string for badges.
 * @returns {string} - The updated HTML string with the new badge.
 */
function addContactBadge(contact, initialsArray, displayedInitials, badgeHTML) {
  const matchingInitials = initialsArray.find(
    (initialObj) => initialObj?.initials === contact?.initials
  );
  if (matchingInitials && !displayedInitials.has(matchingInitials.initials)) {
    badgeHTML += createBadgeHTML(matchingInitials, contact);
    displayedInitials.add(matchingInitials.initials);
  }
  return badgeHTML;
}

/**
 * Creates the HTML for a contact badge.
 * @param {Object} matchingInitials - The initials object matching the contact.
 * @param {Object} contact - The contact object.
 * @returns {string} - The generated HTML for the contact badge.
 */
function createBadgeHTML(matchingInitials, contact) {
  const initials = matchingInitials?.initials || "";
  const name = matchingInitials?.name || "Unknown";
  const contactColor = contact?.color || "#000";

  return `
    <div id="assignedusers">
      <div class="badge alignment" style="background-color:${contactColor}">
        ${initials}
      </div>
      <span class="badge-name">${name}</span>
    </div>`;
}

/**
 * Generates the HTML template for a subtask.
 * @param {string} subtaskinput1 - The input for the subtask.
 * @returns {string} - The generated HTML for the subtask.
 */
function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
    <div class="subbox1 subs${subtasks.length}" id="subboxinput_${subtasks.length}"  data-index="${subtasks.length}" >
      <div class="subbox_11">
      <div id="dot">•</div>
      <div id="sub${subtasks.length}" onclick="editsubtask(${subtasks.length})">${subtaskinput1}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${subtasks.length}" onclick="editsubtask(${subtasks.length})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${subtasks.length}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${subtasks.length}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
    </div>`;
}

/**
 * Generates the HTML template for a button.
 * @param {Object} task - The task object.
 * @returns {string} - The generated HTML for the button.
 */
function buttontemplate(task) {
  return /*html*/ `
    <button id="oksavebutton" class="savecontact" type="button" ><span>OK</span><div> <img src="/img/checkwhite.png" alt="" /></div> </button>`;
}

/**
 * Resets the overlay template by including HTML from a specified path.
 * @param {string} elementId - The ID of the element to reset.
 * @param {string} templatePath - The path to the HTML template.
 * @returns {Promise<void>} - A promise that resolves when the template is reset.
 */
async function resetOverlayTemplate(elementId, templatePath) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute("w3-include-html", templatePath);
    includeHTML();
  }
}

/**
 * Generates the HTML template for a subtask input box.
 * @returns {string} - The generated HTML for the subtask input box.
 */
function subtaskboxemplate() {
  return /*html*/ `
    <div class="subtaskcontainer">
      <input
        onclick="subtaskchangeicons()"
        type="text"
        id="subtaskinput0"
        placeholder="Add New Subtask"
        class="inputsubtask"
      />
      <button
        type="button"
        onclick="subtaskchangeicons()"
        class="subtaskbutton"
        id="inputsubtask11"
      >
        <img src="/img/plusblack.png" alt="" />
      </button>
      ${subtaskboxemplate1()} 
    </div>`;
}

/**
 * Generates the HTML template for additional subtask input box elements.
 * @returns {string} - The generated HTML for additional subtask input box elements.
 */
function subtaskboxemplate1() {
  return /*html*/ `
    <button
      class="subtaskbutton2 d-none"
      onclick="resetsubtaskinput()"
      type="button"
      id="inputsubtask22"
    >
      <img src="/img/vector.png" alt="" />
    </button>
    <div class="seperateline d-none" id="seperate1"></div>
    <button
      type="button"
      onclick="addsubtask(event)"
      class="subtaskbutton3 d-none"
      id="inputsubtask33"
    >
      <img src="/img/checkmark.png" alt="" />
    </button>
    <span class="spansubtaskdesign" id="spansubtask1"></span>
    <div id="subtasksbox11" class="subtasksbox1"></div>
    <div id="spanplace1"></div>`;
}

/**
 * Generates the HTML template for a technical task.
 * @param {Object} task - The task object containing details to render.
 * @param {Object|Array} contacts - The contacts data for the task.
 * @returns {Promise<string>} - A promise resolving to the generated HTML string.
 */
async function Technicaltasktemplate(task, contacts) {
  const {
    taskCategory,
    taskTitle,
    taskDescription,
    taskPrio,
    initialsHTML,
    extraCircleHTML,
    progressBarHTML,
  } = generateTaskDetails(task, contacts);

  return /*html*/ `
    <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${
      task?.id || ""
    }">
      ${getTaskHeaderHTML(taskCategory, task, true)}
      ${getTaskBodyHTML(taskTitle, taskDescription)}
      ${progressBarHTML}
      ${getTaskFooterHTML(initialsHTML, extraCircleHTML, taskPrio)}
    </div>`;
}
