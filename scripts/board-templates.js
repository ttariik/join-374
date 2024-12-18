/**
 * Converts a contacts object or array into a valid array of contacts.
 * Filters out null or undefined values.
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
 * Colors are determined by the contact's associated color.
 * @param {Array} initials - The array of initials to display.
 * @param {Array} contactsArray - The array of valid contacts.
 * @returns {string} - The generated HTML string for initials.
 */
function getInitialsHTML(initials, contactsArray) {
  return (initials || [])
    .slice(0, 5)
    .map((initial) => {
      const contact = contactsArray.find(
        (c) => c.initials === initial.initials
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
  const taskPrio = task?.prio.png || "";

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
 * Generates the HTML template for a user story task.
 * @param {Object} task - The task object containing details to render.
 * @param {Object|Array} contacts - The contacts data for the task.
 * @returns {Promise<string>} - A promise resolving to the generated HTML string.
 */
async function userstorytemplate(task, contacts) {
  // Get all necessary details by calling the helper function
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
      <div class="task-detailss">
        <span>${taskCategory}</span>
        <div class="pointerbox"><button id="upbutton${
          task.id
        }" onclick="changefolder(${
    task.id
  },event)" class="buttonbackground1"><img src="/img/arrow_upsidedown.png" alt=""></button>
       <button id="downbutton${task.id}" onclick="changefolder(${
    task.id
  },event)" class="buttonbackground2"><img src="/img/arrow_drop_down.png" alt=""></button> </div>
      </div>
      <div class="titlecontainer">
        <div class="section-one">${taskTitle}</div>
        <div class="section-two">${taskDescription}</div>
      </div>
      ${progressBarHTML}
      <div class="asignbox">
        <div class="initialsbox" id="initialbox">
          ${initialsHTML}
          ${extraCircleHTML}
        </div>
        ${
          task.prio ? `<img src="/img/${task.prio}.png" alt="Priority">` : ""
        }      
    </div>
  `;
}

/**
 * Converts contacts object or array into a valid array of contacts.
 * Filters out null or undefined values.
 * @param {Object|Array} contacts - The contacts data, either an object or an array.
 * @returns {Array} - A filtered array of valid contacts.
 */
function getValidContactsArray(contacts) {
  return (Array.isArray(contacts) ? contacts : Object.values(contacts)).filter(
    (contact) => contact !== null && contact !== undefined
  );
}

/**
 * Generates HTML for displaying initials from an array of initials and contacts.
 * Limits the number of displayed initials to 5.
 * @param {Array} initialsArray - The array of initials to display.
 * @param {Array} contactsArray - The array of contacts used to find the color of each initial.
 * @returns {string} - The HTML string for the initials badges.
 */
function getInitialsHTML(initialsArray, contactsArray) {
  const displayedInitials = initialsArray.slice(0, 5);
  return displayedInitials
    .map((initialObj) => {
      const initial = initialObj.initials;
      const contact = contactsArray.find(
        (contact) => contact.initials === initial
      );
      const color = contact ? contact.color : "#ccc";
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");
}

/**
 * Generates HTML for displaying an extra circle if there are more than 5 initials.
 * @param {Array} initialsArray - The array of initials to evaluate.
 * @returns {string} - The HTML string for the extra initials badge.
 */
function getExtraCircleHTML(initialsArray) {
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;
  return remainingCount > 0
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
    : "";
}

/**
 * Generates HTML for a progress bar indicating the completion of subtasks.
 * @param {Array} subtasks - The array of subtasks with a "completed" property.
 * @param {Object} task - The task object to associate with the progress bar.
 * @returns {string} - The HTML string for the progress bar or an empty string if no subtasks.
 */
function getProgressBarHTML(subtasks, task) {
  if (!Array.isArray(subtasks)) return "";

  const totalSubtasks = subtasks.length;
  const completedTasks = subtasks.filter((subtask) => subtask.completed).length;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;

  return totalSubtasks > 0
    ? extraCircleHTMLtemplate(
        task,
        completionPercent,
        completedTasks,
        totalSubtasks
      )
    : "";
}

/**
 * Generates HTML for a progress bar with subtasks completion information.
 * @param {Object} task - The task object that contains the task's id.
 * @param {number} completionPercent - The percentage of completion of subtasks.
 * @param {number} completedTasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} - The HTML string for the progress bar.
 */
function extraCircleHTMLtemplate(
  task,
  completionPercent,
  completedTasks,
  totalSubtasks
) {
  return `<div class="outsidebox" id="progress${task.id}">
            <div class="progressbar">
              <div class="progressbar-inside" style="width:${completionPercent}%"></div>
            </div>
            <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
          </div>`;
}

/**
 * Converts contacts into an array and filters out null or undefined values.
 * @param {Object|Array} contacts - The contacts data, either an object or an array.
 * @returns {Array} - A filtered array of valid contacts.
 */
function getContactsArray(contacts) {
  if (
    contacts === null ||
    contacts === undefined ||
    typeof contacts !== "object"
  ) {
    return [];
  }
  return Array.isArray(contacts)
    ? contacts
    : Object.values(contacts).filter(
        (contact) => contact !== null && contact !== undefined
      );
}

/**
 * Generates HTML for displaying initials from an array of initials and contacts.
 * @param {Array} initials - The array of initials to display.
 * @param {Array} contactsArray - The array of contacts used to find the color of each initial.
 * @returns {string} - The HTML string for the initials badges.
 */
function getInitialsHTML(initials, contactsArray) {
  return (initials || [])
    .slice(0, 5)
    .map((initial) => {
      const contact = contactsArray.find(
        (c) => c.initials === initial.initials
      );
      return `<div class="badgestyle badge" style="background-color:${
        contact ? contact.color : "#ccc"
      }">${initial.initials}</div>`;
    })
    .join("");
}

/**
 * Generates HTML for displaying an extra circle if there are more than 5 initials.
 * @param {Array} initials - The array of initials to evaluate.
 * @returns {string} - The HTML string for the extra initials badge.
 */
function getExtraCircleHTML(initials) {
  return initials.length > 5
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${
        initials.length - 5
      }</div>`
    : "";
}

/**
 * Generates HTML for a progress bar indicating the completion of subtasks.
 * @param {Array} subtasks - The array of subtasks with a "completed" property.
 * @param {Object} task - The task object to associate with the progress bar.
 * @returns {string} - The HTML string for the progress bar or an empty string if no subtasks.
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
 * Generates the HTML template for a technical task with contacts and subtasks information.
 * @param {Object} task - The task object containing task-related details.
 * @param {Object|Array} contacts - The contacts data associated with the task.
 * @returns {Promise<string>} - A promise that resolves to the generated HTML string for the technical task.
 */
async function Technicaltasktemplate(task, contacts) {
  const contactsArray = getContactsArray(contacts);
  const initialsHTML = getInitialsHTML(task.initials || [], contactsArray);
  const extraCircleHTML = getExtraCircleHTML(task.initials || []);
  const progressBarHTML = getProgressBarHTML(task.subtask || [], task);

  return Technicaltasktemplatetemplate(
    task,
    contactsArray,
    initialsHTML,
    extraCircleHTML,
    progressBarHTML
  );
}

/**
 * Generates the HTML for a technical task with task details, progress bar, and status.
 * @param {Object} task - The task object containing task-related details.
 * @param {Array} contactsArray - The array of contacts related to the task.
 * @param {string} initialsHTML - The HTML string for displaying initials badges.
 * @param {string} extraCircleHTML - The HTML string for the extra initials badge.
 * @param {string} progressBarHTML - The HTML string for the progress bar.
 * @returns {string} - The generated HTML string for the task template.
 */
function Technicaltasktemplatetemplate(
  task,
  contactsArray,
  initialsHTML,
  extraCircleHTML,
  progressBarHTML
) {
  return /*html*/ `
    
   <div class="task-container task" draggable="true" ondragstart="drag(event)" id="${
     task.id
   }"> <div class="task-category">
          <span class="task-category-name">${task.category || ""}</span>
          <div class="pointerbox"><button id="upbutton${
            task.id
          }" type="button"  class="buttonbackground1"><img src="/img/arrow_upsidedown.png" alt=""></button>
       <button type="button" id="downbutton${
         task.id
       }"  class="buttonbackground2"><img src="/img/arrow_drop_down.png" alt=""></button> </div>
        </div>
        <div class="task-details">
          <div class="task-title">${task.title || ""}</div>
          <div class="task-description">${task.description || ""}</div>
        </div>
        ${progressBarHTML}
        <div class="task-statuss">
          <div class="initialsboxdesign">${initialsHTML}${extraCircleHTML}</div>
          ${
            task.prio
              ? `<img src="/img/${task.prio}.png" alt="Priority ${task.prio}">`
              : ""
          }        </div>
      </div>`;
}

/**
 * Generates HTML for displaying initials from an array of initials and contacts.
 * Limits the number of displayed initials to 5.
 * @param {Array} initialsArray - The array of initials to display.
 * @param {Array} contactsArray - The array of contacts used to find the color of each initial.
 * @returns {string} - The HTML string for the initials badges.
 */
function getInitialsHTML(initialsArray, contactsArray) {
  const displayedInitials = initialsArray.slice(0, 5); // Show only up to 5 initials
  return displayedInitials
    .map((initialObj) => {
      const initial =
        typeof initialObj === "object" && initialObj.initials
          ? initialObj.initials
          : initialObj;
      const contact = contactsArray.find(
        (contact) => contact && contact.initials === initial
      );
      const color = contact ? contact.color : "#ccc";
      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");
}

/**
 * Generates HTML for displaying an extra circle if there are more than 5 initials.
 * @param {Array} initialsArray - The array of initials to evaluate.
 * @returns {string} - The HTML string for the extra initials badge.
 */
function getExtraCircleHTML(initialsArray) {
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;
  return remainingCount > 0
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
    : "";
}

/**
 * Generates HTML for a progress bar indicating the completion of subtasks.
 * @param {Array} subtasks - The array of subtasks with a "completed" property.
 * @param {Object} task - The task object to associate with the progress bar.
 * @returns {string} - The HTML string for the progress bar or an empty string if no subtasks.
 */
function getProgressBarHTML(subtasks, task) {
  if (!Array.isArray(subtasks)) return "";
  const totalSubtasks = subtasks.length;
  const completedTasks = subtasks.filter((subtask) => subtask.completed).length;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;
  return totalSubtasks > 0
    ? getProgressBarHTMLtemplate(
        task,
        completionPercent,
        completedTasks,
        totalSubtasks
      )
    : "";
}

/**
 * Generates HTML for a progress bar with subtasks completion information.
 * @param {Object} task - The task object that contains the task's id.
 * @param {number} completionPercent - The percentage of completion of subtasks.
 * @param {number} completedTasks - The number of completed subtasks.
 * @param {number} totalSubtasks - The total number of subtasks.
 * @returns {string} - The HTML string for the progress bar.
 */
function getProgressBarHTMLtemplate(
  task,
  completionPercent,
  completedTasks,
  totalSubtasks
) {
  return `<div class="outsidebox" id="progress${task.id}">
            <div class="progressbar">
              <div class="progressbar-inside" style="width:${completionPercent}%"></div>
            </div>
            <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
          </div>`;
}

/**
 * Generates the HTML template for displaying subtasks of a task.
 * If there are more than 3 subtasks, adjusts the container class.
 * @param {Object} task - The task object containing subtasks.
 * @returns {Promise<string>} - A promise that resolves to the HTML string for subtasks.
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
        </div>
      `;
}

/**
 * Generates the HTML for a single subtask item.
 * @param {Object} subtaskItem - The subtask item object with subtask details.
 * @param {number} index - The index of the subtask.
 * @param {Object} task - The task object containing the subtask.
 * @returns {string} - The HTML string for the subtask item.
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
            </div>
      `;
}

/**
 * Generates the HTML for the assigned person badges based on task initials and contacts.
 * @param {Object} task - The task object containing the task's initials.
 * @param {Array} contacts - The array of contacts for generating badges.
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
 * Extracts the initials array from the task object.
 * @param {Object} task - The task object containing the initials.
 * @returns {Array} - The array of initials associated with the task.
 */
function getInitialsArray(task) {
  return Array.isArray(task.initials) ? task.initials : [];
}

/**
 * Filters the contacts array to exclude null or undefined values.
 * @param {Array|Object} contacts - The contacts data, either an array or an object.
 * @returns {Array} - The filtered array of contacts.
 */
function getFilteredContactsArray(contacts) {
  return (Array.isArray(contacts) ? contacts : Object.values(contacts)).filter(
    (contact) => contact !== null && contact !== undefined
  );
}

/**
 * Generates HTML for displaying badges of contacts associated with the task.
 * @param {Array} contactsArray - The array of contacts to generate badges for.
 * @param {Array} initialsArray - The array of initials to be displayed on badges.
 * @param {Set} displayedInitials - A set to keep track of displayed initials.
 * @returns {string} - The HTML string for the contact badges.
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
 * Adds a contact badge for a specific contact based on the initials and prevents duplicates.
 * @param {Object} contact - The contact object containing contact information.
 * @param {Array} initialsArray - The array of initials to match with the contact.
 * @param {Set} displayedInitials - A set to track which initials have already been displayed.
 * @param {string} badgeHTML - The HTML string to append the badge HTML to.
 * @returns {string} - The updated badge HTML string.
 */
function addContactBadge(contact, initialsArray, displayedInitials, badgeHTML) {
  const matchingInitials = initialsArray.find(
    (initialObj) => initialObj.initials === contact.initials
  );
  if (matchingInitials && !displayedInitials.has(matchingInitials.initials)) {
    badgeHTML += createBadgeHTML(matchingInitials, contact);
    displayedInitials.add(matchingInitials.initials);
  }
  return badgeHTML;
}

/**
 * Creates the HTML for a badge to display contact initials and name.
 * @param {Object} matchingInitials - The object containing initials and name.
 * @param {Object} contact - The contact object containing the contact's color.
 * @returns {string} - The HTML string for the contact badge.
 */
function createBadgeHTML(matchingInitials, contact) {
  const initials = matchingInitials.initials;
  const name = matchingInitials.name || "Unknown";
  const contactColor = contact.color || "#000";

  return `
    <div id="assignedusers">
      <div class="badge alignment" style="background-color:${contactColor}">
        ${initials}
      </div>
      <span class="badge-name">${name}</span>
    </div>
  `;
}

/**
 * Generates HTML for a subtask input box.
 * @param {string} subtaskinput1 - The initial input value for the subtask.
 * @returns {string} - The HTML string for the subtask input box.
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
    </div>
  `;
}

/**
 * Generates the HTML for a save button in the contact form.
 * @param {Object} task - The task object, though it is not used in this function.
 * @returns {string} - The HTML string for the save button.
 */
function buttontemplate(task) {
  return /*html*/ `
    <button id="oksavebutton" class="savecontact" type="button" ><span>OK</span><div> <img src="/img/checkwhite.png" alt="" /></div> </button>
  `;
}

/**
 * Resets the content of an overlay element by including a new HTML template.
 * @param {string} elementId - The ID of the element to reset.
 * @param {string} templatePath - The path to the template to be included.
 */
async function resetOverlayTemplate(elementId, templatePath) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute("w3-include-html", templatePath);
    includeHTML();
  }
}

/**
 * Generates the HTML for the subtask container with an input field to add new subtasks.
 * @returns {string} - The HTML string for the subtask container.
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
      ${subtaskboxemplate1()} <!-- Correct way to embed the result of subtaskboxemplate1 -->
    </div>
  `;
}

/**
 * Generates additional HTML for the subtask input buttons, including save, cancel, and edit buttons.
 * @returns {string} - The HTML string for the additional subtask buttons.
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
    <div id="spanplace1"></div>
  `;
}
