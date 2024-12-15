async function loadtasks(specificTaskId = null, specificFolderId = null) {
  if (specificTaskId && specificFolderId) {
    await reloadTask(specificTaskId, specificFolderId);
    return;
  }
  try {
    const userData = await fetchTaskData();
    await ensureFolderStructure(userData);
    const updatedUserData = await fetchUpdatedTaskData();
    const { todos, inprogress, awaitingfeedback, donetasks } =
      classifyTasks(updatedUserData);
    clearFolders();
    await renderAllFolders({
      todos,
      inprogress,
      awaitingfeedback,
      donetasks,
    });
    displayAllNoTasksMessages();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

async function fetchTaskData() {
  const response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

async function ensureFolderStructure(userData) {
  if (userData === null) {
    await putData("users/1/tasks/todofolder", { todofolder: "" });
    return;
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
}

async function fetchUpdatedTaskData() {
  const response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

function classifyTasks(updatedUserData) {
  const todos = [];
  const inprogress = [];
  const awaitingfeedback = [];
  const donetasks = [];
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
  return { todos, inprogress, awaitingfeedback, donetasks };
}

function clearFolders() {
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
}

async function renderAllFolders({
  todos,
  inprogress,
  awaitingfeedback,
  donetasks,
}) {
  await renderTasksWithTemplate(todos, "todo-folder");
  await renderTasksWithTemplate(inprogress, "inprogress-folder");
  await renderTasksWithTemplate(awaitingfeedback, "awaiting-feedback-folder");
  await renderTasksWithTemplate(donetasks, "done-folder");
}

async function renderTasksWithTemplate(tasks, containerId) {
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
        taskHTML = await userstorytemplate({ ...task, id: taskId }, contacts);
      }

      container.insertAdjacentHTML("beforeend", taskHTML);
      addDragAndClickHandlers(task, containerId, taskId, contacts);
    }
  });
}

function addDragAndClickHandlers(task, containerId, taskId, contacts) {
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

function displayAllNoTasksMessages() {
  displayNoTasksMessage("todo-folder", "No tasks to do");
  displayNoTasksMessage("inprogress-folder", "No tasks in progress");
  displayNoTasksMessage(
    "awaiting-feedback-folder",
    "No tasks awaiting feedback"
  );
  displayNoTasksMessage("done-folder", "No tasks done");
}

function displayNoTasksMessage(folderId, message) {
  const folderElement = document.getElementById(folderId);
  if (folderElement && folderElement.children.length === 0) {
    folderElement.innerHTML = `<div class='nothing'>${message}</div>`;
  }
}

async function reloadTask(taskId, parentFolderId) {
  try {
    const task = await fetchTaskDataById(taskId, parentFolderId);
    if (!task) return;

    const contacts = await fetchContacts();
    const taskHTML = await getTaskHTML(task, taskId, contacts);

    updateTaskElement(taskId, parentFolderId, taskHTML, task, contacts);
  } catch (error) {
    console.error(`Error reloading task ${taskId}:`, error);
  }
}

async function fetchTaskDataById(taskId, parentFolderId) {
  const response = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return await response.json();
}

async function fetchContacts() {
  const response = await fetch(`${GLOBAL}users/1/contacts.json`);
  return await response.json();
}

async function getTaskHTML(task, taskId, contacts) {
  if (task.category === "Technical Task") {
    return await Technicaltasktemplate({ ...task, id: taskId }, contacts);
  } else {
    return await userstorytemplate({ ...task, id: taskId }, contacts);
  }
}

function updateTaskElement(taskId, parentFolderId, taskHTML, task, contacts) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.outerHTML = taskHTML;
    reattachEventListeners(taskId, parentFolderId, task, contacts);
  } else {
    appendTaskToFolder(taskHTML, parentFolderId);
  }
}

function reattachEventListeners(taskId, parentFolderId, task, contacts) {
  const updatedTaskElement = document.getElementById(taskId);
  updatedTaskElement.setAttribute("draggable", "true");
  updatedTaskElement.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("taskId", taskId);
    event.dataTransfer.setData("parentFolderId", parentFolderId);
  });

  updatedTaskElement.addEventListener("click", () => {
    if (task.category === "Technical Task") {
      opentechnicaltemplate(task, contacts);
    } else {
      openprofiletemplate(task, contacts);
    }
  });
}

function appendTaskToFolder(taskHTML, parentFolderId) {
  const folderElement = document.getElementById(parentFolderId);
  if (folderElement) {
    folderElement.insertAdjacentHTML("beforeend", taskHTML);
  }
}
