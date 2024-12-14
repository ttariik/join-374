/**
 * Generates the HTML template for a subtask.
 * @param {string} subtaskinput1 - The input for the subtask.
 * @returns {string} The HTML template string for the subtask.
 */
function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
      <div class="subbox1 data subs${subtasks.length}" id="subboxinput_${subtasks.length}"  data-index="${subtasks.length}" >
        <div class="subbox_11">
        <div id="dot">•</div>
        <div id="sub${subtasks.length}" onclick="editsubtask(${subtasks.length})">${subtaskinput1}</div>
        </div>
        <div class="subbox_22">
        <button type="button" id="editsub${subtasks.length}" onclick="editsubtask(${subtasks.length})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${subtasks.length}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${subtasks.length}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
      </div>
    `;
}

/**
 * Initializes custom select elements on DOM content loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const customSelect = document.querySelector(".custom-select");

  if (customSelect) {
    const selected = customSelect.querySelector(".custom-select-selected");
    const options = customSelect.querySelector(".custom-select-options");

    if (selected && options) {
      selected.addEventListener("click", (e) => {
        customSelect.classList.toggle("open");
        e.stopPropagation();
      });

      options.addEventListener("click", (e) => {
        if (e.target.classList.contains("custom-option")) {
          selected.textContent = e.target.textContent;
          selected.dataset.value = e.target.dataset.value;
          customSelect.classList.remove("open");
        }
      });
    }
  }
});

/**
 * Gets the selected category from a custom dropdown.
 * @returns {string} The selected category, or a default string if none is selected.
 */
function getCategory() {
  const selected = document.querySelector(".custom-select-selected");

  if (selected.textContent.trim() === "Select Task Category") {
    return "Select Task Category"; // No valid selection
  } else {
    return selected.textContent.trim(); // Valid selection
  }
}

/**
 * Sets up event listeners for a custom category dropdown on DOM content loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const categoryDropdown = document.getElementById("Category");
  const selectedElement = categoryDropdown.querySelector(
    ".custom-select-selected"
  );
  const options = categoryDropdown.querySelectorAll(".custom-option");

  // Add click event listeners to options
  options.forEach((option) => {
    option.addEventListener("click", () => {
      const value = option.dataset.value;
      const text = option.textContent;

      // Update selected display and data-value
      selectedElement.textContent = text;
      selectedElement.dataset.value = value;
    });
  });

  // Mimic .value on the custom dropdown container
  Object.defineProperty(categoryDropdown, "value", {
    get() {
      return selectedElement.dataset.value;
    },
    set(value) {
      // Optionally, set the value programmatically if needed
      const option = categoryDropdown.querySelector(`[data-value="${value}"]`);
      if (option) {
        selectedElement.textContent = option.textContent;
        selectedElement.dataset.value = value;
      }
    },
  });
});

/**
 * Generates the HTML template for editing a subtask.
 * @param {number} index - The index of the subtask.
 * @returns {string} The HTML template string for editing the subtask.
 */
function subtaskdesign(index) {
  return /*html*/ `
      <input id="inputsub${index}" class="editinput" type="text" placeholder="Edit subtask" />
      <div class="subbox_22">
        <button type="button" id="editsub${index}" class="buttondesign1 d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${index}" type="button" class="buttondesign"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${index}" type="button" class="buttondesign"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
    `;
}

/**
 * Generates the HTML template for a subtask with a result.
 * @param {number} index - The index of the subtask.
 * @param {string} result - The content of the subtask.
 * @returns {string} The HTML template string for the subtask.
 */
function subtaskstemplAte(index, result) {
  return /*html*/ `
        <div class="subbox_11">
        <div id="dot">•</div>
        <div id="sub${index}" onclick="editsubtask(${index})">${result}</div>
        </div>
        <div class="subbox_22">
        <button type="button" id="editsub${index}" onclick="editsubtask(${index})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
        <button id="deletesub${index}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
        <button id="savesub${index}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
        </div>
    `;
}

/**
 * Generates the HTML template for loading a subtask item.
 * @param {number} subtaskIndex - The index of the subtask.
 * @param {Object} subtask - The subtask object containing its content.
 * @returns {string} The HTML template string for the subtask item.
 */
function subtaskitemtemplateload(subtaskIndex, subtask) {
  return /*html*/ `
    <div class="subbox1 data subs1" id="subboxinput_${subtaskIndex}" data-index="${subtaskIndex}">
         <div class="subbox_11">
           <div id="dot">•</div>
           <div id="sub${subtaskIndex}" onclick="editsubtask(${subtaskIndex})">${subtask.subtask}</div>
         </div>
         <div class="subbox_22">
           <button type="button" id="editsub${subtaskIndex}" onclick="editsubtask(${subtaskIndex})" class="buttondesign d-none">
             <img src="/img/edit.png" alt="Edit">
           </button>
           <button id="deletesub${subtaskIndex}" type="button" class="buttondesign d-none">
             <img src="/img/delete1 (2).png" alt="Delete">
           </button>
           <button id="savesub${subtaskIndex}" type="button" class="buttondesign1 d-none">
             <img src="/img/check1 (1).png" alt="Check">
           </button>
         </div>
       </div>
  `;
}

/**
 * Generates the HTML template for editing a subtask with a result.
 * @param {number} index - The index of the subtask.
 * @param {string} result - The content of the subtask.
 * @returns {string} The HTML template string for the subtask edit.
 */
function subtaskedittemplate(index, result) {
  return /*html*/ `
    <div class="subbox_11" >
      <div id="dot">•</div>
      <div id="sub${index}" onclick="editsubtask(${index})">${result}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0 d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
      </div>
  `;
}