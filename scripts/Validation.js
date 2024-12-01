/**
 * Validates the task input fields and enables or disables the "Create Task" button accordingly.
 */
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
    subtasks <= 2;
  createTaskButton.disabled = !isFormValid;
  createTaskButton.style.backgroundColor = isFormValid ? "#2a3647" : "#d3d3d3";
  createTaskButton.classList.toggle("enabled-hover", isFormValid);
}

/**
 * Initializes event listeners for the task input form and triggers validation on changes.
 */
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

/**
 * Validates the task form and displays error messages for invalid inputs.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateTaskForm() {
  let isValid = true;
  clearValidationMessages();
  const title = document.getElementById("title").value.trim();
  if (!title) {
    isValid = false;
    displayError("spantitle", "Please select a title.");
  }

  const description = document.getElementById("description").value.trim();
  if (!description) {
    isValid = false;
    displayError("spandescription", "Please enter a description.");
  }

  const assignedUsers =
    document.getElementById("assignedusers").children.length;
  if (!assignedUsers) {
    isValid = false;
    displayError("spantasignedbox", "Please select a contact.");
  }

  const dateInput = document.getElementById("date").value.trim();
  if (!dateInput || !validateDate(dateInput)) {
    isValid = false;
    displayError("spandate", "Please enter a valid date.");
  }

  if (!getSelectedPriority()) {
    isValid = false;
    displayError("spanprio", "Please select a priority.");
  }
  const category = document.getElementById("Category").value;
  if (!category || category === "Select Task Category") {
    isValid = false;
    displayError("spancategory", "Please select a category.");
  }

  const subtasks = document.querySelectorAll(".subbox1 ").length;
  if (subtasks > 2) {
    isValid = false;
    displayError("spansubtask", "You can only add up to 2 subtasks.");
  }

  return isValid;
}

function getSelectedPriority() {
  return [...document.querySelectorAll(".buttons2 button")].some((button) =>
    button.classList.contains("selected")
  );
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

/**
 * Displays an error message for a specific element.
 * @param {string} elementId - The ID of the element where the error should be displayed.
 * @param {string} message - The error message to display.
 */
function displayError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add("error-message");
}

/**
 * Retrieves the selected priority from the task form.
 * @returns {boolean} True if a priority is selected, false otherwise.
 */
function getSelectedPriority() {
  const buttons = document.querySelectorAll(".buttons2 button");
  for (let button of buttons) {
    if (button.classList.contains("selected")) {
      return true;
    }
  }
  return false;
}

/**
 * Validates whether a given date in DD/MM/YYYY format is valid and not in the past.
 * @param {string} dateInput - The date string to validate in DD/MM/YYYY format.
 * @returns {boolean} True if the date is valid and not in the past, false otherwise.
 */
function validateDate(dateInput) {
  const [day, month, year] = dateInput.split("/").map(Number);

  // Check if the parsed values are valid
  if (
    !day ||
    !month ||
    !year ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return false;
  }

  // Create a date object with the parsed values
  const inputDate = new Date(year, month - 1, day); // Month is 0-indexed in Date

  // Check if the date object is valid
  if (
    inputDate.getDate() !== day ||
    inputDate.getMonth() !== month - 1 ||
    inputDate.getFullYear() !== year
  ) {
    return false;
  }

  // Compare with today's date
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
}

function clearValidationMessages() {
  document.querySelectorAll(".error-message").forEach((element) => {
    element.textContent = "";
    element.classList.remove("error-message");
  });
}

/**
 * Validates a phone number based on a predefined pattern.
 *
 * @param {string} value - The phone number to validate.
 * @returns {boolean} - True if the phone number is valid, false otherwise.
 */
function validatePhoneNumber(value) {
  const phonePattern = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phonePattern.test(value);
}

/**
 * Validates an input field based on a pattern and shows error messages.
 *
 * @param {HTMLElement} el - The input element to validate.
 * @param {RegExp} pattern - The regular expression pattern for validation.
 * @param {string} errorMsg - The error message to display if validation fails.
 * @returns {boolean} - True if the input is valid, false otherwise.
 */

function initializeFormValidation() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("emailarea");
  const phoneInput = document.getElementById("phone");
  const saveButton = document.getElementById("addbutton");

  const nameError = document.getElementById("name-error-message");
  const emailError = document.getElementById("email-error-message");
  const phoneError = document.getElementById("phone-error-message");

  const isNameValid = (name) => /^[a-zA-Z\s]{3,20}$/.test(name.trim());
  const isEmailValid = (email) =>
    /^[^\s@]+@[^\s@0123456789]+\.[^\s@]+$/.test(email.trim());
  const isPhoneValid = (phone) => /^\+?\d{7,20}$/.test(phone.trim());

  function performCustomValidation(input, validator, errorMessageElement) {
    if (validator(input.value)) {
      input.classList.remove("invalid");
      input.classList.add("valid");
    } else {
      input.classList.remove("valid");
      input.classList.add("invalid");
      errorMessageElement.style.display = "flex"; // Show the error message
    }
    toggleSaveButton();
  }

  function toggleSaveButton() {
    if (
      isNameValid(nameInput.value) &&
      isEmailValid(emailInput.value) &&
      isPhoneValid(phoneInput.value)
    ) {
      saveButton.disabled = false;
    } else {
      saveButton.disabled = true;
    }
  }

  // Add event listeners after ensuring elements exist
  nameInput.addEventListener("input", function () {
    performCustomValidation(nameInput, isNameValid, nameError);
  });

  emailInput.addEventListener("input", function () {
    performCustomValidation(emailInput, isEmailValid, emailError);
  });

  phoneInput.addEventListener("input", function () {
    performCustomValidation(phoneInput, isPhoneValid, phoneError);
  });

  // Initial button state
  saveButton.disabled = true;

  // Return true if all fields are valid, else false
  return (
    isNameValid(nameInput.value) &&
    isEmailValid(emailInput.value) &&
    isPhoneValid(phoneInput.value)
  );
}
