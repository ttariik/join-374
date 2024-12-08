/**
 * Validates the entire form.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateTaskForm() {
  const title = document.getElementById("title").value.trim();
  const date = document.getElementById("date2").value.trim();
  const category = document.getElementById("Category").value;

  let isValid = true;

  // Validate each field
  if (title === "") {
    displayError("spantitle", "Title is required.");
    isValid = false;
  } else {
    clearError("spantitle");
  }

  if (!validateDatefield(document.getElementById("date2"))) {
    isValid = false;
  }

  if (category === "Select Category") {
    displayError("spancategory", "Please select a category.");
    isValid = false;
  } else {
    clearError("spancategory");
  }

  return isValid;
}

/**
 * Handles live validation for input fields.
 */
function handleLiveValidation(event) {
  const input = event.target;

  if (input.id === "date2") {
    validateDatefield(input); // Specific validation for date2 field
  } else {
    // Generic validation for other inputs
    if (input.value.trim() === "") {
      displayError("spantitle", "This field is required.");
    } else {
      clearError(input.id + "-error");
    }
  }
}

/**
 * Initializes the form validation by setting up event listeners.
 */
function initializeFormCheck() {
  // Input elements
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date2");
  const categoryInput = document.getElementById("Category");
  const createTaskButton = document.querySelector(".bt2");

  // Add individual input event listeners
  titleInput.addEventListener("input", (event) => {
    validateTitle(event.target); // Validate the title
  });

  dateInput.addEventListener("input", (event) => {
    validateDatefield(event.target); // Validate the date
  });

  categoryInput.addEventListener("change", (event) => {
    validateCategory(event.target); // Validate the category
  });

  // Add event listener for button click
  createTaskButton.addEventListener("click", (event) => {
    event.preventDefault();

    // Run all validations on form submission
    if (validateTaskForm()) {
      addtask(event); // Form is valid, proceed with task creation
    } else {
    }
  });
}

/**
 * Validates the title field.
 */
function validateTitle(input) {
  if (input.value.trim() === "") {
    displayError("spantitle", "Title is required.");
  } else {
    clearError("spantitle");
  }
}

/**
 * Validates the date field.
 */
function validateDateField(input) {
  const dateValue = input.value.trim();
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!regex.test(dateValue)) {
    displayError("spandate", "Invalid date format. Please use dd/mm/yyyy.");
    return false;
  }

  const [day, month, year] = dateValue.split("/").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    displayError("spandate", "The date cannot be in the past.");
    return false;
  }

  clearError("spandate");
  return true;
}

/**
 * Validates the category field.
 */
function validateCategory(input) {
  if (input.value === "Select Category") {
    displayError("spancategory", "Please select a category.");
  } else {
    clearError("spancategory");
  }
}

/**
 * Validates the date field and ensures it follows the format dd/mm/yyyy.
 */
function validateDateField(input) {
  const dateValue = input;
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!regex.test(dateValue)) {
    displayError("spandate", "Invalid date format. Please use dd/mm/yyyy.");
    return false;
  }

  const [day, month, year] = dateValue.split("/").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    displayError("spandate", "The date cannot be in the past.");
    return false;
  }

  clearError("spandate");
  return true;
}

function validateDatefield(input) {
  const dateValue = input.value;
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;

  if (!regex.test(dateValue)) {
    displayError("spandate", "Invalid date format. Please use dd/mm/yyyy.");
    return false;
  }

  const [day, month, year] = dateValue.split("/").map(Number);
  const inputDate = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (inputDate < today) {
    displayError("spandate", "The date cannot be in the past.");
    return false;
  }

  clearError("spandate");
  return true;
}

/**
 * Formats a selected date to dd/mm/yyyy and sets it to the manual input field.
 */
function formatDateToDDMMYYYY(input) {
  const dateValue = input.value; // This value will be in yyyy-mm-dd format
  if (dateValue) {
    const [year, month, day] = dateValue.split("-"); // Split the input value into year, month, and day
    const formattedDate = `${day}/${month}/${year}`; // Convert to dd/mm/yyyy format
    document.getElementById("date2").value = formattedDate; // Set it to the manual input (date2)
    validateDateField(formattedDate);
  }
}

/**
 * Displays an error message for a specific field.
 */
function displayError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("error-message");
    errorElement.style.display = "flex";
  }
}

/**
 * Clears an error message for a specific field.
 */
function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
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
      addcontact(event); // Call your `addcontact` function if the form is valid
    } else {
    }
  });
}
