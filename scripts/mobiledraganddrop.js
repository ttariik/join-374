async function changefolder(taskId, parentFolderId, task, event) {
  event.stopPropagation();
  const taskData = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  const taskelement = document.getElementById(taskId);

  const taskDataJson = await taskData.json();
  const updatedParentFolderId = forwardslogic(parentFolderId);
  await putData(
    `users/1/tasks/${updatedParentFolderId}/${taskId}`,
    taskDataJson
  );
  reloadFolder(updatedParentFolderId);

  await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);
  const deletionCheck = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  const deletedData = await deletionCheck.json();
  if (deletedData === null) {
    const targetContainer = document.getElementById(updatedParentFolderId);
    const noTasksMessage = targetContainer.querySelector(".nothing");
    if (noTasksMessage) {
      noTasksMessage.remove();
    }
    reloadFolder(parentFolderId);

    targetContainer.appendChild(taskelement);
    taskelement.setAttribute("data-current-folder-id", updatedParentFolderId);
  } else {
    const parentContainer = document.getElementById(parentFolderId);
    parentContainer.appendChild(taskelement);
    taskelement.setAttribute("data-current-folder-id", parentFolderId);
  }
}

function forwardslogic(parentFolderId) {
  if (parentFolderId === "todo-folder") {
    return "inprogress-folder";
  } else if (parentFolderId === "inprogress-folder") {
    return "awaiting-feedback-folder";
  } else if (parentFolderId === "awaiting-feedback-folder") {
    return "done-folder";
  }
}

function backwardslogic(parentFolderId) {
  if (parentFolderId === "inprogress-folder") {
    return "todo-folder";
  } else if (parentFolderId === "awaiting-feedback-folder") {
    return "inprogress-folder";
  } else if (parentFolderId === "done-folder") {
    return "awaiting-feedback-folder";
  }
}

async function changefolder1(taskId, parentFolderId, task, event) {
  event.stopPropagation();
  const taskData = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  const taskelement = document.getElementById(taskId);

  const taskDataJson = await taskData.json();
  const updatedParentFolderId = backwardslogic(parentFolderId, taskId);

  await putData(
    `users/1/tasks/${updatedParentFolderId}/${taskId}`,
    taskDataJson
  );
  reloadFolder(updatedParentFolderId);

  await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);

  const deletionCheck = await fetch(
    `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
  );
  const deletedData = await deletionCheck.json();

  // Check if deletedData is null or not, handle accordingly
  if (deletedData === null) {
    const targetContainer = document.getElementById(updatedParentFolderId);

    // Ensure targetContainer exists before proceeding
    if (targetContainer) {
      const noTasksMessage = targetContainer.querySelector(".nothing");
      if (noTasksMessage) {
        noTasksMessage.remove();
      }
      reloadFolder(parentFolderId);

      targetContainer.appendChild(taskelement);
      taskelement.setAttribute("data-current-folder-id", updatedParentFolderId);
    } else {
    }
  } else {
    const parentContainer = document.getElementById(parentFolderId);

    // Ensure parentContainer exists before proceeding
    if (parentContainer) {
      parentContainer.appendChild(taskelement);
      taskelement.setAttribute("data-current-folder-id", parentFolderId);
    } else {
    }
  }
  loadtasks();
}
