/**
 * Loads tasks either for a specific task and folder or all tasks.
 * @param {string|null} specificTaskId - The ID of a specific task to load (optional).
 * @param {string|null} specificFolderId - The ID of a specific folder to load (optional).
 */
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

/**
 * Fetches task data for a user.
 * @returns {Promise<Object>} The task data of the user.
 */
async function fetchTaskData() {
  const response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

/**
 * Ensures that the folder structure for tasks exists.
 * @param {Object} userData - The user's task data.
 */
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

/**
 * Fetches updated task data for the user.
 * @returns {Promise<Object>} The updated task data for the user.
 */
async function fetchUpdatedTaskData() {
  const response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

/**
 * Classifies tasks into different folders based on their status.
 * @param {Object} updatedUserData - The updated task data.
 * @returns {Object} The classified tasks by their status.
 */
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

/**
 * Clears the content of all task folders.
 */
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

/**
 * Renders all task folders with the tasks classified by status.
 * @param {Object} tasks - An object containing classified tasks for each folder.
 * @param {Array} tasks.todos - The tasks to display in the "To Do" folder.
 * @param {Array} tasks.inprogress - The tasks to display in the "In Progress" folder.
 * @param {Array} tasks.awaitingfeedback - The tasks to display in the "Awaiting Feedback" folder.
 * @param {Array} tasks.donetasks - The tasks to display in the "Done" folder.
 */
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

/**
 * Renders tasks into a specific folder using templates.
 * @param {Array} tasks - The list of tasks to render.
 * @param {string} containerId - The ID of the container to render the tasks into.
 */
async function renderTasksWithTemplate(tasks, containerId) {
  const container = document.getElementById(containerId);
  const response2 = await fetch(GLOBAL + "users/1/contacts.json");
  const contacts = await response2.json();
  for (const task of tasks) {
    if (task && task.category) {
      const taskId = task.id;
      const taskHTML =
        task.category === "Technical Task"
          ? await Technicaltasktemplate({ ...task, id: taskId }, contacts)
          : await userstorytemplate({ ...task, id: taskId }, contacts);
      container.insertAdjacentHTML("beforeend", taskHTML);
      upanddownbuttonslisteners(task.id, task);
      document.getElementById(taskId).addEventListener("click", (event) => {
        if (task.category === "Technical Task") {
          opentechnicaltemplate(task, contacts);
        } else {
          openprofiletemplate(task, contacts);
        }
      });
      if (containerId === "done-folder") {
        const upButton = document.getElementById(`downbutton${taskId}`);
        if (upButton) {
          upButton.classList.add("d-none");
        }
      }
      if (containerId === "todo-folder") {
        const downButton = document.getElementById(`upbutton${taskId}`);
        if (downButton) {
          downButton.classList.add("d-none");
        }
      }
    }
  }
}

/**
 * Adds drag and click event handlers to a task element.
 * @param {Object} task - The task object.
 * @param {string} containerId - The ID of the folder container.
 * @param {string} taskId - The ID of the task.
 * @param {Array} contacts - The list of contacts.
 */
async function addDragAndClickHandlers(task, containerId, taskId, contacts) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.setAttribute("draggable", "true");
    taskElement.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("taskId", taskId);
      event.dataTransfer.setData("parentFolderId", containerId);
    });
  }

  document.getElementById(taskId).addEventListener("click", (event) => {
    if (task.category === "Technical Task") {
      opentechnicaltemplate(task, contacts);
    } else {
      openprofiletemplate(task, contacts);
    }
  });
}

function upanddownbuttonslisteners(taskId, task) {
  const upButton = document.getElementById(`upbutton${taskId}`);
  const downButton = document.getElementById(`downbutton${taskId}`);
  const parentFolderId = document.getElementById(taskId)?.parentElement?.id;

  if (upButton) {
    upButton.addEventListener("click", function (event) {
      event.stopImmediatePropagation(); 
      changefolder1(taskId, parentFolderId, task, event); 
    });
  }

  if (downButton) {
    downButton.addEventListener("click", function (event) {
      event.stopImmediatePropagation(); 
      changefolder(taskId, parentFolderId, task, event); 
    });
  }}

/**
 * Displays messages in folders if no tasks are present.
 */
function displayAllNoTasksMessages() {
  displayNoTasksMessage("todo-folder", "No tasks to do");
  displayNoTasksMessage("inprogress-folder", "No tasks in progress");
  displayNoTasksMessage(
    "awaiting-feedback-folder",
    "No tasks awaiting feedback"
  );
  displayNoTasksMessage("done-folder", "No tasks done");
}

/**
 * Displays a message in a folder if it contains no tasks.
 * @param {string} folderId - The ID of the folder.
 * @param {string} message - The message to display if the folder is empty.
 */
function displayNoTasksMessage(folderId, message) {
  const folderElement = document.getElementById(folderId);
  if (folderElement && folderElement.children.length === 0) {
    folderElement.innerHTML = `<div class='nothing'>${message}</div>`;
  }
}

/**
 * Reloads a task from the specified folder and task ID.
 * @param {string} taskId - The ID of the task to reload.
 * @param {string} parentFolderId - The ID of the folder containing the task.
 */
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

/**
 * Fetches task data by task ID and folder ID.
 * @param {string} taskId - The ID of the task.
 * @param {string} parentFolderId - The ID of the folder containing the task.
 * @returns {Promise<Object>} The task data.
 */
async function fetchTaskDataById(taskId, parentFolderId) {
  const response = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return await response.json();
}

/**
 * Fetches contacts data for the user.
 * @returns {Promise<Object>} The contacts data.
 */
async function fetchContacts() {
  const response = await fetch(`${GLOBAL}users/1/contacts.json`);
  return await response.json();
}

/**
 * Generates HTML for a task.
 * @param {Object} task - The task object.
 * @param {string} taskId - The ID of the task.
 * @param {Array} contacts - The list of contacts.
 * @returns {Promise<string>} The generated HTML for the task.
 */
async function getTaskHTML(task, taskId, contacts) {
  if (task.category === "Technical Task") {
    return await Technicaltasktemplate({ ...task, id: taskId }, contacts);
  } else {
    return await userstorytemplate({ ...task, id: taskId }, contacts);
  }
}

/**
 * Updates a task element in the DOM.
 * @param {string} taskId - The ID of the task.
 * @param {string} parentFolderId - The ID of the folder.
 * @param {string} taskHTML - The generated HTML for the task.
 * @param {Object} task - The task object.
 * @param {Array} contacts - The list of contacts.
 */
function updateTaskElement(taskId, parentFolderId, taskHTML, task, contacts) {
  const taskElement = document.getElementById(taskId);
  if (taskElement) {
    taskElement.outerHTML = taskHTML;
    reattachEventListeners(taskId, parentFolderId, task, contacts);
  } else {
    appendTaskToFolder(taskHTML, parentFolderId);
  }
}

/**
 * Reattaches event listeners to the updated task element.
 * @param {string} taskId - The ID of the task.
 * @param {string} parentFolderId - The ID of the folder.
 * @param {Object} task - The task object.
 * @param {Array} contacts - The list of contacts.
 */
function reattachEventListeners(taskId, parentFolderId, task, contacts) {
  const updatedTaskElement = document.getElementById(taskId);
  updatedTaskElement.setAttribute("draggable", "true");
  updatedTaskElement.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("taskId", taskId);
    event.dataTransfer.setData("parentFolderId", parentFolderId);
  });

  updatedTaskElement.addEventListener("click", (event) => {
    if (task.category === "Technical Task") {
      opentechnicaltemplate(task, contacts);
    } else {
      openprofiletemplate(task, contacts);
    }
  });
}

/**
 * Appends a task to the specified folder.
 * @param {string} taskHTML - The generated HTML for the task.
 * @param {string} parentFolderId - The ID of the folder.
 */
function appendTaskToFolder(taskHTML, parentFolderId) {
  const folderElement = document.getElementById(parentFolderId);
  if (folderElement) {
    folderElement.insertAdjacentHTML("beforeend", taskHTML);
  }
}

/**
 * Reloads a specific folder with tasks.
 * @param {string} folderId - The ID of the folder to reload (e.g., "todo-folder").
 */
async function reloadFolder(folderId) {
  try {
    const userData = await fetchTaskData();
    await ensureFolderStructure(userData);
    const updatedUserData = await fetchUpdatedTaskData();
    const { todos, inprogress, awaitingfeedback, donetasks } =
      classifyTasks(updatedUserData);

    const folderContent = document.getElementById(folderId);
    if (folderContent) folderContent.innerHTML = "";

    switch (folderId) {
      case "todo-folder":
        await renderTasksWithTemplate(todos, "todo-folder");
        break;
      case "inprogress-folder":
        await renderTasksWithTemplate(inprogress, "inprogress-folder");
        break;
      case "awaiting-feedback-folder":
        await renderTasksWithTemplate(
          awaitingfeedback,
          "awaiting-feedback-folder"
        );
        break;
      case "done-folder":
        await renderTasksWithTemplate(donetasks, "done-folder");
        break;
      default:
        console.warn(`Unknown folder: ${folderId}`);
    }

    displayNoTasksMessage(
      folderId,
      `No tasks in ${folderId.replace("-", " ")}`
    );
  } catch (error) {
    console.error(`Error reloading folder ${folderId}:`, error);
  }
}
