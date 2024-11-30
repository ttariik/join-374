let completedtasks = 0;
let fullnames = [];
let colors = [];
let todos = [];
let inprogress = [];
let awaitingfeedback = [];
let donetasks = [];
let currentid = [];
const taskFolders = {
  "todo-folder": todos,
  "inprogress-folder": inprogress,
  "awaiting-feedback-folder": awaitingfeedback,
  "done-folder": donetasks,
};
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();
    task.style.display = taskText.includes(filter) ? "" : "none";
  });
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  const taskId = event.target.id;
  const taskElement = document.getElementById(taskId);

  const parentFolderId = taskElement.getAttribute("data-current-folder-id");

  event.dataTransfer.setData("taskId", taskId);
  event.dataTransfer.setData("parentFolderId", parentFolderId);
}

async function drop(event) {
  event.preventDefault();

  const taskId = event.dataTransfer.getData("taskId");
  const taskElement = document.getElementById(taskId);
  const parentFolderId = taskElement.parentElement.id;
  const targetFolder = event.currentTarget.id;

  try {
    taskElement.setAttribute("draggable", "false");

    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();

    if (!taskData) {
      console.error("Task data not found in the source folder.");
      taskElement.setAttribute("draggable", "true");
      return;
    }

    await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);

    await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);

    const deletionCheck = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const deletedData = await deletionCheck.json();

    if (deletedData !== null) {
      console.error("Task deletion failed.");
      taskElement.setAttribute("draggable", "true");
      return;
    }

    const targetContainer = document.getElementById(targetFolder);
    if (targetContainer) {
      // Remove "No tasks" message from the target folder if present
      const noTasksMessage = targetContainer.querySelector(".nothing");
      if (noTasksMessage) {
        noTasksMessage.remove();
      }

      // Move the task element to the target folder
      targetContainer.appendChild(taskElement);
      taskElement.setAttribute("data-current-folder-id", targetFolder);
    }

    // Handle source folder to show "No tasks" if it's empty
    const parentContainer = document.getElementById(parentFolderId);
    if (parentContainer && parentContainer.children.length === 0) {
      // Add "No tasks" message to source folder if it becomes empty
      const noTasksMessageElement = document.createElement("div");
      noTasksMessageElement.className = "nothing";
      noTasksMessageElement.textContent = getNoTasksMessage(parentFolderId);
      parentContainer.appendChild(noTasksMessageElement);
    }
  } catch (error) {
    console.error("Error during drop operation:", error);
  } finally {
    taskElement.setAttribute("draggable", "true");
  }
}

function getNoTasksMessage(folderId) {
  switch (folderId) {
    case "todo-folder":
      return "No tasks to do";
    case "inprogress-folder":
      return "No tasks in progress";
    case "awaiting-feedback-folder":
      return "No tasks awaiting feedback";
    case "done-folder":
      return "No tasks done";
    default:
      return "No tasks available";
  }
}

document.querySelectorAll(".task").forEach((taskElement) => {
  if (!taskElement.hasAttribute("data-current-folder-id")) {
    taskElement.setAttribute(
      "data-current-folder-id",
      taskElement.parentElement.id
    );
  }
});

async function loadtasks() {
  const todos = [];
  const inprogress = [];
  const awaitingfeedback = [];
  const donetasks = [];

  try {
    const response = await fetch(GLOBAL + `users/1/tasks.json`);
    const userData = await response.json();

    if (userData === null) {
      const result = await putData("users/1/tasks/todofolder", {
        todofolder: "",
      });
      if (userData === null) {
        return;
      }
    }

    const folderNames = [
      "todo-folder",
      "inprogress-folder",
      "awaiting-feedback-folder",
      "done-folder",
    ];

    for (let folder of folderNames) {
      if (!userData[folder]) {
        await putData(`users/1/tasks/${folder}`, {});
      }
    }

    const updatedResponse = await fetch(GLOBAL + `users/1/tasks.json`);
    const updatedUserData = await updatedResponse.json();

    const pushTasksFromFolder = (folderData, taskArray) => {
      if (folderData && typeof folderData === "object") {
        Object.entries(folderData).forEach(([key, task]) => {
          if (task !== null) {
            task.id = key;
            taskArray.push(task);
          }
        });
      }
    };

    if (updatedUserData["todo-folder"]) {
      pushTasksFromFolder(updatedUserData["todo-folder"], todos);
    }

    if (updatedUserData["inprogress-folder"]) {
      pushTasksFromFolder(updatedUserData["inprogress-folder"], inprogress);
    }

    if (updatedUserData["awaiting-feedback-folder"]) {
      pushTasksFromFolder(
        updatedUserData["awaiting-feedback-folder"],
        awaitingfeedback
      );
    }

    if (updatedUserData["done-folder"]) {
      pushTasksFromFolder(updatedUserData["done-folder"], donetasks);
    }

    const folders = [
      "todo-folder",
      "inprogress-folder",
      "awaiting-feedback-folder",
      "done-folder",
    ];
    folders.forEach((folderId) => {
      const folderElement = document.getElementById(folderId);
      if (folderElement) folderElement.innerHTML = "";
    });

    const displayNoTasksMessage = (folderId, message) => {
      const folderElement = document.getElementById(folderId);
      if (folderElement && folderElement.children.length === 0) {
        folderElement.innerHTML = `<div class='nothing'>${message}</div>`;
      }
    };

    const renderTasksWithTemplate = async (tasks, containerId) => {
      const container = document.getElementById(containerId);
      const response2 = await fetch(GLOBAL + "users/1/contacts.json");
      const contacts = await response2.json();
      tasks.forEach(async (task) => {
        if (task && task.category) {
          const taskId = task.id;
          let taskHTML;

          if (task.category === "Technical Task") {
            taskHTML = await Technicaltasktemplate(
              { ...task, id: taskId },
              contacts
            );
          } else {
            taskHTML = await userstorytemplate(
              { ...task, id: taskId },
              contacts
            );
          }

          container.insertAdjacentHTML("beforeend", taskHTML);

          const taskElement = document.getElementById(taskId);
          if (taskElement) {
            taskElement.setAttribute("draggable", "true");
            taskElement.addEventListener("dragstart", (event) => {
              event.dataTransfer.setData("taskId", taskId);
              event.dataTransfer.setData("parentFolderId", containerId);
            });
          }

          document.getElementById(taskId).addEventListener("click", () => {
            if (task.category === "Technical Task") {
              opentechnicaltemplate(task, contacts);
            } else {
              openprofiletemplate(task, contacts);
            }
          });
        }
      });
    };

    await renderTasksWithTemplate(todos, "todo-folder");
    await renderTasksWithTemplate(inprogress, "inprogress-folder");
    await renderTasksWithTemplate(awaitingfeedback, "awaiting-feedback-folder");
    await renderTasksWithTemplate(donetasks, "done-folder");

    displayNoTasksMessage("todo-folder", "No tasks to do");
    displayNoTasksMessage("inprogress-folder", "No tasks in progress");
    displayNoTasksMessage(
      "awaiting-feedback-folder",
      "No tasks awaiting feedback"
    );
    displayNoTasksMessage("done-folder", "No tasks done");
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

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

async function openprofiletemplate(task, contacts) {
  document.getElementById("overlayprofile-template").classList.add("overlayss");
  document.getElementById("overlayprofile-template").classList.remove("d-none");

  // Ensure the content is updated before starting the transition
  await inputacessprofile(task, contacts);

  // Apply the transition after content is updated
  setTimeout(() => {
    document.querySelector(".overlayss").style.transform = "translateX(0%)";
  }, 0); // A slight delay for the transform effect
}

async function inputacessprofile(task, contacts) {
  if (document.getElementById("subtaskarea")) {
    document.getElementById("subtaskarea").style = "padding: 6px 0px 0px;";
  }

  const profileTitleElement = document.getElementById("profiletitle");
  if (profileTitleElement) {
    profileTitleElement.innerHTML = task.title || "";
  }

  const profileDescriptionElement =
    document.getElementById("profiledescription");
  if (profileDescriptionElement) {
    profileDescriptionElement.innerHTML = task.description || "";
  }

  const profileDueDateElement = document.getElementById("profileduedate");
  if (profileDueDateElement) {
    profileDueDateElement.innerHTML = task.duedate || "";
  }

  const profilePriorityElement = document.getElementById("profilepriority");
  if (profilePriorityElement) {
    profilePriorityElement.innerHTML = task.prio || "";
  }

  const profileIconElement = document.getElementById("profileicon");
  if (profileIconElement) {
    profileIconElement.src = `../img/${task.prio || "default"}.png`;
  }

  const btn1_10 = document.getElementById("btn1_10");
  if (btn1_10) {
    btn1_10.addEventListener("click", function () {
      deletetask(task);
    });
  }

  const btn2_11 = document.getElementById("btn2-11");
  if (btn2_11) {
    btn2_11.addEventListener("click", function () {
      editprofile(task);
    });
  }

  const initialsArray = Array.isArray(task.initials) ? task.initials : [];
  const contactsArray = (
    Array.isArray(contacts) ? contacts : Object.values(contacts)
  ).filter((contact) => contact !== null && contact !== undefined);

  const profileAssignedArea = document.getElementById("profileassingedarea");

  let badgeHTML = "";

  contactsArray.forEach((contact) => {
    const matchingInitials = initialsArray.find(
      (initialObj) => initialObj.initials === contact.initials
    );

    if (matchingInitials) {
      const initials = matchingInitials.initials;
      const name = matchingInitials.name;
      const contactColor = contact.color || "#000";

      badgeHTML += `<div>
      <div class="badge alignment" style="background-color:${contactColor}">
        ${initials} 
      </div>
      <span>${name}</span>
      </div>
    `;
    }
  });

  if (profileAssignedArea) {
    profileAssignedArea.innerHTML = badgeHTML;
  }

  const subtaskHTML = await showsubtaskstemplate(task);
  if (document.getElementById("subtaskarea")) {
    document.getElementById("subtaskarea").innerHTML = subtaskHTML;
  }
}

async function inputacesstechnicall(task, contacts) {
  document.getElementById("technicaltasktitle").innerHTML = task.title;
  document.getElementById("descriptioninput").innerHTML = task.description;
  document.getElementById("due-date-containerinput").innerHTML = task.duedate;
  document.getElementById("showprio").innerHTML = task.prio;
  document.getElementById("prioiconid").src = `/img/${task.prio}.png`;
  const deleteButton = document.getElementById("btn1");
  const editButton = document.getElementById("btn2");

  const newDeleteButton = deleteButton.cloneNode(true);
  const newEditButton = editButton.cloneNode(true);

  deleteButton.replaceWith(newDeleteButton);
  editButton.replaceWith(newEditButton);

  newDeleteButton.addEventListener("click", () => deletetask(task));
  newEditButton.addEventListener("click", () => editinputs(task));
  // Render assigned persons and subtasks
  await assignedtotemplate(task, contacts);

  const subtaskHTML = await showsubtaskstemplate(task);
  document.getElementById("subtaskbox").innerHTML = subtaskHTML;
}

function deletetask(task) {
  const taskId = task.id;
  const taskElement = document.getElementById(taskId);

  if (!taskElement) {
    console.error("Task element not found in the DOM.");
    return;
  }

  const parentFolder = taskElement.parentElement;
  const parentFolderId = parentFolder.id;

  deleteData(`users/1/tasks/${parentFolderId}/${taskId}`, task)
    .then(() => {
      taskElement.remove();

      if (parentFolder.children.length === 0) {
        const noTasksMessage = document.createElement("div");
        noTasksMessage.className = "nothing";

        switch (parentFolderId) {
          case "todo-folder":
            noTasksMessage.textContent = "No tasks To do";
            break;
          case "inprogress-folder":
            noTasksMessage.textContent = "No tasks in progress";
            break;
          case "awaiting-feedback-folder":
            noTasksMessage.textContent = "No tasks awaiting feedback";
            break;
          case "done-folder":
            noTasksMessage.textContent = "No tasks done";
            break;
          default:
            noTasksMessage.textContent = "No tasks";
        }

        parentFolder.appendChild(noTasksMessage);
      }
    })
    .catch((error) => {
      console.error("Error deleting task:", error);
    });
  closeoverlaytechnicaltemplate();
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
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

async function opentechnicaltemplate(task, contacts) {
  document
    .getElementById("overlaytechinical-task-template")
    .classList.add("overlayss");
  document
    .getElementById("overlaytechinical-task-template")
    .classList.remove("d-none");
  setTimeout(() => {
    document.querySelector(".overlayss").style = "transform: translateX(0%);";
  }, 0);
  inputacesstechnicall(task, contacts);
}

function closeaddtasktemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("overlay-addtask").classList.add("d-none");
    document.getElementById("overlay-addtask").classList.remove("overlayss");
  }, 1000);
}

async function closeoverlayprofiletemplate() {
  asignedtousers = [];
  initialsArray = [];
  if (document.getElementById("assignedusers1")) {
    document.getElementById("assignedusers1").innerHTML = "";
  }

  document.querySelector(".overlayss").style = "transform: translateX(250%);";

  setTimeout(() => {
    document.getElementById("overlayprofile-template").classList.add("d-none");
    document
      .getElementById("overlayprofile-template")
      .classList.remove("overlayss");
  }, 1000);
}

async function closeoverlaytechnicaltemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";

  setTimeout(() => {
    document
      .getElementById("overlaytechinical-task-template")
      .classList.add("d-none");
    document
      .getElementById("overlaytechinical-task-template")
      .classList.remove("overlayss");
  }, 1000);
}

async function calladdtasktemplate() {
  document.getElementById("overlay-addtask").classList.remove("d-none");
  document.getElementById("overlay-addtask").classList.add("overlayss");
  setTimeout(() => {
    document.getElementById("overlay-addtask").style.transform =
      "translateX(0%)";
  }, 0.9);
}

document
  .getElementById("add-tasktemplate")
  .addEventListener("click", function () {
    calladdtasktemplate();
  });

function applyHoverEffect(buttonId, imageId, hoverSrc) {
  const buttonElement = document.getElementById(buttonId);
  const imageElement = document.getElementById(imageId);

  buttonElement.addEventListener("mouseover", function () {
    imageElement.src = hoverSrc;
  });

  buttonElement.addEventListener("mouseout", function () {
    imageElement.src = "/img/status-item.png";
  });

  buttonElement.addEventListener("click", function () {
    calladdtasktemplate();
  });
}

applyHoverEffect("buttonicon1", "pic1", "/img/pic1hovered.png");
applyHoverEffect("buttonicon2", "pic2", "/img/pic1hovered.png");
applyHoverEffect("buttonicon3", "pic3", "/img/pic1hovered.png");

async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

document.getElementById("todo-folder").addEventListener("drop", drop);
document.getElementById("inprogress-folder").addEventListener("drop", drop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("drop", drop);
document.getElementById("done-folder").addEventListener("drop", drop);

document.getElementById("todo-folder").addEventListener("dragover", allowDrop);
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("dragover", allowDrop);
document.getElementById("done-folder").addEventListener("dragover", allowDrop);
