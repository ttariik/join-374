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

function selectbutton_1_1() {
  toggleUrgentTextColor();
  resetMediumLowImages();
  setPriority("Urgent", "button1");
}

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

function toggleButtonState(
  buttonToToggle,
  classToToggle,
  button1,
  class1,
  button2,
  class2
) {
  // Toggle the color class of the selected button
  const selectedButton = document.getElementById(buttonToToggle);
  selectedButton.classList.toggle(classToToggle);

  // Remove the color class and "selected" class from other buttons
  const buttonsToRemove = [button1, button2];
  buttonsToRemove.forEach((button) => {
    const buttonElement = document.getElementById(button);
    buttonElement.classList.remove(class1, class2);
    buttonElement.classList.remove("selected");
  });
}

function toggleUrgentImage() {
  const urgentImg = document.getElementById("urgentImg");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";
}

function toggleUrgentTextColor() {
  const urgentText = document.getElementById("urgent");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
}

function resetMediumLowImages() {
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";
}

function toggleMediumImage() {
  const mediumImg = document.getElementById("mediumImg");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";
}

function toggleMediumTextColor() {
  const mediumText = document.getElementById("medium");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
}

function resetUrgentLowImages() {
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("low").style.color = "black";
}

function resetUrgentMediumImages() {
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
}

function toggleLowImage() {
  const lowImg = document.getElementById("lowImg");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";
}

function toggleLowTextColor() {
  const lowText = document.getElementById("low");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
}

function setPriority(priority, buttonId) {
  const selectedButton = document.getElementById(buttonId);

  // Toggle the "selected" class based on the button's state
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

  // Remove the "selected" class from the other buttons
  removeSelectionFromOtherButtons(buttonId);
}

function removeSelectionFromOtherButtons(buttonId) {
  const buttons = ["button1", "button2", "button3"];
  buttons.forEach((button) => {
    if (button !== buttonId) {
      const otherButton = document.getElementById(button);
      otherButton.classList.remove("selected");
    }
  });
}

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
