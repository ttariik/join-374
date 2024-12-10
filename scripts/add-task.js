let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null;
let subtasks = [];
let initialsarra = [];
let selectedbutton = null;
let asignedtousers = [];
let usernamecolor = [];
let initialsArray = [];
let contacts = []; // Array to hold the contact data.

function clearinputs() {
  document.getElementById("myform").reset();
  emptyinputs();
}

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

function resetsubtaskinput() {
  subtaskiconsreset();
}

function handleButtonClick(priority) {
  selectedPriority = priority;
}

async function getFormData() {
  const userResponse = await getAllUsers("users");
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const duedate = document.getElementById("date").value;
  const category = document.getElementById("Category").value;
  const UserKeyArray = Object.keys(userResponse);

  return { title, description, duedate, category, UserKeyArray, userResponse };
}

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
}

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

function sucsessfullycreatedtasktemplate() {
  return /*html*/ `
    <div class="successdesign">
      <div class="successoverlay"><span class="successdesign_span">Task added to board</span><img src="/img/board.png" alt=""></div>
    </div>   
`;
}

function resetForm() {
  let form = document.querySelector("form");
  form.reset();
  document.getElementById("assignedusers").innerHTML = "";
  document.getElementById("subtasksbox").innerHTML = "";
}

function resetButtons() {
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button2").classList.add("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");
}

function resetPriorityImages() {
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/medium-white.png";
  document.getElementById("lowImg").src = "/img/Low.png";
}

function resetPriorityColors() {
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "white";
  document.getElementById("low").style.color = "black";
  asignedtousers = [];
  subtasks = [];
  initialsArray = [];
}

function clearContactsBox() {
  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box1").innerHTML = "";
    document.getElementById("selectbutton1").onclick = showcontacts;
  } else {
    document.getElementById("contacts-box").innerHTML = "";
    document.getElementById("selectbutton").onclick = showcontacts;
  }
}

function emptyinputs() {
  resetForm();
  resetButtons();
  resetPriorityImages();
  resetPriorityColors();
  clearContactsBox();
}

async function addEditSingleUser(folder, taskData) {
  let usertasks = await getUserTasks(); // Fetch all tasks
  let highestIndex = await calculateHighestIndex(usertasks, 0);
  const nextIndex = highestIndex + 1;
  await putData(`users/1/tasks/${folder}/${nextIndex}`, taskData);
}

async function calculateHighestIndex(folderTasks, highestIndex) {
  // Loop over each folder
  for (let folder in folderTasks) {
    const tasks = folderTasks[folder];

    // Check if the folder is an array or an object
    if (Array.isArray(tasks)) {
      highestIndex = await calculateArrayTasks(tasks, highestIndex);
    } else {
      highestIndex = await calculateObjectTasks(tasks, highestIndex);
    }
  }
  return highestIndex;
}

async function calculateArrayTasks(tasks, highestIndex) {
  // If it's an array, filter out null values
  tasks.forEach((task, index) => {
    if (task !== null) {
      highestIndex = Math.max(highestIndex, index);
    }
  });
  return highestIndex;
}

async function calculateObjectTasks(tasks, highestIndex) {
  // If it's an object (as in "inprogress-folder" and "todofolder")
  Object.keys(tasks).forEach((taskId) => {
    const numId = parseInt(taskId, 10);
    if (!isNaN(numId)) {
      highestIndex = Math.max(highestIndex, numId);
    }
  });
  return highestIndex;
}

async function getUserTasks() {
  let response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

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

function hidesubeditbuttons(index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.add("d-none"));
  }
}

function resetsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  subtaskinput1.value = "";
  document.getElementById("subtasksbox").innerHTML = "";
}

function deletesub(index) {
  const subtaskElement = document.getElementById(`sub${index}`);
  if (subtaskElement) {
    const result = subtaskElement.innerHTML.trim();
  }

  subtasks.splice(index - 1, 1);

  const subtaskContainer = document.getElementById(`subboxinput_${index}`);
  if (subtaskContainer) {
    subtaskContainer.remove();
  } else {
  }
}

function savesub(index) {
  // Get references to relevant elements
  const subboxInput = document.getElementById(`subboxinput_${index}`);
  const inputField = document.getElementById(`inputsub${index}`);
  const editButton = document.getElementById(`editsub${index}`);
  const deleteButton = document.getElementById(`deletesub${index}`);
  const saveButton = document.getElementById(`savesub${index}`);

  // Reset the background style of the subtask container
  subboxInput.style.background = "";

  // Hide buttons for editing, deleting, and saving
  if (editButton) editButton.classList.add("d-none");
  if (deleteButton) deleteButton.classList.add("d-none");
  if (saveButton) saveButton.classList.add("d-none");
  if (!inputField) {
    return;
  }
  // Validate and retrieve input value
  const result = inputField?.value.trim();
  if (result) {
    // Update the subtasks array with the new value
    subtasks[index - 1] = result;

    // Replace the input field with a subtask template
    subboxInput.innerHTML = subtaskstemplAte(index, result);

    // Reapply event listeners for hover effects and button operations
    subtaskiconseventlisteners(index);
    mouseroveroperations2(index);
    inputField.focus(); // Refocus the input field for correction

    return result; // Return the updated value
  } else {
    // Handle empty input (optional, based on requirements)
    alert("Subtask cannot be empty.");
  }
}

function subtaskiconseventlisteners(index) {
  document
    .getElementById(`savesub${index}`)
    .addEventListener("click", function () {
      savesub(index);
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
