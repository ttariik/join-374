function addsubtask() {
  if (document.getElementById("subtaskinput0")) {
    const subtaskinput1 = document.getElementById("subtaskinput0").value;
    if (subtasks.length <= 1) {
      subtasks.push(subtaskinput1);

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
    } else {
      return displayError("spansubtask", "You can only add up to 2 subtasks.");
    }
  } else {
    const subtaskinput1 = document.getElementById("subtaskinput").value;
    if (subtasks.length <= 1) {
      subtasks.push(subtaskinput1);

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
    } else {
      return displayError("spansubtask", "You can only add up to 2 subtasks.");
    }
  }
}

function showeditsubtasks(event, index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.remove("d-none"));
  }
}

function editsubtask(index) {
  const subboxElement = document.getElementById(`sub${index}`);
  document.getElementById("dot").classList.add("d-none");
  document.getElementById(`editsub${index}`).classList.add("d-none");
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
  document.getElementById(`subboxinput_${index}`).style.background = "#dedede";

  document.getElementById(`subboxinput_${index}`).innerHTML =
    subtaskdesign(index);

  const inputField = document.getElementById(`inputsub${index}`);
  inputField.focus();
}

function updateAssignedUserStyles() {
  const assignedUsers1 = document.getElementById("assignedusers1");
  if (assignedUsers1) {
    const assignedUsers1Children = assignedUsers1.children;
    for (let i = 0; i < assignedUsers1Children.length; i++) {
      assignedUsers1Children[i].style.width = "32pxpx";
      assignedUsers1Children[i].style.height = "32pxpx";
      assignedUsers1Children[i].style.marginLeft = "0";
    }
  }
  const assignedUsers = document.getElementById("assignedusers");
  if (assignedUsers) {
    const assignedUsersChildren = assignedUsers.children;
    for (let i = 0; i < assignedUsersChildren.length; i++) {
      assignedUsersChildren[i].style.width = "32px";
      assignedUsersChildren[i].style.height = "32px";
      assignedUsersChildren[i].style.marginLeft = "0";
    }
  }
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
      subtasksHTML += `
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
    });
  }
  document.getElementById("subtasksbox11").innerHTML = subtasksHTML;
}
