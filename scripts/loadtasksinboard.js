async function loadtasks() {
  const todos = [];
  const inprogress = [];
  const awaitingfeedback = [];
  const donetasks = [];

  try {
    const userData = await fetchUserData();
    await handleNullData(userData);
    await ensureFolderData(userData);
    const updatedUserData = await fetchUpdatedUserData();
    loadTasksFromFolders(
      updatedUserData,
      todos,
      inprogress,
      awaitingfeedback,
      donetasks
    );
    await renderAllTasks(todos, inprogress, awaitingfeedback, donetasks);
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}

async function fetchUserData() {
  const response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

async function handleNullData(userData) {
  if (userData === null) {
    await putData("users/1/tasks/todofolder", { todofolder: "" });
    if (userData === null) return;
  }
}

async function ensureFolderData(userData) {
  const folderNames = [
    "todo-folder",
    "inprogress-folder",
    "awaiting-feedback-folder",
    "done-folder",
  ];

  for (let folder of folderNames) {
    if (!userData[folder]) await putData(`users/1/tasks/${folder}`, {});
  }
}

async function fetchUpdatedUserData() {
  const updatedResponse = await fetch(GLOBAL + `users/1/tasks.json`);
  return await updatedResponse.json();
}

function loadTasksFromFolders(
  updatedUserData,
  todos,
  inprogress,
  awaitingfeedback,
  donetasks
) {
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

  pushTasksFromFolder(updatedUserData["todo-folder"], todos);
  pushTasksFromFolder(updatedUserData["inprogress-folder"], inprogress);
  pushTasksFromFolder(
    updatedUserData["awaiting-feedback-folder"],
    awaitingfeedback
  );
  pushTasksFromFolder(updatedUserData["done-folder"], donetasks);
}

async function renderAllTasks(todos, inprogress, awaitingfeedback, donetasks) {
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
}

async function renderTasksWithTemplate(tasks, containerId) {
  const container = document.getElementById(containerId);
  const contacts = await fetchContacts();
  tasks.forEach(async (task) => {
    if (task && task.category) {
      const taskId = task.id;
      const taskHTML = await getTaskHTML(task, taskId, contacts);
      container.insertAdjacentHTML("beforeend", taskHTML);
      setupTaskDraggable(taskId, containerId);
      setupTaskClickListener(task, contacts, taskId);
    }
  });
}

async function getTaskHTML(task, taskId, contacts) {
  if (task.category === "Technical Task") {
    return await Technicaltasktemplate({ ...task, id: taskId }, contacts);
  } else {
    return await userstorytemplate({ ...task, id: taskId }, contacts);
  }
}

async function fetchContacts() {
  const response = await fetch(GLOBAL + "users/1/contacts.json");
  return await response.json();
}

function setupTaskDraggable(taskId, containerId) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.setAttribute("draggable", "true");
    taskElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("taskId", taskId);
      event.dataTransfer.setData("parentFolderId", containerId);
    });
  }
}

function setupTaskClickListener(task, contacts, taskId) {
  document.getElementById(taskId).addEventListener("click", (event) => {
    if (task.category === "Technical Task") {
      opentechnicaltemplate(task, contacts);
    } else {
      openprofiletemplate(task, contacts);
    }
  });
}

function displayNoTasksMessage(folderId, message) {
  const folderElement = document.getElementById(folderId);
  if (folderElement && folderElement.children.length === 0) {
    folderElement.innerHTML = `<div class='nothing'>${message}</div>`;
  }
}
