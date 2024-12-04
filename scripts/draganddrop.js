function allowDrop(event) {
  event.preventDefault();
}


function drag(event) {
  const taskId = event.target.id;
  const parentFolderId = getParentFolderId(taskId);

  event.dataTransfer.setData("taskId", taskId);
  event.dataTransfer.setData("parentFolderId", parentFolderId);
}


function getParentFolderId(taskId) {
  const taskElement = document.getElementById(taskId);
  return taskElement.getAttribute("data-current-folder-id");
}


async function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("taskId");
  const parentFolderId = event.dataTransfer.getData("parentFolderId");
  const targetFolder = event.currentTarget.id;

  if (targetFolder === parentFolderId) return;
  await handleDrop(taskId, parentFolderId, targetFolder);
}


async function handleDrop(taskId, parentFolderId, targetFolder) {
  const taskElement = document.getElementById(taskId);
  disableDrag(taskElement);

  try {
    const taskData = await fetchTaskData(parentFolderId, taskId);
    await moveTaskToNewFolder(targetFolder, taskId, taskData);
    await deleteTaskFromFolder(parentFolderId, taskId);
    await updateDOMAfterMove(taskElement, parentFolderId, targetFolder);
  } catch (error) {
    handleErrorDuringDrop(taskElement, parentFolderId, error);
  } finally {
    enableDrag(taskElement);
  }
}


function disableDrag(taskElement) {
  taskElement.setAttribute("draggable", "false");
}


function enableDrag(taskElement) {
  taskElement.setAttribute("draggable", "true");
}


async function fetchTaskData(parentFolderId, taskId) {
  const response = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return response.json();
}


async function moveTaskToNewFolder(targetFolder, taskId, taskData) {
  await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);
}


async function deleteTaskFromFolder(parentFolderId, taskId) {
  await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);
}


async function updateDOMAfterMove(taskElement, parentFolderId, targetFolder) {
  const isDeleted = await checkTaskDeletion(parentFolderId, taskElement.id);

  if (isDeleted) {
    moveTaskInDOM(taskElement, targetFolder);
    updateSourceFolder(parentFolderId);
  } else {
    revertTaskToOriginalFolder(taskElement, parentFolderId);
    alert("Failed to move task. Reverting to original folder.");
  }
}


async function checkTaskDeletion(parentFolderId, taskId) {
  const response = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  const data = await response.json();
  return data === null;
}


function moveTaskInDOM(taskElement, targetFolder) {
  const targetContainer = document.getElementById(targetFolder);
  removeNoTasksMessage(targetContainer);

  targetContainer.appendChild(taskElement);
  taskElement.setAttribute("data-current-folder-id", targetFolder);
}


function removeNoTasksMessage(container) {
  const noTasksMessage = container.querySelector(".nothing");
  if (noTasksMessage) noTasksMessage.remove();
}


function updateSourceFolder(folderId) {
  const parentContainer = document.getElementById(folderId);
  if (parentContainer && parentContainer.children.length === 0) {
    const noTasksMessageElement = createNoTasksMessage(folderId);
    parentContainer.appendChild(noTasksMessageElement);
  }
}


function createNoTasksMessage(folderId) {
  const noTasksMessageElement = document.createElement("div");
  noTasksMessageElement.className = "nothing";
  noTasksMessageElement.textContent = getNoTasksMessage(folderId);
  return noTasksMessageElement;
}


function revertTaskToOriginalFolder(taskElement, folderId) {
  const parentContainer = document.getElementById(folderId);
  parentContainer.appendChild(taskElement);
  taskElement.setAttribute("data-current-folder-id", folderId);
}


function handleErrorDuringDrop(taskElement, parentFolderId, error) {
  console.error("Error during drop operation:", error);
  revertTaskToOriginalFolder(taskElement, parentFolderId);
  alert("An error occurred during the move. Task reverted to original folder.");
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
