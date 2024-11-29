function checkAddTaskInputs() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("date").value.trim();
  const category = document.getElementById("Category").value;
  const assignedUsers =
    document.getElementById("assignedusers").children.length;
  const subtasks = document.querySelectorAll(".subbox1 ").length;
  const createTaskButton = document.querySelector(".bt2");

  const isFormValid =
    title &&
    description &&
    assignedUsers > 0 &&
    selectedPriority &&
    dueDate &&
    category !== "Select Task Category" &&
    subtasks >= 0 &&
    subtasks <= 2;

  if (isFormValid) {
    createTaskButton.disabled = false;
    createTaskButton.style.backgroundColor = "#2a3647";
    createTaskButton.classList.add("enabled-hover");
  } else {
    createTaskButton.disabled = true;
    createTaskButton.style.backgroundColor = "#d3d3d3";
    createTaskButton.classList.remove("enabled-hover");
  }
}

function initializeFormCheck() {
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
      getSelectedPriority(button);
      checkAddTaskInputs();
    })
  );
  subtaskInput.addEventListener("input", checkAddTaskInputs);

  checkAddTaskInputs();
}

function validateTaskForm() {
  let isValid = true;

  clearValidationMessages();

  const title = document.getElementById("title").value.trim();
  if (title === "") {
    isValid = false;
    displayError("spantitle", "Please select a title.");
  }

  const description = document.getElementById("description").value.trim();
  if (description === "") {
    isValid = false;
    displayError("spandescription", "Please enter a description.");
  }

  if (document.getElementById("assignedusers1")) {
    const assignedUsers =
      document.getElementById("assignedusers1").children.length;
    if (assignedUsers === 0) {
      isValid = false;
      displayError("spantasignedbox", "Please select a contact.");
    }
  } else {
    const assignedUsers =
      document.getElementById("assignedusers").children.length;
    if (assignedUsers === 0) {
      isValid = false;
      displayError("spantasignedbox", "Please select a contact.");
    }
  }

  const dateInput = document.getElementById("date").value.trim();
  const dateElement = document.getElementById("date");

  if (dateInput === "") {
    isValid = false;
    displayError("spandate", "Please enter a date.");
  } else {
    // Split the date string by slashes to handle DD/MM/YYYY format
    const [day, month, year] = dateInput.split("/").map(Number);

    // Check if the split components are valid numbers
    if (!day || !month || !year || day > 31 || month > 12) {
      isValid = false;
      displayError("spandate", "Please enter a valid date.");
      return;
    }

    // Construct a new date using the parsed values
    const dueDate = new Date(year, month - 1, day); // month is 0-indexed in JS
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if dueDate is valid and not in the past
    if (isNaN(dueDate.getTime())) {
      isValid = false;
      displayError("spandate", "Please enter a valid date.");
    } else if (dueDate < today) {
      isValid = false;
      displayError("spandate", "Due date cannot be in the past.");
    } else {
      clearError("spandate");
    }
  }

  function clearError(spanId) {
    const errorElement = document.getElementById(spanId);
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  const priority = getSelectedPriority();
  if (!priority) {
    isValid = false;
    displayError("spanprio", "Please select a priority.");
  }

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
    return isValid;
  }
  return isValid;
}

function displayError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add("error-message");
}

function getSelectedPriority() {
  const buttons = document.querySelectorAll(".buttons2 button");
  for (let button of buttons) {
    if (button.classList.contains("selected")) {
      return true;
    }
  }
  return false;
}

function clearValidationMessages() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
    element.classList.remove("error-message");
  });
}
