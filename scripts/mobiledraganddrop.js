/**
 * Changes the folder of a task to a new parent folder and updates the folder structure.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} parentFolderId - The ID of the current parent folder.
 * @param {Object} task - The task object.
 * @param {Event} event - The event triggering the folder change.
 */
async function changefolder(taskId, parentFolderId, task, event) {
  const taskDataJson = await getTaskDataJson(taskId, parentFolderId);
  const updatedParentFolderId = forwardslogic(parentFolderId);

  await updateTaskInFolder(
    taskId,
    updatedParentFolderId,
    taskDataJson,
    parentFolderId
  );
  reloadFolder(updatedParentFolderId);
}

/**
 * Fetches task data as JSON from the server.
 * @param {string} taskId - The ID of the task.
 * @param {string} parentFolderId - The ID of the parent folder.
 * @returns {Promise<Object>} The task data as a JSON object.
 */
async function getTaskDataJson(taskId, parentFolderId) {
  const taskData = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return await taskData.json();
}

/**
 * Updates the task in the new folder and removes it from the old folder.
 * @param {string} taskId - The ID of the task.
 * @param {string} updatedParentFolderId - The ID of the new parent folder.
 * @param {Object} taskDataJson - The task data as a JSON object.
 * @param {string} parentFolderId - The ID of the old parent folder.
 */
async function updateTaskInFolder(
  taskId,
  updatedParentFolderId,
  taskDataJson,
  parentFolderId
) {
  await putData(
    `users/1/tasks/${updatedParentFolderId}/${taskId}`,
    taskDataJson
  );
  await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);
  await handleTaskReattachment(taskId, updatedParentFolderId, parentFolderId);
}

/**
 * Handles reattaching a task to the updated or original folder based on its status.
 * @param {string} taskId - The ID of the task.
 * @param {string} updatedParentFolderId - The ID of the new parent folder.
 * @param {string} parentFolderId - The ID of the original parent folder.
 */
async function handleTaskReattachment(
  taskId,
  updatedParentFolderId,
  parentFolderId
) {
  const taskelement = document.getElementById(taskId);
  const deletedData = await checkTaskDeletion(taskId, parentFolderId);

  if (deletedData === null) {
    await reattachTaskToUpdatedFolder(
      taskelement,
      updatedParentFolderId,
      parentFolderId
    );
  } else {
    reattachTaskToParent(taskelement, parentFolderId);
  }
}

/**
 * Checks if a task has been deleted from the server.
 * @param {string} taskId - The ID of the task.
 * @param {string} parentFolderId - The ID of the parent folder.
 * @returns {Promise<Object|null>} The task data or null if deleted.
 */
async function checkTaskDeletion(taskId, parentFolderId) {
  const deletionCheck = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return await deletionCheck.json();
}

/**
 * Reattaches a task element to the updated folder in the DOM.
 * @param {HTMLElement} taskelement - The task element to reattach.
 * @param {string} updatedParentFolderId - The ID of the new parent folder.
 * @param {string} parentFolderId - The ID of the original parent folder.
 */
async function reattachTaskToUpdatedFolder(
  taskelement,
  updatedParentFolderId,
  parentFolderId
) {
  const targetContainer = document.getElementById(updatedParentFolderId);
  removeNoTasksMessage(targetContainer);
  reloadFolder(parentFolderId);

  targetContainer.appendChild(taskelement);
  taskelement.setAttribute("data-current-folder-id", updatedParentFolderId);
}

/**
 * Removes the "no tasks" message from the target container if it exists.
 * @param {HTMLElement} targetContainer - The container to check for the message.
 */
function removeNoTasksMessage(targetContainer) {
  const noTasksMessage = targetContainer.querySelector(".nothing");
  if (noTasksMessage) {
    noTasksMessage.remove();
  }
}

/**
 * Reattaches a task element to the parent folder in the DOM.
 * @param {HTMLElement} taskelement - The task element to reattach.
 * @param {string} parentFolderId - The ID of the parent folder.
 */
function reattachTaskToParent(taskelement, parentFolderId) {
  const parentContainer = document.getElementById(parentFolderId);
  parentContainer.appendChild(taskelement);
  taskelement.setAttribute("data-current-folder-id", parentFolderId);
}

/**
 * Changes the folder of a task to a previous parent folder and updates the folder structure.
 * @param {string} taskId - The ID of the task to move.
 * @param {string} parentFolderId - The ID of the current parent folder.
 * @param {Object} task - The task object.
 * @param {Event} event - The event triggering the folder change.
 */
async function changefolder1(taskId, parentFolderId, task, event) {
  const taskDataJson = await getTaskDataJson(taskId, parentFolderId);
  const updatedParentFolderId = backwardslogic(parentFolderId);

  await updateTaskInFolder(
    taskId,
    updatedParentFolderId,
    taskDataJson,
    parentFolderId
  );
  reloadFolder(updatedParentFolderId);
}

/**
 * Maps the current folder ID to the next folder ID in the forward logic.
 * @param {string} parentFolderId - The ID of the current folder.
 * @returns {string} The ID of the next folder.
 */
function forwardslogic(parentFolderId) {
  const folderMap = {
    "todo-folder": "inprogress-folder",
    "inprogress-folder": "awaiting-feedback-folder",
    "awaiting-feedback-folder": "done-folder",
  };
  return folderMap[parentFolderId] || parentFolderId;
}

/**
 * Maps the current folder ID to the previous folder ID in the backward logic.
 * @param {string} parentFolderId - The ID of the current folder.
 * @returns {string} The ID of the previous folder.
 */
function backwardslogic(parentFolderId) {
  const folderMap = {
    "inprogress-folder": "todo-folder",
    "awaiting-feedback-folder": "inprogress-folder",
    "done-folder": "awaiting-feedback-folder",
  };
  return folderMap[parentFolderId] || parentFolderId;
}
