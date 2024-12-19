/**
 * Allows an element to act as a drop target by preventing the default drag behavior.
 * @param {DragEvent} event - The drag event object.
 */
function allowDrop(event) {
  event.preventDefault();
}

/**
 * Handles the drag start event, sets up the drag data, and adds drag-related event listeners to folders.
 * @param {DragEvent} event - The drag event object.
 */
function drag(event) {
  const taskId = event.target.id;
  const taskElement = document.getElementById(taskId);
  const parentFolderId = taskElement.getAttribute("data-current-folder-id");

  document.querySelectorAll(".folder").forEach((folder) => {
    folder.addEventListener("dragenter", dragenter);
    folder.addEventListener("dragleave", dragleave);
  });

  event.dataTransfer.setData("taskId", taskId);
  event.dataTransfer.setData("parentFolderId", parentFolderId);
}

/**
 * Handles the drag enter event, displays a visual indicator (e.g., "nothing2" div) when dragging over a folder.
 * @param {DragEvent} event - The drag event object.
 */
function dragenter(event) {
  const targetFolder = event.currentTarget;

  // Check if the visual indicator already exists
  let nothingDiv = targetFolder.querySelector(".nothing2");
  if (!nothingDiv) {
    nothingDiv = document.createElement("div");
    nothingDiv.className = "nothing2";
    nothingDiv.style.position = "absolute";
    nothingDiv.style.zIndex = "-99999";
    nothingDiv.style.padding = "10px";
    nothingDiv.style.display = "block";
    targetFolder.appendChild(nothingDiv);
  }

  const messagediv = targetFolder.querySelector(".nothing");
  if (messagediv) {
    messagediv.remove();
  }
}

/**
 * Handles the drag leave event, removes the visual indicator from the folder.
 * @param {DragEvent} event - The drag event object.
 */
function dragleave(event) {
  const targetFolder = event.currentTarget;
  const nothingDiv = targetFolder.querySelector(".nothing2");
  if (nothingDiv) {
    nothingDiv.remove();
  }
  let messagediv = targetFolder.querySelector(".nothing");
  if (!messagediv && targetFolder.children.length === 0) {
    messagediv = document.createElement("div");
    messagediv.className = "nothing";
    messagediv.textContent = getNoTasksMessage(targetFolder.id);
    targetFolder.appendChild(messagediv);
  }
}

/**
 * Handles the drop event to move tasks between folders.
 * Fetches, updates, and reorganizes the DOM and backend data.
 * @param {DragEvent} event - The drag event object.
 */

async function dropinputs(event) {
  const taskId = event.dataTransfer.getData("taskId");
  const taskElement = document.getElementById(taskId);

  if (!taskId || !taskElement) {
    console.error("Task ID or task element not found.");
    return null;
  }
  const parentFolderId = taskElement.parentElement.id;
  const targetFolder = event.currentTarget.id;
  if (parentFolderId === targetFolder) {
    return null;
  }
  const removedMessageDiv = event.currentTarget.querySelector(".nothing2");
  if (removedMessageDiv) {
    removedMessageDiv.remove();
  }
  return { taskId, taskElement, parentFolderId, targetFolder };
}

async function drop(event) {
  event.preventDefault();
  const taskDetails = await dropinputs(event);
  if (!taskDetails) {
    return;
  }
  const { taskId, taskElement, parentFolderId, targetFolder } = taskDetails;
  try {
    taskElement.setAttribute("draggable", "false");
    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();
    lastpartdropfunction(
      targetFolder,
      taskId,
      taskData,
      parentFolderId,
      taskElement
    );
  } catch (error) {
    console.error("Error during drop operation:", error);
  } finally {
    taskElement.setAttribute("draggable", "true");
  }
}

async function lastpartdropfunction(
  targetFolder,
  taskId,
  taskData,
  parentFolderId,
  taskElement
) {
  await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);
  await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);
  const deletionCheck = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  const deletedData = await deletionCheck.json();
  deleteDatapart(deletedData, targetFolder, taskElement, parentFolderId);
  const parentContainer = document.getElementById(parentFolderId);
  if (parentContainer && parentContainer.children.length === 0) {
    const noTasksMessageElement = document.createElement("div");
    noTasksMessageElement.className = "nothing";
    noTasksMessageElement.textContent = getNoTasksMessage(parentFolderId);
    parentContainer.appendChild(noTasksMessageElement);
  }
}

function deleteDatapart(
  deletedData,
  targetFolder,
  taskElement,
  parentFolderId
) {
  if (deletedData === null) {
    const targetContainer = document.getElementById(targetFolder);
    const noTasksMessage = targetContainer.querySelector(".nothing");
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
    targetContainer.appendChild(taskElement);
    taskElement.setAttribute("data-current-folder-id", targetFolder);
  } else {
    const parentContainer = document.getElementById(parentFolderId);
    parentContainer.appendChild(taskElement);
    taskElement.setAttribute("data-current-folder-id", parentFolderId);
  }
}

/**
 * Returns a message indicating no tasks are available in a folder.
 * @param {string} folderId - The ID of the folder.
 * @returns {string} The message for the folder.
 */
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
