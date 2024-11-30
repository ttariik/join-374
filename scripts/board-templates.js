async function userstorytemplate(task, contacts) {
  const contactsArray = (
    Array.isArray(contacts) ? contacts : Object.values(contacts)
  ).filter((contact) => contact !== null && contact !== undefined);

  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const displayedInitials = initialsArray.slice(0, 5); // Nur die ersten 5 Initialen anzeigen
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;

  const initialsHTML = displayedInitials
    .map((initialObj) => {
      const initial = initialObj.initials;

      const contact = contactsArray.find(
        (contact) => contact.initials === initial
      );

      const color = contact ? contact.color : "#ccc";

      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");

  const extraCircleHTML =
    remainingCount > 0
      ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
      : "";

  const totalSubtasks = Array.isArray(task.subtask) ? task.subtask.length : 0;
  const completedTasks = task.subtask
    ? task.subtask.filter((subtask) => subtask.completed).length
    : 0;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;

  const progressBarHTML =
    totalSubtasks > 0
      ? `<div class="outsidebox" id="progress${task.id}">
            <div class="progressbar">
              <div class="progressbar-inside" style="width:${completionPercent}%"></div>
            </div>
            <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
          </div>`
      : "";

  const htmlTemplate = `
      <div class="user-container task" draggable="true" ondragstart="drag(event)" id="${task.id}">
        <div class="task-detailss">
          <span>${task.category}</span>
        </div>
        <div class="titlecontainer">
          <div class="section-one">${task.title}</div>
          <div class="section-two">${task.description}</div>
        </div>
        ${progressBarHTML}
        <div class="asignbox">
          <div class="initialsbox" id="initialbox">
            ${initialsHTML}
            ${extraCircleHTML}
          </div>
          <img src="/img/${task.prio}.png" alt="">
        </div>
      </div>
    `;

  return htmlTemplate;
}

async function Technicaltasktemplate(task, contacts) {
  const contactsArray = (
    Array.isArray(contacts) ? contacts : Object.values(contacts)
  ).filter((contact) => contact !== null && contact !== undefined);

  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const displayedInitials = initialsArray.slice(0, 5); // Nur die ersten 5 Initialen anzeigen
  const remainingCount =
    initialsArray.length > 5 ? initialsArray.length - 5 : 0;

  const initialsHTML = displayedInitials
    .map((initialObj) => {
      const initial = initialObj.initials;

      const contact = contactsArray.find(
        (contact) => contact.initials === initial
      );

      const color = contact ? contact.color : "#ccc";

      return `<div class="badgestyle badge" style="background-color:${color}">${initial}</div>`;
    })
    .join("");

  // Hinzufügen des extra badge, wenn mehr als 5 Initialen vorhanden sind
  const extraCircleHTML =
    remainingCount > 0
      ? `<div class="badgestyle badge extra-badge" style="background-color:grey">+${remainingCount}</div>`
      : "";

  const totalSubtasks = Array.isArray(task.subtask) ? task.subtask.length : 0;
  const completedTasks = task.subtask
    ? task.subtask.filter((subtask) => subtask.completed).length
    : 0;
  const completionPercent =
    totalSubtasks > 0 ? (completedTasks / totalSubtasks) * 100 : 0;

  // Render the progress bar only if there are subtasks
  const progressBarHTML =
    totalSubtasks > 0
      ? `<div class="outsidebox" id="progress${task.id}">
            <div class="progressbar">
              <div class="progressbar-inside" style="width:${completionPercent}%"></div>
            </div>
            <div class="subtask-info"><span>${completedTasks}/${totalSubtasks} Subtasks</span></div>
          </div>`
      : ""; // Empty string if no subtasks

  return /*html*/ `
      <div class="task-container task" draggable="true" ondragstart="drag(event)" id="${task.id}">
        <div class="task-category">
          <span class="task-category-name">${task.category}</span>
        </div>
        <div class="task-details">
          <div class="task-title">${task.title}</div>
          <div class="task-description">${task.description}</div>
        </div>
        ${progressBarHTML} <!-- Rendered conditionally -->
        <div class="task-statuss">
          <div class="initialsboxdesign">
            ${initialsHTML}
            ${extraCircleHTML} <!-- Extra badge für die verbleibenden Initialen -->
          </div>
          <img src="/img/${task.prio}.png" alt="Priority" />
        </div>
      </div>
    `;
}

async function showsubtaskstemplate(task) {
  if (!Array.isArray(task.subtask)) return "";

  const subtasksHTML = task.subtask
    .map((subtaskItem, index) => {
      return /*html*/ `
          <div class="designlayout">
            <label class="custom-checkbox">
              <input type="checkbox" id="${task.id}-${index}" ${
        subtaskItem.completed ? "checked" : ""
      } class="checkboxdesign" />
              <span class="checkmark"></span>
            </label>
            <span class="subtask-title">${subtaskItem.subtask}</span>
          </div>
        `;
    })
    .join("");

  return /*html*/ `
      <div class="subtasks-container">
        ${subtasksHTML}
      </div>
    `;
}

async function assignedtotemplate(task, contacts) {
  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const contactsArray = (
    Array.isArray(contacts) ? contacts : Object.values(contacts)
  ).filter((contact) => contact !== null && contact !== undefined);

  const profileAssignedArea = document.getElementById("showassignedperson");

  let badgeHTML = "";
  const displayedInitials = new Set();

  contactsArray.forEach((contact) => {
    const matchingInitials = initialsArray.find(
      (initialObj) => initialObj.initials === contact.initials
    );

    if (matchingInitials && !displayedInitials.has(matchingInitials.initials)) {
      const initials = matchingInitials.initials;
      const name = matchingInitials.name || "Unknown";
      const contactColor = contact.color || "#000";

      badgeHTML += `<div id="assignedusers">
        <div class="badge alignment" style="background-color:${contactColor}">
          ${initials} 
        </div>
        <span class="badge-name">${name}</span>
        </div>
      `;

      displayedInitials.add(matchingInitials.initials);
    }
  });

  if (profileAssignedArea) {
    profileAssignedArea.innerHTML = badgeHTML;
  } else {
    console.error("Profile assigned area not found");
  }
}
