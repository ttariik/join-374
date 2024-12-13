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
  subtasks.push(subtaskinput1);
  if (subtasks.length > 2) {
    document.querySelector(".subtasksbox1").style =
      "overflow: hidden;overflow-y: scroll; scrollbar-width: thin;";
  }
  firstpartsubtask(subtasks, subtaskinput1);
}

function firstpartsubtask(subtasks, subtaskinput1) {
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

  addingeventlisteners();
}

function addingeventlistener(subtasks) {
  if (subtasks.length === 0) {
    return;
  }
  setTimeout(() => {
    document
      .getElementById(`savesub${subtasks.length}`)
      .addEventListener("click", function () {
        savesub(subtasks.length);
      });
    document
      .getElementById(`deletesub${subtasks.length}`)
      .addEventListener("click", function () {
        deletesub(subtasks.length);
      });
  }, 0);
}

function showeditsubtasks(index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.remove("d-none"));
  }
}

function earlyeditsubtask(index) {
  if (
    document.getElementById("dot") &&
    document.getElementById(`editsub${index}`)
  ) {
    document.getElementById("dot").classList.add("d-none");
    document.getElementById(`editsub${index}`).classList.add("d-none");
  }
}

function editsubtask(index) {
  const subboxElement = document.getElementById(`sub${index}`);
  earlyeditsubtask(index);
  setTimeout(() => {
    document
      .getElementById(`savesub${index}`)
      .addEventListener("click", function () {
        savesub(index);
      });
    document
      .getElementById(`deletesub${index}`)
      .addEventListener("click", function () {
        deletesub(index);
      });
  }, 0);
  inputfielddesign(index);
  changeclasses(index);
}

function changeclasses(index) {
  document.getElementById(`savesub${index}`).classList.remove("buttondesign");
  document.getElementById(`deletesub${index}`).classList.remove("buttondesign");
  document.getElementById(`savesub${index}`).classList.add("buttondesign0");
  document.getElementById(`deletesub${index}`).classList.add("buttondesign0");
}

function inputfielddesign(index) {
  // Get the subtask value
  const result = subtasks[index - 1];

  // Apply background styling to the container
  const subboxInput = document.getElementById(`subboxinput_${index}`);
  subboxInput.style.background = "#dedede";

  // Replace the content with an input field using subtaskdesign
  subboxInput.innerHTML = subtaskdesign(index);

  // Set the input field value and focus on it
  const inputField = document.getElementById(`inputsub${index}`);
  if (inputField) {
    inputField.value = result;
    inputField.focus();
  }
}

function loadsubtasks(task) {
  // Prepare HTML for subtasks and inject them into the subtasksbox
  let subtasksHTML = "";
  if (task.subtask && Array.isArray(task.subtask)) {
    task.subtask.forEach((subtask, index) => {
      subtasks.push(subtask.subtask); // Push only the current subtask
      const subtaskNumber = subtasks.length;

      const subtaskIndex = index + 1; // Starts from 1 for unique ids like sub1, sub2, etc.

      // Generate a unique id based on index and prepare the subtask HTML
      subtasksHTML += subtaskitemtemplateload(subtaskIndex, subtask);
    });
  }

  // Inject the generated HTML into the DOM
  document.getElementById("subtasksbox11").innerHTML = subtasksHTML;
  addingeventlisteners();
}

function addingeventlisteners() {
  // Now attach the event listeners after the subtasks are loaded into the DOM
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

  addingeventlistener(subtasks);
}
