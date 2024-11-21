let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null;
let subtasks = [];
let initialsarra = [];
let asignedtousers = [];
let usernamecolor = [];
let initialsArray = [];

function selectbutton_1() {
  document.getElementById("button1").classList.toggle("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");

  const urgentImg = document.getElementById("urgentImg");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";

  const urgentText = document.getElementById("urgent");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";
  selectedPriority = "Urgent"; // Set priority to "Urgent"
}

function selectbutton_2() {
  document.getElementById("button2").classList.toggle("lightorange");
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button3").classList.remove("lightgreen");

  const mediumImg = document.getElementById("mediumImg");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";

  const mediumText = document.getElementById("medium");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("low").style.color = "black";
  selectedPriority = "Medium"; // Set priority to "Urgent"
}

function selectbutton_3() {
  document.getElementById("button3").classList.toggle("lightgreen");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightred");

  const lowImg = document.getElementById("lowImg");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";

  const lowText = document.getElementById("low");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
  selectedPriority = "Low"; // Set priority to "Urgent"
}

function clearinputs() {
  document.getElementById("myform").reset();
  emptyinputs();
}

function resetsubtaskinput() {
  subtaskiconsreset();
}

function handleButtonClick(priority) {
  selectedPriority = priority;
}

function checkAddTaskInputs() {
  // Get input values
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("date").value.trim();
  const category = document.getElementById("Category").value;
  const assignedUsers =
    document.getElementById("assignedusers").children.length;
  const subtasks = document.querySelectorAll(".subbox1 ").length;
  const createTaskButton = document.querySelector(".bt2");

  // Check if all required fields are filled and valid
  const isFormValid =
    title &&
    description &&
    assignedUsers > 0 &&
    selectedPriority &&
    dueDate &&
    category !== "Select Task Category" &&
    subtasks <= 2;

  if (isFormValid) {
    // Enable the "Create Task" button
    createTaskButton.disabled = false;
    createTaskButton.style.backgroundColor = "#2a3647";
    createTaskButton.classList.add("enabled-hover");
  } else {
    // Disable the "Create Task" button
    createTaskButton.disabled = true;
    createTaskButton.style.backgroundColor = "#d3d3d3";
    createTaskButton.classList.remove("enabled-hover");
  }
}

function initializeFormCheck() {
  // Add event listeners to all inputs, textarea, select, and priority buttons
  const inputs = document.querySelectorAll(
    "#title, #description, #date, #Category"
  );
  const priorityButtons = document.querySelectorAll(
    "#button1, #button2, #button3"
  );
  const subtaskInput = document.getElementById("subtaskinput");

  inputs.forEach((input) =>
    input.addEventListener("input", checkAddTaskInputs)
  );
  priorityButtons.forEach((button) =>
    button.addEventListener("click", () => {
      getSelectedPriority(button); // Assuming you have a function to set the 'active' class
      checkAddTaskInputs();
    })
  );
  subtaskInput.addEventListener("input", checkAddTaskInputs);

  // Run the check once on load
  checkAddTaskInputs();
}

async function addtask(event) {
  event.preventDefault();

  const form = document.querySelector("form");
  // Call validation function
  if (validateTaskForm()) {
    let userResponse = await getAllUsers("users");
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let duedate = document.getElementById("date").value;
    let category = document.getElementById("Category").value;
    let UserKeyArray = Object.keys(userResponse);

    for (let index = 0; index < UserKeyArray.length; index++) {
      users.push({
        id: UserKeyArray[index],
        user: userResponse[UserKeyArray[index]],
      });
    }
    await addEditSingleUser((id = 1), {
      title: title,
      description: description,
      asignedto: asignedtousers,
      prio: selectedPriority,
      duedate: duedate,
      category: category,
      subtask: subtasks.map((subtask) => ({
        subtask: subtask,
        completed: false,
      })),
      initials: initialsArray,
    });
    emptyinputs();
  } else {
    console.log("Form validation failed. Please fix the errors.");
  }
}

function emptyinputs() {
  let form = document.querySelector("form");
  form.reset();
  document.getElementById("assignedusers").innerHTML = "";
  document.getElementById("subtasksbox").innerHTML = "";

  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");

  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";

  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";

  asignedtousers = [];
  subtasks = [];
  initialsArray = [];
}

async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responsetoJson = await response.json());
}

async function addEditSingleUser(id = 1, tasks) {
  let usertasks = await getUserTasks(id);
  if (!usertasks) {
    usertasks = {};
  }
  let existingIndexes = Object.keys(usertasks).map(Number);
  let nextIndex =
    existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;
  await putData(`users/${id}/tasks/todo-folder/${nextIndex}`, tasks);
}

async function getUserTaskss(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
}

async function getUserTasks(id) {
  let response = await fetch(
    GLOBAL +
      `users/${id}/tasks/todo-folder
.json`
  );
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

function addsubtask() {
  const subtaskinput1 = document.getElementById("subtaskinput").value;
  if (subtasks.length <= 1) {
    // Push the new subtask to the array
    subtasks.push(subtaskinput1);

    // Get the current subtask number (1-based index)
    const subtaskNumber = subtasks.length;

    // Generate and add the subtask template to the HTML
    document
      .getElementById("subtasksbox")
      .insertAdjacentHTML("beforeend", subtaskstemplate(subtaskinput1));

    // Select the newly created subtask element using the current subtask number
    const subtaskElement = document.getElementById(
      `subboxinput_${subtaskNumber}`
    );

    setTimeout(() => {
      document
        .getElementById(`savesub${subtasks.length}`)
        .addEventListener("click", function () {
          savesub(subtasks.length);
        });
      document
        .getElementById(`deletesub${subtasks.length}`)
        .addEventListener("click", function () {
          deletesub(subtasks.length);
        });
    }, 0);

    if (subtaskElement) {
      // Attach hover event listeners to the specific subtask div
      subtaskElement.addEventListener("mouseover", (event) =>
        showeditsubtasks(event, subtaskNumber)
      );
      subtaskElement.addEventListener("mouseleave", (event) =>
        hidesubeditbuttons(event, subtaskNumber)
      );
    }
    checkAddTaskInputs();
    document.getElementById("subtaskinput").value = "";
  } else {
    return displayError("spansubtask", "You can only add up to 2 subtasks.");
  }
}

function showeditsubtasks(event, index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.remove("d-none"));
  }
}

function hidesubeditbuttons(event, index) {
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

function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
    <div class="subbox1 subs${subtasks.length}" id="subboxinput_${subtasks.length}"  data-index="${subtasks.length}" >
      <div class="subbox_11">
      <div id="dot">•</div>
      <div id="sub${subtasks.length}" onclick="editsubtask(${subtasks.length})">${subtaskinput1}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${subtasks.length}" onclick="editsubtask(${subtasks.length})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${subtasks.length}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${subtasks.length}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
    </div>
  `;
}

function editsubtask(index) {
  console.log(`.subs${index}`);

  const subboxElement = document.getElementById(`sub${index}`);
  document.getElementById("dot").classList.add("d-none");
  document.getElementById(`editsub${index}`).classList.add("d-none");
  setTimeout(() => {
    document
      .getElementById(`savesub${index}`)
      .addEventListener("click", function () {
        savesub(index);
      });
    document
      .getElementById(`deletesub${index}`)
      .addEventListener("click", function () {
        deletesub(index);
      });
  }, 0);
  document.getElementById(`subboxinput_${index}`).style.background = "#dedede";

  document.getElementById(`subboxinput_${index}`).innerHTML = `
    <input id="inputsub${index}" class="editinput" type="text" placeholder="Edit subtask" />
    <div class="subbox_22">
      <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
  `;

  // Set focus on the input field for better user experience
  const inputField = document.getElementById(`inputsub${index}`);
  inputField.focus();
}

function deletesub(index) {
  // Retrieve the subtask content (for logging purposes)
  const subtaskElement = document.getElementById(`sub${index}`);
  if (subtaskElement) {
    const result = subtaskElement.innerHTML.trim();
    console.log(`Deleting subtask: ${result}`);
  }

  // Correctly remove the subtask from the global array
  subtasks.splice(index - 1, 1);

  // Remove the subtask container from the DOM
  const subtaskContainer = document.getElementById(`subboxinput_${index}`);
  if (subtaskContainer) {
    subtaskContainer.remove();
    console.log(`Subtask container 'subboxinput_${index}' removed.`);
  } else {
    console.error(`Element with ID 'subboxinput_${index}' not found.`);
  }
}

function savesub(index) {
  console.log("hello");

  // Get the new value from the input
  const result = document.getElementById(`inputsub${index}`).value.trim();

  // Validate the input (optional)
  if (result === "") {
    alert("Subtask cannot be empty!");
    return;
  }

  // Log the result (or update your subtask array here)
  console.log(`Edited subtask ${index}: ${result}`);

  // Update the global subtasks array (assuming it exists)
  subtasks[index - 1] = result;

  // Replace the input with the updated text
  const subboxElement = document.getElementById(`inputsub${index}`);

  document.getElementById(
    `subboxinput_${index}`
  ).innerHTML = `<div class="subbox_11" >
      <div id="dot">•</div>
      <div id="sub${index}" onclick="editsubtask(${index})">${result}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
      </div>`;
  document
    .getElementById(`savesub${index}`)
    .addEventListener("click", function () {
      savesub(index);
    });
  document
    .getElementById(`deletesub${index}`)
    .addEventListener("click", function () {
      deletesub(index);
    });
}

function smallerfunction() {
  if (document.querySelector("#contacts-box1,#selectboxbutton1")) {
    document.getElementById("contacts-box1").style.display = "flex";
    document.getElementById("selectbutton1").onclick = "";
  } else {
    document.getElementById("contacts-box").style.display = "flex";
    document.getElementById("selectboxbutton").onclick = "";
  }
}

async function showcontacts() {
  smallerfunction();
  let response = await fetch(GLOBAL + `users/1/contacts.json`);
  let responsestoJson = await response.json();

  responsestoJson = Object.entries(responsestoJson).map(
    ([firebaseId, contact]) => {
      if (contact && contact.name) {
        return {
          firebaseId,
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
        };
      }
      return null;
    }
  );
  if (document.getElementById("selectbutton1")) {
    document.getElementById("selectbutton1").onclick = resetsearchbar;
    document.getElementById("selectbutton1").innerHTML = searchbar();
  } else {
    document.getElementById("selectboxbutton").onclick = resetsearchbar;

    document.getElementById("selectboxbutton").innerHTML = searchbar();
  }

  let contactHTML = "";

  responsestoJson.forEach((contact) => {
    if (contact !== null) {
      users.push(contact.name);
      const color = getColorFromString(contact.name);
      usernamecolor.push(color);

      contactHTML += contactstemplate(contact, color);
    }
  });
  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box1").innerHTML = contactHTML;
  } else {
    document.getElementById("contacts-box").innerHTML = contactHTML;
  }
}

function resetsearchbar() {
  if (document.getElementById("selectbutton1")) {
    document.getElementById("contacts-box1").innerHTML = "";

    document.getElementById("selectbutton1").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />
  `;
  } else {
    document.getElementById("contacts-box1").innerHTML = "";
    document.getElementById("selectboxbutton").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />
  `;
  }

  document.getElementById("contacts-box").innerHTML = "";
  if (document.getElementById("selectbutton1")) {
    document.getElementById("selectbutton1").onclick = function () {
      showcontacts();
    };
  } else {
    document.getElementById("selectbutton").onclick = function () {
      showcontacts();
    };
  }
}

function searchbar() {
  return /*html*/ `
  <input type="text" class="searchbar"> <img src="/img/drop-up-arrow.png" alt="">
  `;
}

function contactstemplate(contact, color) {
  return /*html*/ `
    <li class="contact-menudesign" id="div${contact.id}" onclick="selectcontact(${contact.id})">
      <div class="splitdivs">
        <div class="contactbox-badge" style="background-color:${color}">${contact.initials}</div>
        <div>${contact.name}</div>
      </div>
      <label class="custom-checkbox" >
        <input type="checkbox" id="checkbox${contact.id}" class="checkboxdesign" />
        <span class="checkmark" ></span>
      </label>
    </li>
  `;
}

async function variables(contact) {
  const contactDiv = document.getElementById(`div${contact.id}`);
  const checkbox = document.getElementById(`checkbox${contact.id}`);

  const initials = contact.initials;
  const color = contact.color;

  const assignedUsersDiv = document.getElementById("assignedusers");
  return { contactDiv, checkbox, initials, color, assignedUsersDiv };
}

async function selectcontact(id) {
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  const responsestoJson = await response.json();

  const entries = Object.entries(responsestoJson).map(([firebaseId, contact]) =>
    contact && contact.name
      ? {
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
          color: contact.color,
          email: contact.email,
          telefone: contact.telefone,
        }
      : null
  );

  const selectedContact = entries.find(
    (contact) => contact && contact.id === String(id)
  );

  const { contactDiv, checkbox, initials, color, assignedUsersDiv } =
    await variables(selectedContact);

  console.log("Contact ID:", selectedContact.id);
  console.log("Contact:", selectedContact);

  checkbox.addEventListener("change", () => {
    checkbox.checked = !checkbox.checked;
    contactDiv.classList.toggle("dark-blue", checkbox.checked);

    iffunction(
      initials,
      selectedContact.name,
      color,
      contactDiv,
      assignedUsersDiv,
      selectedContact.id
    );
  });

  checkbox.dispatchEvent(new Event("change"));
  checkAddTaskInputs();
}

function iffunction(
  initials,
  name,
  color,
  contactDiv,
  assignedUsersDiv,
  firebaseId
) {
  if (!asignedtousers.includes(initials)) {
    asignedtousers.push(initials);

    initialsArray.push({
      id: firebaseId,
      initials: initials,
      name: name,
    });
    const badge = document.createElement("div");
    badge.className = "badgeassigned badge";
    badge.style.backgroundColor = color;
    badge.textContent = initials;
    assignedUsersDiv.appendChild(badge);
  }
}

function elsefunction(initials, firebaseId) {
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== firebaseId);
}

function filternumbers(input) {
  let date = document.getElementById("date").value;
  date = date.replace(/[^0-9:/-]/g, "");
  document.getElementById("date").value = date;
}

function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let r = (hash >> 24) & 0xff;
  let g = (hash >> 16) & 0xff;
  let b = (hash >> 8) & 0xff;
  const lightnessFactor = 0.4;
  r = Math.floor(r + (255 - r) * lightnessFactor);
  g = Math.floor(g + (255 - g) * lightnessFactor);
  b = Math.floor(b + (255 - b) * lightnessFactor);
  return `rgb(${r}, ${g}, ${b})`;
}

document.addEventListener("DOMContentLoaded", () => {
  const requiredmessage = document.getElementById("requiredmessage");
  const parent = document.getElementById("parent");
  const spanplace = document.getElementById("spanplace");

  window.addEventListener("resize", () => {
    if (requiredmessage && spanplace) {
      if (window.innerWidth < 400) {
        spanplace.appendChild(requiredmessage);
      } else {
        document.getElementById("parent").appendChild(requiredmessage);
        parent.insertBefore(requiredmessage, parent.firstChild);
      }
    }
  });
});

function validateTaskForm() {
  let isValid = true;

  // Clear previous validation messages
  clearValidationMessages();

  // Validate Title
  const title = document.getElementById("title").value.trim();
  if (title === "") {
    isValid = false;
    displayError("spantitle", "Please select a title.");
  }

  // Validate Description
  const description = document.getElementById("description").value.trim();
  if (description === "") {
    isValid = false;
    displayError("spandescription", "Please enter a description.");
  }

  // Validate Assigned (Contact selection)
  const assignedUsers =
    document.getElementById("assignedusers").children.length;
  if (assignedUsers === 0) {
    isValid = false;
    displayError("spantasignedbox", "Please select a contact.");
  }

  // Validate Due Date
  const dateInput = document.getElementById("date").value.trim();
  const dateElement = document.getElementById("date");

  if (dateInput === "") {
    isValid = false;
    displayError("spandate", "Please enter a date.");
  } else {
    const dueDate = new Date(dateInput);
    const today = new Date();

    // Reset time components for accurate comparison (set to midnight)
    today.setHours(0, 0, 0, 0);

    // Check if the input is a valid date and is not in the past
    if (isNaN(dueDate.getTime())) {
      isValid = false;
      displayError("spandate", "Please enter a valid date.");
    } else if (dueDate < today) {
      isValid = false;
      displayError("spandate", "Due date cannot be in the past.");
    } else {
      // If the date is valid and in the future, clear any existing error
      clearError("spandate");
    }
  }

  function clearError(spanId) {
    const errorElement = document.getElementById(spanId);
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  // Validate Priority
  const priority = getSelectedPriority();
  if (!priority) {
    isValid = false;
    displayError("spanprio", "Please select a priority.");
  }

  // Validate Category
  const category = document.getElementById("Category").value;
  if (category === "" || category === "Select Task Category") {
    isValid = false;
    displayError("spancategory", "Please select a category.");
  }

  const subtasks = document.querySelectorAll(".subbox1 ").length;
  if (subtasks < 2) {
    isValid = true;
  } else if (subtasks > 2) {
    isValid = false;
    displayError("spansubtask", "You can only add up to 2 subtasks.");
    return isValid; // Stops further validation if there are more than 3 subtasks
  }
  // Return the result of validation
  return isValid;
}

// Function to display error message with red color
function displayError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add("error-message"); // Add red color style
}

// Function to check if any priority button is selected
function getSelectedPriority() {
  const buttons = document.querySelectorAll(".buttons2 button");
  for (let button of buttons) {
    if (button.classList.contains("selected")) {
      return true; // A priority has been selected
    }
  }
  return false; // No priority selected
}

// Function to clear all previous validation messages
function clearValidationMessages() {
  // Clear validation message text and remove error styles
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
    element.classList.remove("error-message");
  });
}

// Function to handle button selection for priority
function handleButtonClick(priority) {
  const buttons = document.querySelectorAll(".buttons2 button");
  buttons.forEach((button) => {
    if (button.querySelector("span").textContent === priority) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}
