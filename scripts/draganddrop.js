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

  // If drop is canceled or not valid, revert to the initial folder (no changes)
  if (targetFolder === parentFolderId) {
    return;
  }

  try {
    // Disable dragging during the operation
    taskElement.setAttribute("draggable", "false");

    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();

    // Move task data to the new folder
    await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);

    // Delete task from the old folder
    await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);

    // Check if the task is successfully deleted from the original folder
    const deletionCheck = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const deletedData = await deletionCheck.json();

    if (deletedData === null) {
      // If task is successfully deleted from the parent folder, update the task
      const targetContainer = document.getElementById(targetFolder);

      // Remove "No tasks" message from the target folder if it was there
      const noTasksMessage = targetContainer.querySelector(".nothing");
      if (noTasksMessage) {
        noTasksMessage.remove();
      }

      // Move the task element to the new folder in the DOM
      targetContainer.appendChild(taskElement);
      taskElement.setAttribute("data-current-folder-id", targetFolder);
    } else {
      // If deletion failed, revert the task back to the original folder
      const parentContainer = document.getElementById(parentFolderId);
      parentContainer.appendChild(taskElement);
      taskElement.setAttribute("data-current-folder-id", initialFolderId);

      // Show a message or alert that the move failed
      alert("Failed to move task. Reverting to original folder.");
    }

    // Update source folder (if empty, show 'No tasks' message)
    const parentContainer = document.getElementById(parentFolderId);
    if (parentContainer && parentContainer.children.length === 0) {
      const noTasksMessageElement = document.createElement("div");
      noTasksMessageElement.className = "nothing";
      noTasksMessageElement.textContent = getNoTasksMessage(parentFolderId);
      parentContainer.appendChild(noTasksMessageElement);
    }
  } catch (error) {
    console.error("Error during drop operation:", error);

    // In case of an error, revert the task back to the original folder
    const parentContainer = document.getElementById(parentFolderId);
    parentContainer.appendChild(taskElement);
    taskElement.setAttribute("data-current-folder-id", initialFolderId);

    alert(
      "An error occurred during the move. Task reverted to original folder."
    );
  } finally {
    // Enable dragging again after operation completes (success or failure)
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
