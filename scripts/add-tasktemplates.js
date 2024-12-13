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

document.addEventListener("DOMContentLoaded", () => {
  const customSelect = document.querySelector(".custom-select");
  const selected = customSelect.querySelector(".custom-select-selected");
  const options = customSelect.querySelector(".custom-select-options");

  // Toggle dropdown on click
  selected.addEventListener("click", () => {
    customSelect.classList.toggle("open");
  });

  // Select an option
  options.addEventListener("click", (e) => {
    if (e.target.classList.contains("custom-option")) {
      selected.textContent = e.target.textContent; // Update selected text
      selected.dataset.value = e.target.dataset.value; // Store value
      customSelect.classList.remove("open");
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
      customSelect.classList.remove("open");
    }
  });
});

// This function retrieves the selected category from the custom select dropdown
function getCategory() {
  const selected = document.querySelector(".custom-select-selected");

  // If the selected text is "Select Task Category", it means no valid option has been selected.
  if (!selected || selected.textContent === "Select Task Category") {
    return "Select Task Category"; // Default value when nothing is selected
  }

  // Return the value stored in the data-value attribute of the selected option
  return selected.dataset.value;
}

// Example of how to use the function (should be triggered when you need to retrieve the category)
const category = getCategory();
console.log(category); // This will output the selected category or the default value

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
  });
});

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
