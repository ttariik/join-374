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

// Logic Handling Function
function generateTaskDetails(task, contacts) {
  const contactsArray = Array.isArray(contacts)
    ? getValidContactsArray(contacts)
    : [];

  const taskCategory = task?.category || "Uncategorized";
  const taskTitle = task?.title || "Untitled Task";
  const taskDescription = task?.description || "";
  const taskPrio = task?.prio || "";

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

// Template Function
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
        <img src="/img/${taskPrio}.png" alt="">
      </div>
    </div>
  `;
}

function getValidContactsArray(contacts) {
  return (Array.isArray(contacts) ? contacts : Object.values(contacts)).filter(
    (contact) => contact !== null && contact !== undefined
  );
}

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

function getExtraCircleHTML(initialsArray) {
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;
  return remainingCount > 0
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
    : "";
}

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

function Technicaltasktemplatetemplate(
  task,
  contactsArray,
  initialsHTML,
  extraCircleHTML,
  progressBarHTML
) {
  return ` <div class="task-container task" draggable="true" ondragstart="drag(event)" id="${
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

function getExtraCircleHTML(initialsArray) {
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;
  return remainingCount > 0
    ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
    : "";
}

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
    includeHTML();
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
      ${subtaskboxemplate1()} <!-- Correct way to embed the result of subtaskboxemplate1 -->
    </div>
  `;
}

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
