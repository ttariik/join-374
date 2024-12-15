/**
 * Edits the profile section of a user or task and updates the UI.
 * @param {Object} task - The task object containing all task details.
 */

function initializeButtonListeners(
  savechanges,
  updateOverlayTemplateBasedOnCategory,
  task
) {
  // Remove previous event listeners (if any) to avoid multiple triggers
  const okSaveButton = document.getElementById("oksavebutton");
  const closeBtn = document.getElementById("closebtn");
  okSaveButton.addEventListener("click", function () {
    savechanges(task.id, task);
  });
  closeBtn.addEventListener("click", function () {
    resettemplate(task);
  });
}

async function setupprofilelayoutpart1(task) {
  const titlebox = document.getElementById("userbox");
  if (titlebox) {
    titlebox.remove();
  }
  document.querySelector(".headerprofile").style.justifyContent = "flex-end";
  document.querySelector(".titlebox span").style = "line-height: unset";
  document.querySelector(".titlebox").innerHTML = titletemplate(task);
}

async function setupprofilelayoutpart2(task) {
  document.querySelector(".description").innerHTML = descriptiontemplate();
  document.getElementById("due-date-container-edit").innerHTML =
    duedatetemplate();
  document
    .getElementById("due-date-container-edit")
    .classList.add("due-date-containerprofile");
  document.getElementById("prio").innerHTML = prioritytemplateprofile();
  document.getElementById("prio").classList.add("buttonss");
  document.querySelector(".assigned-container").innerHTML =
    reselectionofcontacts();
  document.querySelector(".assigned-container").style.gap = "unset";
  document.querySelector(".assigned-container").style.padding = "unset";
  document.querySelector(".button-containers").innerHTML = buttontemplate(task);
  document.getElementById("subtaskbox").innerHTML = "";
}

async function editprofile(task) {
  if (!task.subtask === undefined) {
    task.subtask.forEach((subtaskObj) => {
      subtasks.push(subtaskObj.subtask);
    });
  }
  await setupprofilelayoutpart1(task);
  await setupprofilelayoutpart2(task);
  document.getElementById("subtaskarea").innerHTML = subtaskboxemplate();
  document.getElementById("subtaskarea").style = "padding: 6px 0px 60px 0";
  document.getElementById("selectbutton1").parentElement.style = "gap: unset";
  document.querySelector(".scrollbar").style =
    "overflow-x: hidden;  overflow-y: scroll; scrollbar-width: thin; height: 700px; margin: 10px 0 10px 0;padding-right: 8px;";
  initializeButtonListeners(
    savechanges,
    updateOverlayTemplateBasedOnCategory,
    task
  );
  loadinfos(task);
}

/**
 * Edits input fields and updates the UI for a specific task.
 * @param {Object} task - The task object containing data to populate the UI.
 */
async function editinputs(task) {
  /**
   * Checks for subtasks in the provided task and pushes them to the subtasks array.
   * @property {Array} task.subtask - An array of subtask objects.
   */
  if (!task.subtask === undefined) {
    task.subtask.forEach((subtaskObj) => {
      subtasks.push(subtaskObj.subtask); // Push the value of the 'subtask' property
    });
  }
  /** Sets up the first part of the technical layout for the task. */
  setuptechnicallayoutpart1(task);
  /** Updates the assigned contacts section with the task's assigned contacts. */
  document.getElementById("assigned-containercontent").innerHTML =
    reselectionofcontacts(task);
  /** Adjusts the style of the assigned contacts container. */
  document.getElementById("assigned-containercontent").children[0].style.gap =
    "unset";
  /** Replaces the button section with a custom save button. */
  document.getElementById(
    "buttonss"
  ).innerHTML = `<button id="oksavebutton" class="savecontact" type="button" >
                    <span>OK</span>
                    <div><img src="/img/checkwhite.png" alt="" /></div>
                 </button>`;

  /** Adds an event listener to the save button to handle saving changes. */
  document
    .getElementById("oksavebutton")
    .addEventListener("click", function () {
      savechanges(task.id, task);
    });
  /** Sets up the second part of the technical layout for the task. */
  setuptechnicallayoutpart2(task);
}

/**
 * Configures the first part of the technical layout for the given task.
 * Updates various UI elements and templates to match the task data.
 * @param {Object} task - The task object to use for layout configuration.
 */
async function setuptechnicallayoutpart1(task) {
  /** Removes the "type" element if it exists. */
  const type = document.getElementById("type");
  if (type) {
    type.remove();
  }
  /** Adjusts layout styles and populates UI elements with task data. */
  document.getElementById("layoutid").style.gap = "10px";
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("technicaltasktitle").innerHTML = titletemplate(task);
  document.getElementById("descriptioninput").innerHTML = descriptiontemplate();
  document.getElementById("duedatecontainer").innerHTML = duedatetemplate();
  document.getElementById("duedatecontainer").style =
    "gap: 10px;flex-direction:column;!important";
  document.getElementById("priority-containercontent").innerHTML =
    prioritytemplatetechnicaltask();
  document.getElementById("date1").style.marginBottom = "unset";
  document.getElementById("priority-containercontent").style.flexDirection =
    "column";
  document.getElementById("priority-containercontent").style.gap = "10px";
}

/**
 * Configures the second part of the technical layout for the given task.
 * Sets up subtasks, button styles, and event listeners for reset actions.
 * @param {Object} task - The task object to use for layout configuration.
 */
function setuptechnicallayoutpart2(task) {
  /** Clears and populates the subtask box template. */
  document.getElementById("subtaskbox").innerHTML = "";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
  /** Adds an event listener to the close button to reset the template. */
  document.getElementById("closebtn").addEventListener("click", function () {
    resettemplate(task);
  });
  /** Configures the layout styles for the main container. */
  document.getElementById("layoutid").children[1].style =
    "overflow-x: hidden; overflow-y: scroll; scrollbar-width: thin; height: 700px; margin: 10px 0 10px 0; padding-right: 8px;";
  /** Adds an event listener to another close button to reset the template. */
  document.getElementById("closebtn1").addEventListener("click", function () {
    resettemplate(task);
  });
  /** Sets button dimensions for consistency. */
  document.getElementById("button1").style.maxWidth = "136px";
  document.getElementById("button2").style.maxWidth = "136px";
  document.getElementById("button3").style.maxWidth = "136px";
  document.getElementById("button1").style.height = "56px";
  document.getElementById("button2").style.height = "56px";
  document.getElementById("button3").style.height = "56px";
  /** Loads additional information related to the task. */
  loadinfos(task);
}
