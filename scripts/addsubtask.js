/**
 * Adds a new subtask to the list and updates the UI.
 * @param {Event} event - The event triggered by the subtask input field.
 */
function addsubtask(event) {
  let subtaskinput1;
  if (
    event.target.parentElement.parentElement.children[0].id === "subtaskinput"
  ) {
    subtaskinput1 = document.getElementById("subtaskinput").value;
    document.getElementById("subtaskinput").value = "";
  } else {
    subtaskinput1 = document.getElementById("subtaskinput0").value;
    document.getElementById("subtaskinput0").value = "";
  }
  addsubtaskpart1(subtaskinput1, event);
  addsubtaskpart2(subtasks, subtaskinput1);
}

function addsubtaskpart1(subtaskinput1, event) {
  subtasks.push(subtaskinput1);
  if (subtasks.length > 2) {
    event.currentTarget.parentElement.style.height = "150px";
    event.currentTarget.parentElement.children[6].style =
      "overflow-y: scroll; scrollbar-width: thin;";
  }
}

/**
 * Updates the UI with the new subtask.
 * @param {Array} subtasks - The list of all subtasks.
 * @param {string} subtaskinput1 - The input value of the newly added subtask.
 */
function addsubtaskpart2(subtasks, subtaskinput1) {
  const subtaskNumber = subtasks.length;
  if (document.getElementById("subtasksbox11")) {
    document
      .getElementById("subtasksbox11")
      .insertAdjacentHTML("beforeend", subtaskstemplate(subtaskinput1));
  } else {
    document
      .getElementById("subtasksbox")
      .insertAdjacentHTML("beforeend", subtaskstemplate(subtaskinput1));
  }
  addingeventlistener(subtaskNumber);
}

/**
 * Attaches event listeners to the save and delete buttons for the new subtask.
 * @param {Array} subtasks - The list of all subtasks.
 */
function addingeventlistener(subtaskNumber) {
  if (subtasks.length === 0) {
    return;
  }
  setTimeout(() => {
    if (document.getElementById(`savesub${subtaskNumber}`)) {
      document
        .getElementById(`savesub${subtaskNumber}`)
        .addEventListener("click", function () {
          partinsideeventlistener(subtaskNumber);
        });
      addingeventlistenerdeletebutton(subtaskNumber);
      addingeventlisteners(subtaskNumber);
    }
  }, 0);
}

function partinsideeventlistener(subtaskIndex) {
  const inputElement = document.getElementById(`inputsub${subtaskIndex}`);
  if (inputElement && inputElement.value === "") {
    displayError("spanplace", "hi");
    return;
  } else {
    savesub(subtaskNumber);
  }
}

function addingeventlistenerdeletebutton(subtaskNumber) {
  document
    .getElementById(`deletesub${subtaskNumber}`)
    .addEventListener("click", function () {
      deletesub(subtaskNumber);
    });
}

/**
 * Shows edit buttons for a specific subtask.
 * @param {number} index - The index of the subtask.
 */
function showeditsubtasks(subtaskNumber) {
  const subtaskBox = document.getElementById(`subboxinput_${subtaskNumber}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.remove("d-none"));
  }
}

/**
 * Hides the default edit button and dot element for a specific subtask.
 * @param {number} index - The index of the subtask.
 */
function earlyeditsubtask(index) {
  const dotElement = document.querySelector(`#dot_${index}`);
  const editButton = document.querySelector(`#editsub${index}`);
  if (dotElement && editButton) {
    dotElement.classList.add("d-none"); // Hide the dot for this subtask only
    editButton.classList.add("d-none"); // Hide the edit button for this subtask only
  }
}

/**
 * Prepares a specific subtask for editing.
 * @param {number} index - The index of the subtask.
 */
function editsubtask(index) {
  const subboxElement = document.getElementById(`sub${index}`);
  earlyeditsubtask(index);
  editsubtasklisteners(index);
  inputfielddesign(index);
  changeclasses(index);
}

function editsubtasklisteners(index) {
  setTimeout(() => {
    document
      .getElementById(`savesub${index}`)
      .addEventListener("click", function () {
        const inputElement = document.getElementById(`inputsub${index}`);
        if (inputElement && inputElement.value === "") {
          ifresult();
        } else {
          clearerrors(index);
        }
      });
    document
      .getElementById(`deletesub${index}`)
      .addEventListener("click", function () {
        deletesub(index);
      });
  }, 0);
}

function ifresult() {
  displayError(
    "spansubtask1",
    "you must write something in order to be able to save."
  );
  displayError(
    "spansubtask",
    "you must write something in order to be able to save."
  );
  return;
}

function clearerrors(index) {
  clearError("spansubtask1");
  clearError("spansubtask");
  savesub(index);
}

/**
 * Updates the button classes for the save and delete buttons of a specific subtask.
 * @param {number} index - The index of the subtask.
 */
function changeclasses(index) {
  document.getElementById(`savesub${index}`).classList.remove("buttondesign");
  document.getElementById(`deletesub${index}`).classList.remove("buttondesign");
  document.getElementById(`savesub${index}`).classList.add("buttondesign0");
  document.getElementById(`deletesub${index}`).classList.add("buttondesign0");
}

/**
 * Replaces a subtask's content with an input field for editing.
 * @param {number} index - The index of the subtask.
 */
function inputfielddesign(index) {
  const result = subtasks[index - 1];
  const subboxInput = document.getElementById(`subboxinput_${index}`);
  subboxInput.style.background = "#dedede";
  subboxInput.innerHTML = subtaskdesign(index);
  const inputField = document.getElementById(`inputsub${index}`);
  if (inputField) {
    inputField.value = result;
    inputField.focus();
  }
}

/**
 * Loads subtasks for a given task and updates the UI.
 * @param {Object} task - The task object containing subtasks.
 */
async function loadsubtasks(task) {
  let subtasksHTML = "";
  if (task.subtask && Array.isArray(task.subtask)) {
    task.subtask.forEach((subtask, index) => {
      subtasks.push(subtask.subtask);
      const subtaskIndex = index + 1;
      subtasksHTML += subtaskitemtemplateload(subtaskIndex, subtask);
      addingeventlistener(subtaskIndex);
    });
  }
  document.getElementById("subtasksbox11").innerHTML = subtasksHTML;
  addingeventlisteners();
}

/**
 * Attaches hover event listeners to show or hide buttons for all subtasks.
 */
function addingeventlisteners() {
  const subtasksBox =
    document.getElementById("subtasksbox11") ||
    document.getElementById("subtasksbox");
  const subtaskItems = subtasksBox.querySelectorAll(".data");
  subtaskItems.forEach((item) => {
    item.addEventListener("mouseover", (event) => {
      const index = event.currentTarget.getAttribute("data-index");
      showeditsubtasks(`${index}`);
    });
    item.addEventListener("mouseleave", function (event) {
      const index = event.currentTarget.getAttribute("data-index");
      hidesubeditbuttons(`${index}`);
    });
  });
}
