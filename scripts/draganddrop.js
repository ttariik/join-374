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

  if (parentFolderId === targetFolder) {
    return;
  }

  try {
    taskElement.setAttribute("draggable", "false");

    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();
    await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);
    await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);
    const deletionCheck = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const deletedData = await deletionCheck.json();

    if (deletedData !== null) {
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
