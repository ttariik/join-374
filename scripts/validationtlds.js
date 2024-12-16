/**
 * Retrieves a list of all top-level domains (TLDs) by combining common, country, and specialized TLDs.
 * @returns {string[]} An array of TLDs.
 */
function getTopLevelDomains() {
  return [...getCommonTLDs(), ...getCountryTLDs(), ...getSpecializedTLDs()];
}

/**
 * Retrieves common top-level domains (TLDs).
 * @returns {string[]} An array of common TLDs.
 */
function getCommonTLDs() {
  return ["com", "org", "net", "gov", "edu", "mil"];
}

/**
 * Retrieves specialized top-level domains (TLDs).
 * @returns {string[]} An array of specialized TLDs.
 */
function getSpecializedTLDs() {
  return ["io", "ai", "tv", "xyz", "club"];
}

/**
 * Retrieves country-specific top-level domains (TLDs) by combining regions.
 * @returns {string[]} An array of country TLDs.
 */
function getCountryTLDs() {
  return [
    ...getEuropeanTLDs(),
    ...getNorthAmericanTLDs(),
    ...getAsianTLDs(),
    ...getOceaniaTLDs(),
    ...getAfricanTLDs(),
  ];
}

/**
 * Retrieves European country-specific TLDs.
 * @returns {string[]} An array of European country TLDs.
 */
function getEuropeanTLDs() {
  return ["uk", "de", "fr", "it", "nl", "es", "se", "ch", "at", "gr", "pt"];
}

/**
 * Retrieves North American country-specific TLDs.
 * @returns {string[]} An array of North American country TLDs.
 */
function getNorthAmericanTLDs() {
  return ["us", "ca"];
}

/**
 * Retrieves Asian country-specific TLDs.
 * @returns {string[]} An array of Asian country TLDs.
 */
function getAsianTLDs() {
  return ["cn", "jp", "in", "ru", "kr", "sg"];
}

/**
 * Retrieves Oceania country-specific TLDs.
 * @returns {string[]} An array of Oceania country TLDs.
 */
function getOceaniaTLDs() {
  return ["au", "nz"];
}

/**
 * Retrieves African country-specific TLDs.
 * @returns {string[]} An array of African country TLDs.
 */
function getAfricanTLDs() {
  return ["za"];
}

/**
 * Returns the input elements and associated error messages for the form.
 * @returns {Object} An object containing the input elements and error messages.
 */
function inputs() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("emailarea");
  const phoneInput = document.getElementById("phone");
  const saveButton = document.getElementById("addbutton");
  const nameError = document.getElementById("name-error-message");
  const emailError = document.getElementById("email-error-message");
  const phoneError = document.getElementById("phone-error-message");
  return {
    nameInput,
    emailInput,
    phoneInput,
    saveButton,
    nameError,
    emailError,
    phoneError,
  };
}

/**
 * Handles the form save action, determining whether to save or add a new contact.
 * @param {Event} event - The event object representing the form submission.
 */
function handleFormSave(event) {
  if (document.getElementById("spantitle").innerText === "Edit contact") {
    savedata(event);
  } else {
    addcontact(event);
  }
}

/**
 * Sets up validation listeners for input fields, triggering custom validation functions.
 * @param {HTMLElement} nameInput - The input element for the name.
 * @param {HTMLElement} emailInput - The input element for the email.
 * @param {HTMLElement} phoneInput - The input element for the phone number.
 * @param {HTMLElement} nameError - The error message element for the name.
 * @param {HTMLElement} emailError - The error message element for the email.
 * @param {HTMLElement} phoneError - The error message element for the phone number.
 * @param {boolean} isNameValid - The current validity state of the name input.
 * @param {boolean} isEmailValid - The current validity state of the email input.
 * @param {boolean} isPhoneValid - The current validity state of the phone input.
 */
function setupValidationListeners(
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
      getEmailError
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
}