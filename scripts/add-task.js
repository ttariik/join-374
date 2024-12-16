/**
 * Global variables
 */
let users = []; // Array to hold user data.
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null; // Currently selected priority.
let subtasks = []; // Array for subtasks.
let initialsarra = []; // Array for user initials.
let selectedbutton = null; // Currently selected button.
let asignedtousers = []; // Assigned users.
let usernamecolor = []; // Array of colors for usernames.
let initialsArray = []; // Array for user initials.
let contacts = []; // Array to hold contact data.

/**
 * Resets the input fields of a form.
 */
function clearinputs() {
  document.getElementById("myform").reset();
  emptyinputs();
}

/**
 * Sends data to an API using a PUT request.
 * @param {string} [path=""] - The API endpoint path.
 * @param {Object} [data={}] - The data to be sent.
 * @returns {Promise<Object>} - The response from the API.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

/**
 * Resets the subtask input UI.
 */
function resetsubtaskinput() {
  subtaskiconsreset();
}

/**
 * Handles button clicks to select a priority.
 * @param {string} priority - The selected priority value.
 */
function handleButtonClick(priority) {
  selectedPriority = priority;
}

/**
 * Retrieves form data and user data from the API.
 * @returns {Promise<Object>} - The form data and user-related information.
 */
async function getFormData() {
  let duedate;
  const userResponse = await getAllUsers("users");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  if (document.getElementById("date").value === "") {
    duedate = document.getElementById("date2").value;
  } else {
    duedate = document.getElementById("date").value;
  }
  const category = document.getElementById("Category").value;
  const UserKeyArray = Object.keys(userResponse);

  return { title, description, duedate, category, UserKeyArray, userResponse };
}

/**
 * Creates an array of users from the given user keys and responses.
 * @param {Array<string>} UserKeyArray - An array of user keys.
 * @param {Object} userResponse - The response data containing user information.
 * @returns {Array<Object>} - An array of user objects.
 */
function createUsersArray(UserKeyArray, userResponse) {
  const users = [];
  for (let index = 0; index < UserKeyArray.length; index++) {
    users.push({
      id: UserKeyArray[index],
      user: userResponse[UserKeyArray[index]],
    });
  }
  return users;
}

/**
 * Prepares task data for submission.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} duedate - The due date of the task.
 * @param {string} category - The category of the task.
 * @param {Array<Object>} users - The array of users assigned to the task.
 * @returns {Object} - The prepared task data object.
 */
function prepareTaskData(title, description, duedate, category, users) {
  // Prepare the task data object
  const taskData = {
    title,
    description,
    asignedto: asignedtousers, // Ensure this variable is defined elsewhere
    prio: selectedPriority, // Ensure this variable is defined elsewhere
    duedate,
    category,
    initials: initialsArray, // Ensure this variable is defined elsewhere
    // Ensure subtasks are included, even if empty, as an empty array
    subtask:
      subtasks.length > 0
        ? subtasks.map((subtask) => ({
            subtask,
            completed: false,
          }))
        : [], // Return an empty array if no subtasks
  };

  return taskData;
}

/**
 * Submits the task data to the appropriate folder based on the selected button.
 * @param {Object} taskData - The task data to be submitted.
 * @returns {Promise<void>} - A promise that resolves when the task is submitted.
 */
async function submitTask(taskData) {
  if (selectedbutton === null) {
    await addEditSingleUser("todo-folder", taskData);
  } else if (selectedbutton === "buttonicon1") {
    await addEditSingleUser("todo-folder", taskData);
  } else if (selectedbutton === "buttonicon2") {
    await addEditSingleUser("inprogress-folder", taskData);
  } else if (selectedbutton === "buttonicon3") {
    await addEditSingleUser("awaiting-feedback-folder", taskData);
  }
}

/**
 * Handles the task addition process.
 * @param {Event} event - The event triggered by the form submission.
 * @returns {Promise<void>} - A promise that resolves when the task is added.
 */
async function addtask(event) {
  event.preventDefault();
  if (validateTaskForm()) {
    const {
      title,
      description,
      duedate,
      category,
      UserKeyArray,
      userResponse,
    } = await getFormData();
    const users = createUsersArray(UserKeyArray, userResponse);
    const taskData = prepareTaskData(
      title,
      description,
      duedate,
      category,
      users
    );
    closing(taskData);
  }
}

/**
 * Handles task submission, input resetting, and redirects after successful task creation.
 * @param {Object} taskData - The task data to be processed.
 * @returns {Promise<void>} - A promise that resolves when all operations are complete.
 */
async function closing(taskData) {
  await submitTask(taskData);
  emptyinputs();
  showsuccesstaskmessage();
  const currentPage = window.location.pathname; // Get current page path
  setTimeout(() => {
    if (currentPage.includes("add-task.html")) {
      window.location.href = "board.html";
    }
  }, 1500);
  if (currentPage.includes("board.html")) {
    closeaddtasktemplate();
    loadtasks();
  }
}

/**
 * Displays a success message after a task is successfully created.
 */
function showsuccesstaskmessage() {
  if (document.getElementById("overlaysuccesstaskprofile")) {
    part1successmessage();
  } else {
    document.getElementById("overlaysuccesstask").classList.add("overlay");
    document.getElementById("overlaysuccesstask").style.transform =
      "translateX(0)";
    document.getElementById("overlaysuccesstask").innerHTML =
      sucsessfullycreatedtasktemplate();
    setTimeout(() => {
      document.getElementById("overlaysuccesstask").style.transform =
        "translateX(250%)";
    }, 1500);
  }
}

/**
 * Displays a success message for the profile-specific success overlay.
 */
function part1successmessage() {
  document.getElementById("overlaysuccesstaskprofile").classList.add("overlay");
  document.getElementById("overlaysuccesstaskprofile").style.transform =
    "translateX(0)";
  document.getElementById("overlaysuccesstaskprofile").innerHTML =
    sucsessfullycreatedtasktemplate();
  setTimeout(() => {
    document.getElementById("overlaysuccesstaskprofile").style.transform =
      "translateX(250%)";
  }, 1500);
}

/**
 * Returns the HTML template for a success message after a task is added.
 * @returns {string} - The HTML string for the success message.
 */
function sucsessfullycreatedtasktemplate() {
  return /*html*/ `
    <div class="successdesign">
      <div class="successoverlay"><span class="successdesign_span">Task added to board</span><img src="/img/board.png" alt=""></div>
    </div>   
`;
}

/**
 * Resets the form inputs and clears dynamic content.
 */
function resetForm() {
  let form = document.querySelector("form");
  form.reset();
  document.getElementById("assignedusers").innerHTML = "";
  document.getElementById("subtasksbox").innerHTML = "";
  document.getElementById("selectedcategory").removeAttribute("data-value");
  document.getElementById("selectedcategory").innerHTML =
    "Select Task Category";
}

/**
 * Resets button styles to their default state.
 */
function resetButtons() {
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button2").classList.add("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");
}

/**
 * Resets priority-related images to their default state.
 */
function resetPriorityImages() {
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/medium-white.png";
  document.getElementById("lowImg").src = "/img/Low.png";
}

/**
 * Resets priority colors and clears associated arrays and styles.
 */
function resetPriorityColors() {
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "white";
  document.getElementById("low").style.color = "black";
  asignedtousers = [];
  subtasks = [];
  initialsArray = [];
  document.querySelector(".subtasksbox1").style = "";
}

/**
 * Clears the contacts box content and resets the select button behavior.
 */
function clearContactsBox() {
  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box1").innerHTML = "";
    document.getElementById("selectbutton1").onclick = showcontacts;
  } else {
    document.getElementById("contacts-box").innerHTML = "";
    document.getElementById("selectbutton").onclick = showcontacts;
  }
}

/**
 * Clears all input fields and resets dynamic UI elements.
 */
function emptyinputs() {
  resetForm();
  resetButtons();
  resetPriorityImages();
  resetPriorityColors();
  clearContactsBox();
  clearerrorspans();
}

/**
 * Clears error message spans on the form.
 */
function clearerrorspans() {
  document
    .querySelectorAll(
      "#spantitle, #spandescription, #spantasignedbox, #spandate, #spanprio, #spancategory, #spansubtask"
    )
    .forEach((element) => {
      element.innerHTML = ""; // Clear the content of each element
    });
}

/**
 * Adds or edits a single user task in the specified folder.
 * @param {string} folder - The folder where the task should be stored.
 * @param {Object} taskData - The task data to be stored.
 * @returns {Promise<void>} - A promise that resolves when the task is saved.
 */
async function addEditSingleUser(folder, taskData) {
  let usertasks = await getUserTasks(); // Fetch all tasks
  let highestIndex = await calculateHighestIndex(usertasks, 0);
  const nextIndex = highestIndex + 1;
  await putData(`users/1/tasks/${folder}/${nextIndex}`, taskData);
}

/**
 * Calculates the highest task index from a collection of folder tasks.
 * @param {Object} folderTasks - The tasks grouped by folder.
 * @param {number} highestIndex - The current highest index.
 * @returns {Promise<number>} - A promise that resolves to the highest index found.
 */
async function calculateHighestIndex(folderTasks, highestIndex) {
  for (let folder in folderTasks) {
    const tasks = folderTasks[folder];
    if (Array.isArray(tasks)) {
      highestIndex = await calculateArrayTasks(tasks, highestIndex);
    } else {
      highestIndex = await calculateObjectTasks(tasks, highestIndex);
    }
  }
  return highestIndex;
}

/**
 * Calculates the highest task index from an array of tasks.
 * @param {Array} tasks - The array of tasks.
 * @param {number} highestIndex - The current highest index.
 * @returns {Promise<number>} - A promise that resolves to the highest index found.
 */
async function calculateArrayTasks(tasks, highestIndex) {
  tasks.forEach((task, index) => {
    if (task !== null) {
      highestIndex = Math.max(highestIndex, index);
    }
  });
  return highestIndex;
}

/**
 * Calculates the highest task index from an object of tasks.
 * @param {Object} tasks - The tasks object.
 * @param {number} highestIndex - The current highest index.
 * @returns {Promise<number>} - A promise that resolves to the highest index found.
 */
async function calculateObjectTasks(tasks, highestIndex) {
  Object.keys(tasks).forEach((taskId) => {
    const numId = parseInt(taskId, 10);
    if (!isNaN(numId)) {
      highestIndex = Math.max(highestIndex, numId);
    }
  });
  return highestIndex;
}

/**
 * Fetches all tasks for a specific user.
 * @returns {Promise<Object>} - A promise that resolves to the user's tasks.
 */
async function getUserTasks() {
  let response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

/**
 * Fetches all users from the database.
 * @param {string} path - The path to the user data in the database.
 * @returns {Promise<Object>} - A promise that resolves to the user data.
 */
async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

/**
 * Changes the icons displayed for subtasks based on the current state.
 */
function subtaskchangeicons() {
  if (
    document.querySelector("#inputsubtask11, #inputsubtask22, #inputsubtask33")
  ) {
    document.getElementById("inputsubtask11").classList.add("d-none");
    document.getElementById("inputsubtask22").classList.remove("d-none");
    document.getElementById("inputsubtask33").classList.remove("d-none");
    document.getElementById("seperate1").classList.remove("d-none");
  } else {
    document.getElementById("inputsubtask1").classList.add("d-none");
    document.getElementById("inputsubtask2").classList.remove("d-none");
    document.getElementById("inputsubtask3").classList.remove("d-none");
    document.getElementById("seperate").classList.remove("d-none");
  }
}

/**
 * Resets subtask icons to their default state.
 */
function subtaskiconsreset() {
  if (
    document.querySelector("#inputsubtask11, #inputsubtask22, #inputsubtask33")
  ) {
    document.getElementById("inputsubtask11").classList.remove("d-none");
    document.getElementById("inputsubtask22").classList.add("d-none");
    document.getElementById("inputsubtask33").classList.add("d-none");
    document.getElementById("seperate1").classList.add("d-none");
    document.getElementById("subtaskinput0").value = "";
  } else {
    document.getElementById("inputsubtask1").classList.remove("d-none");
    document.getElementById("inputsubtask2").classList.add("d-none");
    document.getElementById("inputsubtask3").classList.add("d-none");
    document.getElementById("seperate").classList.add("d-none");
    document.getElementById("subtaskinput").value = "";
  }
}

/**
 * Hides the edit and save buttons for a specific subtask.
 * @param {number} index - The index of the subtask.
 */
function hidesubeditbuttons(index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.add("d-none"));
  }
}

/**
 * Resets the subtask input field and clears the subtask box.
 */
function resetsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  subtaskinput1.value = "";
  document.getElementById("subtasksbox").innerHTML = "";
}

/**
 * Deletes a specific subtask by index and updates the UI.
 * @param {number} index - The index of the subtask to delete.
 */
function deletesub(index) {
  const subtaskElement = document.getElementById(`sub${index}`);
  if (subtaskElement) {
    const result = subtaskElement.innerHTML.trim();
  }
  subtasks.splice(index - 1, 1);
  const subtaskContainer = document.getElementById(`subboxinput_${index}`);
  if (subtaskContainer) {
    subtaskContainer.remove();
  }
}

/**
 * Retrieves subtask input elements and resets their styles.
 * @param {number} index - The index of the subtask.
 * @returns {Promise<Object>} - A promise resolving to the input elements and buttons.
 */
async function savesubinputs(index) {
  const subboxInput = document.getElementById(`subboxinput_${index}`);
  const inputField = document.getElementById(`inputsub${index}`);
  const editButton = document.getElementById(`editsub${index}`);
  const deleteButton = document.getElementById(`deletesub${index}`);
  const saveButton = document.getElementById(`savesub${index}`);
  subboxInput.style.background = "";
  return { subboxInput, inputField, editButton, deleteButton, saveButton };
}

/**
 * Saves a specific subtask after retrieving and updating its input field.
 * @param {number} index - The index of the subtask.
 * @returns {Promise<void>} - A promise that resolves after saving the subtask.
 */
async function savesub(index) {
  const { subboxInput, inputField, editButton, deleteButton, saveButton } =
    await savesubinputs(index);
  if (editButton) editButton.classList.add("d-none");
  if (deleteButton) deleteButton.classList.add("d-none");
  if (saveButton) saveButton.classList.add("d-none");
  if (!inputField) {
    return;
  }
  savedinput(inputField, index, subboxInput);
}

/**
 * Processes and updates the subtask content in the UI.
 * @param {HTMLElement} inputField - The input field for the subtask.
 * @param {number} index - The index of the subtask.
 * @param {HTMLElement} subboxInput - The subtask container.
 * @returns {string|undefined} - The trimmed value of the input field or undefined if empty.
 */
function savedinput(inputField, index, subboxInput) {
  const result = inputField?.value.trim();
  if (result) {
    subtasks[index - 1] = result;
    subboxInput.innerHTML = subtaskstemplAte(index, result);
    subtaskiconseventlisteners(index);
    inputField.focus();
    return result;
  }
}

/**
 * Adds event listeners to subtask action buttons.
 * @param {number} index - The index of the subtask.
 */
function subtaskiconseventlisteners(index) {
  document
    .getElementById(`savesub${index}`)
    .addEventListener("click", function () {
      const inputElement = document.getElementById(`inputsub${index}`);
      if (inputElement.value === "") {
        displayError("spanplace", "You must write something in order to save");
        return;
      } else {
        savesub(index);
      }
    });
  document
    .getElementById(`editsub${index}`)
    .addEventListener("click", function () {
      editsubtask(index);
    });
  document
    .getElementById(`deletesub${index}`)
    .addEventListener("click", function () {
      deletesub(index);
    });
}

/**
 * Adjusts the position and display of contact boxes in the UI.
 */
function smallerfunction() {
  const contactsBox1 = document.getElementById("contacts-box1");
  const contactsBox = document.getElementById("contacts-box");

  if (contactsBox1) {
    contactsBox1.style.display = "flex";
    contactsBox1.style.top = "34%";
    contactsBox1.style.left = "-5px";
  } else if (contactsBox) {
    contactsBox.style.display = "flex";
  }
}

/**
 * Initializes event listeners and dynamic UI adjustments after the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const requiredmessage = document.getElementById("requiredmessage");
  const parent = document.getElementById("parent");
  const spanplace = document.getElementById("spanplace");

  if (requiredmessage && parent && spanplace) {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 400) {
        spanplace.appendChild(requiredmessage);
      } else {
        parent.insertBefore(requiredmessage, parent.firstChild);
      }
    });
  }
});
