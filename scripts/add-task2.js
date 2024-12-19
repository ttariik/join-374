/**
 * Fetches all tasks for a specific user.
 * @returns {Promise<Object>} - A promise that resolves to the user's tasks.
 */
async function getUserTasks() {
  let response = await fetch(GLOBAL + `users/1/tasks.json`);
  return await response.json();
}

/**
 * Fetches all users from the database.
 * @param {string} path - The path to the user data in the database.
 * @returns {Promise<Object>} - A promise that resolves to the user data.
 */
async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

/**
 * Changes the icons displayed for subtasks based on the current state.
 */
function subtaskchangeicons() {
  if (
    document.querySelector("#inputsubtask11, #inputsubtask22, #inputsubtask33")
  ) {
    document.getElementById("inputsubtask11").classList.add("d-none");
    document.getElementById("inputsubtask22").classList.remove("d-none");
    document.getElementById("inputsubtask33").classList.remove("d-none");
    document.getElementById("seperate1").classList.remove("d-none");
  } else {
    document.getElementById("inputsubtask1").classList.add("d-none");
    document.getElementById("inputsubtask2").classList.remove("d-none");
    document.getElementById("inputsubtask3").classList.remove("d-none");
    document.getElementById("seperate").classList.remove("d-none");
  }
}

/**
 * Resets subtask icons to their default state.
 */
function subtaskiconsreset() {
  if (
    document.querySelector("#inputsubtask11, #inputsubtask22, #inputsubtask33")
  ) {
    document.getElementById("inputsubtask11").classList.remove("d-none");
    document.getElementById("inputsubtask22").classList.add("d-none");
    document.getElementById("inputsubtask33").classList.add("d-none");
    document.getElementById("seperate1").classList.add("d-none");
    document.getElementById("subtaskinput0").value = "";
  } else {
    document.getElementById("inputsubtask1").classList.remove("d-none");
    document.getElementById("inputsubtask2").classList.add("d-none");
    document.getElementById("inputsubtask3").classList.add("d-none");
    document.getElementById("seperate").classList.add("d-none");
    document.getElementById("subtaskinput").value = "";
  }
}

/**
 * Hides the edit and save buttons for a specific subtask.
 * @param {number} index - The index of the subtask.
 */
function hidesubeditbuttons(index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.add("d-none"));
  }
}

/**
 * Resets the subtask input field and clears the subtask box.
 */
function resetsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  subtaskinput1.value = "";
  document.getElementById("subtasksbox").innerHTML = "";
}

/**
 * Deletes a specific subtask by index and updates the UI.
 * @param {number} index - The index of the subtask to delete.
 */
function deletesub(index) {
  const subtaskElement = document.getElementById(`sub${index}`);
  if (subtaskElement) {
    const result = subtaskElement.innerHTML.trim();
  }
  subtasks.splice(index - 1, 1);
  const subtaskContainer = document.getElementById(`subboxinput_${index}`);
  if (subtaskContainer) {
    subtaskContainer.remove();
  }
}

/**
 * Retrieves subtask input elements and resets their styles.
 * @param {number} index - The index of the subtask.
 * @returns {Promise<Object>} - A promise resolving to the input elements and buttons.
 */
async function savesubinputs(index) {
  const subboxInput = document.getElementById(`subboxinput_${index}`);
  const inputField = document.getElementById(`inputsub${index}`);
  const editButton = document.getElementById(`editsub${index}`);
  const deleteButton = document.getElementById(`deletesub${index}`);
  const saveButton = document.getElementById(`savesub${index}`);
  subboxInput.style.background = "";
  return { subboxInput, inputField, editButton, deleteButton, saveButton };
}

/**
 * Saves a specific subtask after retrieving and updating its input field.
 * @param {number} index - The index of the subtask.
 * @returns {Promise<void>} - A promise that resolves after saving the subtask.
 */
async function savesub(index) {
  const { subboxInput, inputField, editButton, deleteButton, saveButton } =
    await savesubinputs(index);
  if (editButton) editButton.classList.add("d-none");
  if (deleteButton) deleteButton.classList.add("d-none");
  if (saveButton) saveButton.classList.add("d-none");
  if (!inputField) {
    return;
  }
  savedinput(inputField, index, subboxInput);
}

/**
 * Processes and updates the subtask content in the UI.
 * @param {HTMLElement} inputField - The input field for the subtask.
 * @param {number} index - The index of the subtask.
 * @param {HTMLElement} subboxInput - The subtask container.
 * @returns {string|undefined} - The trimmed value of the input field or undefined if empty.
 */
function savedinput(inputField, index, subboxInput) {
  const result = inputField?.value.trim();
  if (result) {
    subtasks[index - 1] = result;
    subboxInput.innerHTML = subtaskstemplAte(index, result);
    subtaskiconseventlisteners(index);
    inputField.focus();
    return result;
  }
}

/**
 * Adds event listeners to subtask action buttons.
 * @param {number} index - The index of the subtask.
 */
function subtaskiconseventlisteners(index) {
  document
    .getElementById(`savesub${index}`)
    .addEventListener("click", function () {
      const inputElement = document.getElementById(`inputsub${index}`);
      if (inputElement.value === "") {
        displayError("spanplace", "You must write something in order to save");
        return;
      } else {
        savesub(index);
      }
    });
  secondpartsubtaskiconeventlisteners(index);
}

function secondpartsubtaskiconeventlisteners(index) {
  document
    .getElementById(`editsub${index}`)
    .addEventListener("click", function () {
      editsubtask(index);
    });
  document
    .getElementById(`deletesub${index}`)
    .addEventListener("click", function () {
      deletesub(index);
    });
}

/**
 * Adjusts the position and display of contact boxes in the UI.
 */
function smallerfunction() {
  const contactsBox1 = document.getElementById("contacts-box1");
  const contactsBox = document.getElementById("contacts-box");
  if (contactsBox1) {
    contactsBox1.style.display = "flex";
    contactsBox1.style.top = "34%";
    contactsBox1.style.left = "-5px";
  } else if (contactsBox) {
    contactsBox.style.display = "flex";
  }
}

/**
 * Initializes event listeners and dynamic UI adjustments after the DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const requiredmessage = document.getElementById("requiredmessage");
  const parent = document.getElementById("parent");
  const spanplace = document.getElementById("spanplace");
  if (requiredmessage && parent && spanplace) {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 400) {
        spanplace.appendChild(requiredmessage);
      } else {
        parent.insertBefore(requiredmessage, parent.firstChild);
      }
    });
  }
});
