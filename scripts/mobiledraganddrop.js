async function changefolder(taskId, parentFolderId, task, event) {
  event.stopPropagation();
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

async function getTaskDataJson(taskId, parentFolderId) {
  const taskData = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return await taskData.json();
}

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

async function checkTaskDeletion(taskId, parentFolderId) {
  const deletionCheck = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  return await deletionCheck.json();
}

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

function removeNoTasksMessage(targetContainer) {
  const noTasksMessage = targetContainer.querySelector(".nothing");
  if (noTasksMessage) {
    noTasksMessage.remove();
  }
}

function reattachTaskToParent(taskelement, parentFolderId) {
  const parentContainer = document.getElementById(parentFolderId);
  parentContainer.appendChild(taskelement);
  taskelement.setAttribute("data-current-folder-id", parentFolderId);
}

async function changefolder1(taskId, parentFolderId, task, event) {
  event.stopPropagation();
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

function forwardslogic(parentFolderId) {
  const folderMap = {
    "todo-folder": "inprogress-folder",
    "inprogress-folder": "awaiting-feedback-folder",
    "awaiting-feedback-folder": "done-folder",
  };
  return folderMap[parentFolderId] || parentFolderId;
}

function backwardslogic(parentFolderId) {
  const folderMap = {
    "inprogress-folder": "todo-folder",
    "awaiting-feedback-folder": "inprogress-folder",
    "done-folder": "awaiting-feedback-folder",
  };
  return folderMap[parentFolderId] || parentFolderId;
}
