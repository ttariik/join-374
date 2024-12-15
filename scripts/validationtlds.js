function getTopLevelDomains() {
  return [...getCommonTLDs(), ...getCountryTLDs(), ...getSpecializedTLDs()];
}

function getCommonTLDs() {
  return ["com", "org", "net", "gov", "edu", "mil"];
}

function getSpecializedTLDs() {
  return ["io", "ai", "tv", "xyz", "club"];
}

function getCountryTLDs() {
  return [
    ...getEuropeanTLDs(),
    ...getNorthAmericanTLDs(),
    ...getAsianTLDs(),
    ...getOceaniaTLDs(),
    ...getAfricanTLDs(),
  ];
}

function getEuropeanTLDs() {
  return ["uk", "de", "fr", "it", "nl", "es", "se", "ch", "at", "gr", "pt"];
}

function getNorthAmericanTLDs() {
  return ["us", "ca"];
}

function getAsianTLDs() {
  return ["cn", "jp", "in", "ru", "kr", "sg"];
}

function getOceaniaTLDs() {
  return ["au", "nz"];
}

function getAfricanTLDs() {
  return ["za"];
}

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

function handleFormSave(event) {
  if (document.getElementById("spantitle").innerText === "Edit contact") {
    savedata(event);
  } else {
    addcontact(event);
  }
}
