/**
 * Saves changes made to the task by sending an update request to the server.
 * @param {Object} task - The task object containing all task details.
 */
async function savechanges(task) {
  const parentElement = document.getElementById(`${task.id}`).parentElement.id;

  // Extract current values from the UI
  const title = document.querySelector(".titleinputdesign").value;
  const description =
    document.querySelector(".description")?.children[1]?.value ||
    document.getElementById("descriptioninput")?.children[1]?.value;

  const duedate = document.getElementById("date1").value;

  // Create an object to store only the changed fields
  const changes = {};

  // Check for changes and add to the changes object
  if (title && title !== task.title) {
    changes.title = title;
  } else if (!title && task.title) {
    changes.title = task.title; // Add the current task title if no change
  }

  if (description === "") {
    changes.description = task.description;
  } else {
    changes.description = description; // Add the current task description if no change
  }

  if (duedate === "") {
    changes.duedate = task.duedate; // Add the current task due date if no change
  } else {
    changes.duedate = duedate;
  }

  if (selectedPriority === null) {
    changes.prio = task.prio;
  } else {
    changes.prio = selectedPriority; // Keep the original priority if no change
  }
  changes.category = task.category;
  if (asignedtousers.length === 0) {
    changes.asignedto = task.asignedto;
  } else {
    changes.asignedto = asignedtousers;
  }

  if (initialsArray.length === 0) {
    // If initials have changed or it's a new value
    changes.initials = task.initials;
  } else {
    changes.initials = initialsArray;
  }

  if (subtasks.length === 0) {
    changes.subtask = task.subtask; // Keep current subtasks if no change
  } else {
    changes.subtask = subtasks.map((subtask) => ({
      subtask: subtask,
      completed: false,
    }));
  }

  const response2 = await fetch(GLOBAL + "users/1/contacts.json");
  const contacts = await response2.json();

  // Include the category (if it must be sent unchanged)
  await putData(`/users/1/tasks/${parentElement}/${task.id}`, changes);

  // Reload the tasks and close the overlay
  await loadtasks();

  if (task.category === "User Story") {
    document.getElementById("overlayprofile-template").innerHTML = "";
    resetOverlayTemplate("overlayprofile-template", "profile-template.html");
    setTimeout(() => {
      inputacessprofile(task, contacts);
    }, 10);
  } else {
    document.getElementById("overlaytechinical-task-template").innerHTML = "";
    resetOverlayTemplate(
      "overlaytechinical-task-template",
      "techinical-task-template.html"
    );
    setTimeout(() => {
      inputacesstechnicall(changes, contacts);
    }, 10);
  }
}
