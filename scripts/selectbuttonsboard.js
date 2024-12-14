/**
 * Toggles the state of button 1, updates related styles and functionality.
 */
function selectbutton_1() {
  toggleButtonState(
    "button1",
    "lightred",
    "button2",
    "lightorange",
    "button3",
    "lightgreen"
  );
  toggleUrgentImage();
  selectbutton_1_1();
  handleButtonClick("Urgent");
}

/**
 * Updates the text color for urgent priority and resets medium and low images.
 */
function selectbutton_1_1() {
  toggleUrgentTextColor();
  resetMediumLowImages();
  setPriority("Urgent", "button1");
}

/**
 * Toggles the state of button 2, updates related styles and functionality.
 */
function selectbutton_2() {
  toggleButtonState(
    "button2",
    "lightorange",
    "button1",
    "lightred",
    "button3",
    "lightgreen"
  );
  toggleMediumImage();
  toggleMediumTextColor();
  resetUrgentLowImages();
  handleButtonClick("Medium");
  setPriority("Medium", "button2");
}

/**
 * Toggles the state of button 3, updates related styles and functionality.
 */
function selectbutton_3() {
  toggleButtonState(
    "button3",
    "lightgreen",
    "button1",
    "lightred",
    "button2",
    "lightorange"
  );
  toggleLowImage();
  toggleLowTextColor();
  resetUrgentMediumImages();
  handleButtonClick("Low");
  setPriority("Low", "button3");
}

/**
 * Toggles the visual state of the selected button and resets others.
 * @param {string} buttonToToggle - ID of the button to toggle.
 * @param {string} classToToggle - CSS class to toggle for the selected button.
 * @param {string} button1 - ID of the first button to reset.
 * @param {string} class1 - CSS class to remove from the first button.
 * @param {string} button2 - ID of the second button to reset.
 * @param {string} class2 - CSS class to remove from the second button.
 */
function toggleButtonState(
  buttonToToggle,
  classToToggle,
  button1,
  class1,
  button2,
  class2
) {
  const selectedButton = document.getElementById(buttonToToggle);
  selectedButton.classList.toggle(classToToggle);

  const buttonsToRemove = [button1, button2];
  buttonsToRemove.forEach((button) => {
    const buttonElement = document.getElementById(button);
    buttonElement.classList.remove(class1, class2);
    buttonElement.classList.remove("selected");
  });
}

/**
 * Toggles the image source of the urgent button.
 */
function toggleUrgentImage() {
  const urgentImg = document.getElementById("urgentImg");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";
}

/**
 * Toggles the text color of the urgent button.
 */
function toggleUrgentTextColor() {
  const urgentText = document.getElementById("urgent");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
}

/**
 * Resets the images and text colors for medium and low priority buttons.
 */
function resetMediumLowImages() {
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";
}

/**
 * Toggles the image source of the medium button.
 */
function toggleMediumImage() {
  const mediumImg = document.getElementById("mediumImg");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";
}

/**
 * Toggles the text color of the medium button.
 */
function toggleMediumTextColor() {
  const mediumText = document.getElementById("medium");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
}

/**
 * Resets the images and text colors for urgent and low priority buttons.
 */
function resetUrgentLowImages() {
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("low").style.color = "black";
}

/**
 * Resets the images and text colors for urgent and medium priority buttons.
 */
function resetUrgentMediumImages() {
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
}

/**
 * Toggles the image source of the low button.
 */
function toggleLowImage() {
  const lowImg = document.getElementById("lowImg");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";
}

/**
 * Toggles the text color of the low button.
 */
function toggleLowTextColor() {
  const lowText = document.getElementById("low");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
}

/**
 * Sets the selected priority and toggles the "selected" class on the respective button.
 * @param {string} priority - The priority to set (e.g., "Urgent", "Medium", "Low").
 * @param {string} buttonId - ID of the button to toggle as selected.
 */
function setPriority(priority, buttonId) {
  const selectedButton = document.getElementById(buttonId);

  if (
    selectedButton.classList.contains("lightred") ||
    selectedButton.classList.contains("lightorange") ||
    selectedButton.classList.contains("lightgreen")
  ) {
    selectedPriority = priority;
    selectedButton.classList.toggle("selected");
  } else {
    selectedPriority = "";
    selectedButton.classList.toggle("selected");
  }

  removeSelectionFromOtherButtons(buttonId);
}

/**
 * Removes the "selected" class from all buttons except the specified button.
 * @param {string} buttonId - ID of the button to exclude.
 */
function removeSelectionFromOtherButtons(buttonId) {
  const buttons = ["button1", "button2", "button3"];
  buttons.forEach((button) => {
    if (button !== buttonId) {
      const otherButton = document.getElementById(button);
      otherButton.classList.remove("selected");
    }
  });
}

/**
 * Handles button click events by updating the selected button based on priority.
 * @param {string} priority - The priority associated with the button.
 */
function handleButtonClick(priority) {
  const buttons = document.querySelectorAll(".buttons2_2 button");
  buttons.forEach((button) => {
    const buttonText = button.querySelector("span").textContent.trim();
    if (buttonText === priority) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}