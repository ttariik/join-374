function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  const taskId = event.target.id;
  const taskElement = document.getElementById(taskId);
  const current = event.currentTarget;
  console.log(current);

  const parentFolderId = taskElement.getAttribute("data-current-folder-id");
  document.querySelectorAll(".folder").forEach((folder) => {
    folder.addEventListener("dragenter", dragenter);
    folder.addEventListener("dragleave", dragleave);
  });
  event.dataTransfer.setData("taskId", taskId);
  event.dataTransfer.setData("parentFolderId", parentFolderId);
  // Add a placeholder to the folder you are dragging over
}

function dragenter(event) {
  const targetFolder = event.currentTarget;

  // Check if the "nothing2" div already exists (but we're not adding it to the DOM)
  let nothingDiv = targetFolder.querySelector(".nothing2");

  if (!nothingDiv) {
    // If it doesn't exist, we add a temporary "nothing2" class for visual effect
    nothingDiv = document.createElement("div");
    nothingDiv.className = "nothing2";
    nothingDiv.style.position = "absolute"; // Position it on top of the folder
    nothingDiv.style.zIndex = "-99999"; // Ensure it's visible on top of other content
    nothingDiv.style.padding = "10px"; // Optional: Style the message
    nothingDiv.style.display = "block"; // Ensure it's visible
    targetFolder.appendChild(nothingDiv); // Show it visually but not in the DOM
  }

  let messagediv = targetFolder.querySelector(".nothing");
  if (messagediv) {
    messagediv.remove();
  }

  // Optionally, you could change the style to indicate a valid drop area (like changing color)
  nothingDiv.style.display = "block"; // Show the div when dragging over
}

function dragleave(event) {
  const targetFolder = event.currentTarget;

  // Remove the "nothing2" div if it exists
  const nothingDiv = targetFolder.querySelector(".nothing2");
  if (nothingDiv) {
    nothingDiv.remove();
  }

  // Check if the folder is empty and if the "nothing" message isn't already displayed
  let messagediv = targetFolder.querySelector(".nothing");
  if (!messagediv && targetFolder.children.length === 0) {
    // Create and display the "nothing" message
    messagediv = document.createElement("div");
    messagediv.className = "nothing";
    messagediv.textContent = getNoTasksMessage(targetFolder.id); // Call your function to get the message
    targetFolder.appendChild(messagediv);
  }
}

async function drop(event) {
  event.preventDefault();

  const taskId = event.dataTransfer.getData("taskId");
  const taskElement = document.getElementById(taskId);
  const parentFolderId = taskElement.parentElement.id;
  const targetFolder = event.currentTarget.id;

  // Ensure we don't try to drop in the same folder
  if (parentFolderId === targetFolder) {
    return;
  }
  const removedmessage = event.currentTarget;
  const removedmessagediv = removedmessage.querySelector(".nothing2");
  if (removedmessagediv) {
    removedmessagediv.remove();
  }
  try {
    // Disable dragging during the operation
    taskElement.setAttribute("draggable", "false");

    // Get the target container to append the task to
    const targetContainer = document.getElementById(targetFolder);

    // Fetch the task data
    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();

    // Move the task data to the new folder
    await putData(`users/1/tasks/${targetFolder}/${taskId}`, taskData);
    await deleteData(`users/1/tasks/${parentFolderId}/${taskId}`);

    // Check if the task was successfully deleted from the original folder
    const deletionCheck = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const deletedData = await deletionCheck.json();

    if (deletedData === null) {
      // If task is deleted, update the target folder DOM
      // Remove "No tasks" message from the target folder if it exists
      const noTasksMessage = targetContainer.querySelector(".nothing");
      if (noTasksMessage) {
        noTasksMessage.remove();
      }

      // Move the task element to the target folder
      targetContainer.appendChild(taskElement);
      taskElement.setAttribute("data-current-folder-id", targetFolder);
    } else {
      // If deletion failed, revert the task back to the original folder
      const parentContainer = document.getElementById(parentFolderId);
      parentContainer.appendChild(taskElement);
      taskElement.setAttribute("data-current-folder-id", parentFolderId);

      // Show a message or alert that the move failed
      alert("Failed to move task. Reverting to original folder.");
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
