/**
 * Closes the profile template overlay.
 */
async function closeoverlayprofiletemplate() {
  asignedtousers = [];
  initialsArray = [];
  subtasks = [];
  if (document.getElementById("assignedusers1")) {
    document.getElementById("assignedusers1").innerHTML = "";
  }
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("overlayprofile-template").classList.add("d-none");
    document
      .getElementById("overlayprofile-template")
      .classList.remove("overlayss");
  }, 400);
}

/**
 * Closes the technical task template overlay.
 */
async function closeoverlaytechnicaltemplate() {
  document.querySelector(".overlayss").style = "transform: translateX(250%);";
  subtasks = [];
  setTimeout(() => {
    document
      .getElementById("overlaytechinical-task-template")
      .classList.add("d-none");
    document
      .getElementById("overlaytechinical-task-template")
      .classList.remove("overlayss");
  }, 400);
}

/**
 * Opens the "Add Task" template overlay.
 */
async function calladdtasktemplate() {
  document.getElementById("overlay-addtask").classList.remove("d-none");
  document.getElementById("overlay-addtask").classList.add("overlayss");
  styleofthebuttons();
  setTimeout(() => {
    document.getElementById("overlay-addtask").style.transform =
      "translateX(0%)";
  }, 100);
}

/**
 * Styles the buttons in the add task template.
 */
function styleofthebuttons() {
  document.getElementById("button1").style.maxWidth = "136px";
  document.getElementById("button2").style.maxWidth = "136px";
  document.getElementById("button3").style.maxWidth = "136px";
  document.getElementById("button1").style.height = "56px";
  document.getElementById("button2").style.height = "56px";
  document.getElementById("button3").style.height = "56px";
}

/**
 * Adds hover effect to buttons, changing the image source on hover.
 *
 * @param {string} buttonId - The ID of the button to apply the hover effect to.
 * @param {string} imageId - The ID of the image element to change on hover.
 * @param {string} hoverSrc - The source URL for the hover image.
 */
function applyHoverEffect(buttonId, imageId, hoverSrc) {
  const buttonElement = document.getElementById(buttonId);
  const imageElement = document.getElementById(imageId);
  buttonElement.addEventListener("mouseover", function () {
    imageElement.src = hoverSrc;
  });
  buttonElement.addEventListener("mouseout", function () {
    imageElement.src = "/img/status-item.png";
  });
  buttonElement.addEventListener("click", function (event) {
    calladdtasktemplate();
    selectedbutton = buttonElement.id;
  });
}

/**
 * Changes the status of a subtask and updates the server.
 *
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {number} subtaskIndex - The index of the subtask whose status is changing.
 * @param {boolean} status - The new status of the subtask (true for completed, false for not completed).
 * @param {Event} event - The event that triggered the status change.
 */
async function changestatus(taskId, subtaskIndex, status, event) {
  try {
    const taskElement = document.getElementById(taskId);
    const parentFolderId = taskElement.parentElement.id;
    const response = await fetch(
      `${GLOBAL}users/1/tasks/${parentFolderId}/${taskId}.json`
    );
    const taskData = await response.json();
    const subtask = taskData.subtask[subtaskIndex];
    if (subtask) {
      subtask.completed = !subtask.completed;
      await putData(`users/1/tasks/${parentFolderId}/${taskId}`, taskData);
    }
    loadtasks(taskId, parentFolderId);
  } catch (error) {}
}

/**
 * Applies a hover effect to a button and changes the image source on hover.
 *
 * @param {string} buttonId - The ID of the button to apply the hover effect to.
 * @param {string} imageId - The ID of the image element to change on hover.
 * @param {string} hoverSrc - The source URL for the hover image.
 */
applyHoverEffect("buttonicon1", "pic1", "/img/pic1hovered.png");
applyHoverEffect("buttonicon2", "pic2", "/img/pic1hovered.png");
applyHoverEffect("buttonicon3", "pic3", "/img/pic1hovered.png");

/**
 * Adds an event listener to the "drop" event on the "todo-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document.getElementById("todo-folder").addEventListener("drop", drop);

/**
 * Adds an event listener to the "drop" event on the "inprogress-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document.getElementById("inprogress-folder").addEventListener("drop", drop);

/**
 * Adds an event listener to the "drop" event on the "awaiting-feedback-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("drop", drop);

/**
 * Adds an event listener to the "drop" event on the "done-folder" element.
 * When a task is dropped, the drop function will be triggered.
 */
document.getElementById("done-folder").addEventListener("drop", drop);

/**
 * Adds an event listener to the "dragover" event on the "todo-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document.getElementById("todo-folder").addEventListener("dragover", allowDrop);

/**
 * Adds an event listener to the "dragover" event on the "inprogress-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document
  .getElementById("inprogress-folder")
  .addEventListener("dragover", allowDrop);

/**
 * Adds an event listener to the "dragover" event on the "awaiting-feedback-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document
  .getElementById("awaiting-feedback-folder")
  .addEventListener("dragover", allowDrop);

/**
 * Adds an event listener to the "dragover" event on the "done-folder" element.
 * This allows tasks to be dragged over the folder.
 */
document.getElementById("done-folder").addEventListener("dragover", allowDrop);

document
  .getElementById("add-tasktemplate")
  .addEventListener("click", function () {
    calladdtasktemplate();
  });
