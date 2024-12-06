/**
 * Validates the task input fields and provides visual feedback for the "Create Task" button.
 */
function checkAddTaskInputs() {
  const title = document.getElementById("title").value.trim();
  const dueDate = document.getElementById("date").value.trim();
  const category = document.getElementById("Category").value;
  const createTaskButton = document.querySelector(".bt2");

  // Check if the required fields are valid
  const isFormValid = title && dueDate && category !== "Select Task Category";

  // Toggle visual feedback for the button
  createTaskButton.classList.toggle("enabled-hover", isFormValid);

  if (isFormValid) {
    createTaskButton.classList.remove("invalid"); // Optional: remove invalid class when valid
  } else {
    createTaskButton.classList.add("invalid"); // Optional: add invalid class if invalid
  }
}

/**
 * Triggers live validation for required fields.
 */
function handleLiveValidation(event) {
  const inputId = event.target.id;
  clearValidationMessages();

  if (inputId === "title") {
    validateTitle();
  } else if (inputId === "date") {
    validateDateField();
  } else if (inputId === "Category") {
    validateCategory();
  }
}

/**
 * Initializes event listeners for the task input form and triggers validation on changes.
 */
function initializeFormCheck() {
  const inputs = document.querySelectorAll("#title, #date, #Category");
  const createTaskButton = document.querySelector(".bt2");

  inputs.forEach((input) => {
    input.addEventListener("input", (event) => {
      handleLiveValidation(event);
      checkAddTaskInputs();
    });
  });

  createTaskButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (validateTaskForm()) {
      return addtask(event);
      // Proceed with task creation logic
    } else {
      console.log("Form has errors. Please correct them.");
    }
  });

  checkAddTaskInputs(); // Initial validation check
}

/**
 * Validates the task form and displays error messages for invalid inputs.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateTaskForm() {
  let isValid = true;
  clearValidationMessages();

  if (!validateTitle()) isValid = false;
  if (!validateDateField()) isValid = false;
  if (!validateCategory()) isValid = false;

  return isValid;
}

/**
 * Individual validation functions for required fields.
 */
function validateTitle() {
  const title = document.getElementById("title").value.trim();
  if (!title) {
    displayError("spantitle", "Title is required.");
    return false;
  }
  return true;
}

function validateDateField() {
  const dateInput = document.getElementById("date").value.trim();
  if (!dateInput || !validateDate(dateInput)) {
    displayError("spandate", "Due date is required and must be valid.");
    return false;
  }
  return true;
}

function validateCategory() {
  const category = document.getElementById("Category").value;
  if (!category || category === "Select Task Category") {
    displayError("spancategory", "Category is required.");
    return false;
  }
  return true;
}

/**
 * Clears all validation messages from the form.
 */
function clearValidationMessages() {
  document.querySelectorAll(".error-message").forEach((message) => {
    message.textContent = "";
    message.classList.remove("error-message");
  });
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
 * Validates the date format.
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} True if the date is valid, false otherwise.
 */
function validateDate(dateString) {
  const date = new Date(dateString);
  return date.toString() !== "Invalid Date";
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

// Function to initialize validation
function initializeFormValidation() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("emailarea");
  const phoneInput = document.getElementById("phone");
  const saveButton = document.getElementById("addbutton");
  const nameError = document.getElementById("name-error-message");
  const emailError = document.getElementById("email-error-message");
  const phoneError = document.getElementById("phone-error-message");

  const isNameValid = (name) => /^[a-zA-Z0-9\s]{3,20}$/.test(name.trim());
  const isEmailValid = (email) =>
    /^[^\s@]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,63}$/.test(email.trim());
  const isPhoneValid = (phone) => /^\+?\d{7,20}$/.test(phone.trim());

  // Function to determine specific email error
  function getEmailError(email) {
    if (email.trim() === "") return "Email cannot be empty.";
    if (!email.includes("@")) return "Email must include '@'.";
    if (email.split("@")[1] && !email.split("@")[1].includes("."))
      return "Email must include a domain (e.g., '.com').";
    if (!isEmailValid(email)) return "Enter a valid email address.";
    return ""; // No error
  }

  // Function to perform custom validation for each input field
  function performCustomValidation(
    input,
    validator,
    errorMessageElement,
    errorMessageFunc
  ) {
    const errorMessage = errorMessageFunc(input.value);
    if (validator(input.value)) {
      input.classList.remove("invalid");
      input.classList.add("valid");
      errorMessageElement.textContent = ""; // Clear error message if valid
      return true;
    } else {
      input.classList.remove("valid");
      input.classList.add("invalid");
      errorMessageElement.textContent = errorMessage; // Show specific error
      errorMessageElement.style.display = "flex"; // Show error message if invalid
      return false;
    }
  }

  // Add event listeners for dynamic validation
  nameInput.addEventListener("input", function () {
    performCustomValidation(
      nameInput,
      isNameValid,
      nameError,
      () => "Name must be 3-20 alphanumeric characters."
    );
  });

  emailInput.addEventListener("input", function () {
    performCustomValidation(
      emailInput,
      isEmailValid,
      emailError,
      getEmailError // Dynamic error message for email
    );
  });

  phoneInput.addEventListener("input", function () {
    performCustomValidation(
      phoneInput,
      isPhoneValid,
      phoneError,
      () => "Phone number must be 7-20 digits."
    );
  });

  // Add click event listener for "Save" button
  saveButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission

    // Validate all fields when button is clicked
    const isNameFieldValid = performCustomValidation(
      nameInput,
      isNameValid,
      nameError,
      () => "Name must be 3-20 alphanumeric characters."
    );

    const isEmailFieldValid = performCustomValidation(
      emailInput,
      isEmailValid,
      emailError,
      getEmailError
    );

    const isPhoneFieldValid = performCustomValidation(
      phoneInput,
      isPhoneValid,
      phoneError,
      () => "Phone number must be 7-20 digits."
    );

    // Check if all fields are valid
    if (isNameFieldValid && isEmailFieldValid && isPhoneFieldValid) {
      console.log("Form is valid. Proceeding with submission...");
      addcontact(event); // Call your `addcontact` function if the form is valid
    } else {
      console.log("Form has errors. Please correct them.");
    }
  });
}
