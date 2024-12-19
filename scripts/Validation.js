/**
 * Validates the entire form.
 * @returns {boolean} True if the form is valid, false otherwise.
 */
function validateTaskForm() {
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date2");
  const category = getCategory();

  const title = titleInput ? titleInput.value.trim() : "";

  return validateTaskFields(title, dateInput, category);
}

function validateTaskFields(title, dateInput, category) {
  let isValid = true;

  isValid = validatetitle(title) && isValid;
  isValid = validateDate(dateInput) && isValid;
  isValid = validatecategory(category) && isValid;

  return isValid;
}

function validatetitle(input) {
  if (input === "") {
    displayError("spantitle", "Title is required.");
  } else {
    clearError("spantitle");
    return true;
  }
}

function validateDate(dateInput) {
  if (!validateDatefield(dateInput)) {
    return false;
  }
  return true;
}

function validatecategory(category) {
  if (category === "Select Task Category") {
    displayError("spancategory", "Please select a category.");
    return false;
  } else {
    clearError("spancategory");
    return true;
  }
}

/**
 * Handles live validation for input fields.
 */
function handleLiveValidation(event) {
  const input = event.target;

  if (input.id === "date2") {
    validateDatefield(input); 
  } else {
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
  if (document.getElementById("date")) {
    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today; 
  }
  const titleInput = document.getElementById("title");
  const dateInput = document.getElementById("date2");
  const categoryInput = document.getElementById("selectedcategory"); 
  const createTaskButton = document.querySelector(".bt2");

  titleInput.addEventListener("input", (event) => {
    validateTitle(event.target); 
  });

  dateInput.addEventListener("input", (event) => {
    validateDatefield(event.target);
  });

  const customSelect = document.querySelector(".custom-select");
  customSelect.addEventListener("click", (event) => {
    if (event.target.classList.contains("custom-option")) {
      validateCategory(categoryInput); 
    }
  });

  createTaskButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (validateTaskForm()) {
      addtask(event);
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
    document.getElementById("spancategory").classList.remove;
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
  const dateValue = input.value; 
  if (dateValue) {
    const [year, month, day] = dateValue.split("-"); 
    const formattedDate = `${day}/${month}/${year}`; 
    document.getElementById("date2").value = formattedDate; 
    if (document.getElementById("date23")) {
      document.getElementById("date23").value = formattedDate; 
    }
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
    errorElement.style.display = "block";
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

function initializeFormValidation() {
  const {
    nameInput,
    emailInput,
    phoneInput,
    saveButton,
    nameError,
    emailError,
    phoneError,
  } = inputs();
  const tlds = getTopLevelDomains();
  const isNameValid = (name) => /^[a-zA-Z0-9\s]{3,20}$/.test(name.trim());
  const isEmailValid = (email) => isEmailValidWithTLDs(email, tlds);
  const isPhoneValid = (phone) => /^\+?\d{7,20}$/.test(phone.trim());

  setupValidationListeners(
    nameInput,
    emailInput,
    phoneInput,
    nameError,
    emailError,
    phoneError,
    isNameValid,
    isEmailValid,
    isPhoneValid
  );
  setupSaveButton(
    saveButton,
    nameInput,
    emailInput,
    phoneInput,
    nameError,
    emailError,
    phoneError,
    isNameValid,
    isEmailValid,
    isPhoneValid
  );
}

/**
 * Validates if an email is valid and matches the provided top-level domains (TLDs).
 * @param {string} email - The email address to validate.
 * @param {string[]} tlds - An array of valid top-level domains.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isEmailValidWithTLDs(email, tlds) {
  const regex = new RegExp(
    `^[^\\s@]+@[a-zA-Z0-9-]+\\.(${tlds.join("|")})$`,
    "i"
  );
  return regex.test(email.trim());
}

/**
 * Sets up the save button to validate input fields and handle form submission.
 * @param {HTMLButtonElement} saveButton - The save button element.
 * @param {HTMLInputElement} nameInput - The input field for the name.
 * @param {HTMLInputElement} emailInput - The input field for the email.
 * @param {HTMLInputElement} phoneInput - The input field for the phone number.
 * @param {HTMLElement} nameError - The element to display name validation errors.
 * @param {HTMLElement} emailError - The element to display email validation errors.
 * @param {HTMLElement} phoneError - The element to display phone validation errors.
 * @param {Function} isNameValid - The validation function for the name.
 * @param {Function} isEmailValid - The validation function for the email.
 * @param {Function} isPhoneValid - The validation function for the phone number.
 */
function setupSaveButton(
  saveButton,
  nameInput,
  emailInput,
  phoneInput,
  nameError,
  emailError,
  phoneError,
  isNameValid,
  isEmailValid,
  isPhoneValid
) {
  saveButton.addEventListener("submit", function (event) {
    event.preventDefault();

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

    if (isNameFieldValid && isEmailFieldValid && isPhoneFieldValid) {
      handleFormSave(event);
    }
  });
}

/**
 * Provides an appropriate error message for invalid email addresses.
 * @param {string} email - The email address to validate.
 * @returns {string} The error message, or an empty string if valid.
 */
function getEmailError(email) {
  if (email.trim() === "") return "Email cannot be empty.";
  if (!email.includes("@")) return "Email must include '@'.";
  if (email.split("@")[1] && !email.split("@")[1].includes(".")) {
    return "Email must include a domain (e.g., '.com').";
  }
  if (!isEmailValidWithTLDs(email, getTopLevelDomains())) {
    return "Enter a valid email address.";
  }
  return ""; // No error
}

/**
 * Validates an input field and updates its visual state and error message.
 * @param {HTMLInputElement} input - The input field to validate.
 * @param {Function} validator - The validation function for the input value.
 * @param {HTMLElement} errorMessageElement - The element to display validation errors.
 * @param {Function} errorMessageFunc - The function to generate error messages.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
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
    errorMessageElement.textContent = "";
    return true;
  } else {
    input.classList.remove("valid");
    input.classList.add("invalid");
    errorMessageElement.textContent = errorMessage;
    errorMessageElement.style.display = "block";
    return false;
  }
}
