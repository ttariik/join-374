function addsubtask() {
  if (document.getElementById("subtaskinput0")) {
    subtasks.push(subtaskinput1);
    const subtaskinput1 = document.getElementById("subtaskinput0").value;
    if (subtasks.length <= 1) {
      firstpartsubtask(subtasks, subtaskinput1);
    } else {
      return displayError("spansubtask", "You can only add up to 2 subtasks.");
    }
  } else {
    if (subtasks.length <= 1) {
      const subtaskinput1 = document.getElementById("subtaskinput").value;
      subtasks.push(subtaskinput1);
      secondpartsubtask(subtasks, subtaskinput1);
    } else {
      return displayError("spansubtask", "You can only add up to 2 subtasks.");
    }
  }
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

  addingeventlistener(subtasks);
  mouseroveroperations(subtaskNumber);
}

function addingeventlistener(subtasks) {
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

function mouseroveroperations(subtaskNumber) {
  const subtaskElement = document.getElementById(
    `subboxinput_${subtaskNumber}`
  );
  if (subtaskElement) {
    subtaskElement.addEventListener("mouseover", (event) =>
      showeditsubtasks(event, subtaskNumber)
    );
    subtaskElement.addEventListener("mouseleave", (event) =>
      hidesubeditbuttons(event, subtaskNumber)
    );
  }
  checkAddTaskInputs();
  document.getElementById("subtaskinput0").value = "";
}

function secondpartsubtask(subtasks, subtaskinput1) {
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
  const subtaskElement = document.getElementById(
    `subboxinput_${subtaskNumber}`
  );
  addingeventlistener2(subtaskElement);
  mouseroveroperations2(subtaskNumber, subtaskElement);
}

function addingeventlistener2() {
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

function mouseroveroperations2(subtaskNumber, subtaskElement) {
  if (subtaskElement) {
    subtaskElement.addEventListener("mouseover", (event) =>
      showeditsubtasks(event, subtaskNumber)
    );
    subtaskElement.addEventListener("mouseleave", (event) =>
      hidesubeditbuttons(event, subtaskNumber)
    );
  }
  checkAddTaskInputs();
  document.getElementById("subtaskinput").value = "";
}

function showeditsubtasks(event, index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.remove("d-none"));
  }
}

function earlyeditsubtask(index) {
  document.getElementById("dot").classList.add("d-none");
  document.getElementById(`editsub${index}`).classList.add("d-none");
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
}

function inputfielddesign(index) {
  document.getElementById(`subboxinput_${index}`).style.background = "#dedede";

  document.getElementById(`subboxinput_${index}`).innerHTML =
    subtaskdesign(index);

  const inputField = document.getElementById(`inputsub${index}`);
  inputField.focus();
}

function loadsubtasks(task) {
  // Prepare HTML for subtasks and inject them into the subtasksbox
  let subtasksHTML = "";
  if (task.subtask && Array.isArray(task.subtask)) {
    task.subtask.forEach((subtask, index) => {
      task.subtask.forEach((subtaskObj) => {
        subtasks.push(subtaskObj.subtask);
      });
      // Generate a unique id based on index
      const subtaskIndex = subtasks.length; // To make sure it starts from sub1, sub2, etc.

      // Create HTML content for each subtask
      subtasksHTML += subtaskitemtemplateload(subtaskIndex, subtask);
    });
  }
  document.getElementById("subtasksbox11").innerHTML = subtasksHTML;
}

function subtaskitemtemplateload(subtaskIndex, subtask) {
  return /*html*/ `
    <div class="subbox1 subs1" id="subboxinput_${subtaskIndex}" data-index="${subtaskIndex}">
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
      <button type="button" id="editsub${index}" class="buttondesign0"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
      </div>
  `;
}
