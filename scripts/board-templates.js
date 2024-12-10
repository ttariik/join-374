// Main function for generating the user story template
// Logic functions
function getValidContactsArray(contacts) {
  return Array.isArray(contacts)
    ? contacts
    : Object.values(contacts).filter(
        (contact) => contact !== null && contact !== undefined
      );
}

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

function getExtraCircleHTML(initials) {
  return initials.length > 5
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${
        initials.length - 5
      }</div>`
    : "";
}

function getProgressBarHTML(subtasks, task) {
  if (!subtasks) return "";
  const completedTasks = subtasks.filter((sub) => sub.completed).length;
  const totalSubtasks = subtasks.length;
  const completionPercent = totalSubtasks
    ? (completedTasks / totalSubtasks) * 100
    : 0;
  return `<div class="outsidebox"><div class="progressbar"><div class="progressbar-inside" style="width:${completionPercent}%"></div></div><div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div></div>`;
}

// Template function
async function userstorytemplate(task, contacts) {
  const contactsArray = getValidContactsArray(contacts);
  const initialsHTML = getInitialsHTML(task.initials || [], contactsArray);
  const extraCircleHTML = getExtraCircleHTML(task.initials || []);
  const progressBarHTML = getProgressBarHTML(task.subtask || [], task);

  return /*html*/ `
        <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${
          task.id
        }">
          <div class="task-detailss">
            <span>${task.category || "Uncategorized"}</span>
          </div>
          <div class="titlecontainer">
            <div class="section-one">${task.title || "Untitled Task"}</div>
            <div class="section-two">${task.description || ""}</div>
          </div>
          ${progressBarHTML}
          <div class="asignbox">
            <div class="initialsbox" id="initialbox">
              ${initialsHTML}
              ${extraCircleHTML}
            </div>
            <img src="/img/${task.prio || ""}.png" alt="">
          </div>
        </div>
      `;
}

// Helper function to get an array of valid contacts
function getValidContactsArray(contacts) {
  return (Array.isArray(contacts) ? contacts : Object.values(contacts)).filter(
    (contact) => contact !== null && contact !== undefined
  );
}

// Helper function to generate initials HTML
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

// Helper function to generate extra circle HTML if more than 5 initials
function getExtraCircleHTML(initialsArray) {
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;
  return remainingCount > 0
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
    : "";
}

// Helper function to generate progress bar HTML
function getProgressBarHTML(subtasks, task) {
  if (!Array.isArray(subtasks)) return "";

  const totalSubtasks = subtasks.length;
  const completedTasks = subtasks.filter((subtask) => subtask.completed).length;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;

  return totalSubtasks > 0
    ? `<div class="outsidebox" id="progress${task.id}">
            <div class="progressbar">
              <div class="progressbar-inside" style="width:${completionPercent}%"></div>
            </div>
            <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
          </div>`
    : ""; // Empty string if no subtasks
}

// Main function for generating the technical task template
// Logic functions
function getContactsArray(contacts) {
  return Array.isArray(contacts)
    ? contacts
    : Object.values(contacts).filter(
        (contact) => contact !== null && contact !== undefined
      );
}

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

function getExtraCircleHTML(initials) {
  return initials.length > 5
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${
        initials.length - 5
      }</div>`
    : "";
}

function getProgressBarHTML(subtasks, task) {
  if (!subtasks) return "";
  const completedTasks = subtasks.filter((sub) => sub.completed).length;
  const totalSubtasks = subtasks.length;
  const completionPercent = totalSubtasks
    ? (completedTasks / totalSubtasks) * 100
    : 0;
  return `<div class="outsidebox"><div class="progressbar"><div class="progressbar-inside" style="width:${completionPercent}%"></div></div><div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div></div>`;
}

// Template function
async function Technicaltasktemplate(task, contacts) {
  const contactsArray = getContactsArray(contacts);
  const initialsHTML = getInitialsHTML(task.initials || [], contactsArray);
  const extraCircleHTML = getExtraCircleHTML(task.initials || []);
  const progressBarHTML = getProgressBarHTML(task.subtask || [], task);

  return /*html*/ `
      <div class="task-container task" draggable="true" ondragstart="drag(event)" id="${
        task.id
      }">
        <div class="task-category">
          <span class="task-category-name">${
            task.category || "Uncategorized"
          }</span>
        </div>
        <div class="task-details">
          <div class="task-title">${task.title || "Untitled Task"}</div>
          <div class="task-description">${task.description || ""}</div>
        </div>
        ${progressBarHTML}
        <div class="task-statuss">
          <div class="initialsboxdesign">${initialsHTML}${extraCircleHTML}</div>
          <img src="/img/${task.prio || ""}.png" alt="">
        </div>
      </div>`;
}

// Get the HTML for initials badges (first 5 initials)
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

// Get the HTML for the extra badge showing how many initials are left
function getExtraCircleHTML(initialsArray) {
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;
  return remainingCount > 0
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
    : "";
}

// Get the HTML for the progress bar and task completion info
function getProgressBarHTML(subtasks, task) {
  if (!Array.isArray(subtasks)) return "";
  const totalSubtasks = subtasks.length;
  const completedTasks = subtasks.filter((subtask) => subtask.completed).length;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;
  return totalSubtasks > 0
    ? `<div class="outsidebox" id="progress${task.id}">
            <div class="progressbar">
              <div class="progressbar-inside" style="width:${completionPercent}%"></div>
            </div>
            <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
          </div>`
    : ""; // If no subtasks, return empty string
}

// Main function to show the subtask template
async function showsubtaskstemplate(task) {
  if (!Array.isArray(task.subtask) || task.subtask.length === 0) return "";

  const subtasksHTML = task.subtask
    .map((subtaskItem, index) =>
      subtaskdesigntemplate(subtaskItem, index, task)
    )
    .join("");

  return /*html*/ `
        <div class="subtasks-container">
          ${subtasksHTML}
        </div>
      `;
}

// Function to generate the subtask design template for each subtask
function subtaskdesigntemplate(subtaskItem, index, task) {
  return /*html*/ `
          <div class="designlayout">
              <label class="custom-checkbox">
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

function getInitialsArray(task) {
  return Array.isArray(task.initials) ? task.initials : [];
}

function getFilteredContactsArray(contacts) {
  return (Array.isArray(contacts) ? contacts : Object.values(contacts)).filter(
    (contact) => contact !== null && contact !== undefined
  );
}

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

function buttontemplate(task) {
  return /*html*/ `
    <button id="oksavebutton" class="savecontact" type="button" ><span>OK</span><div> <img src="/img/checkwhite.png" alt="" /></div> </button>
  `;
}

async function resetOverlayTemplate(elementId, templatePath) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute("w3-include-html", templatePath);
    includeHTML(); // Re-run the includeHTML function to load the content
  }
}

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
                      <span class="spansubtaskdesign" id="spansubtask"></span>
                      <div id="subtasksbox11" class="subtasksbox1"></div>
                      <div id="spanplace"></div>
                    </div>
  `;
}
