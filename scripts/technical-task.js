/**
 * Edits the inputs for a task and updates the UI accordingly.
 * @param {Object} task - The task object containing task details.
 */

let button_1, button_2, button_3;

function editinputs(task) {
  const type = document.getElementById("type");
  if (type) {
    type.remove();
  }
  document.getElementById("layoutid").style.gap = "10px";
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("technicaltasktitle").innerHTML = titletemplate(task);
  document.getElementById("descriptioninput").innerHTML = descriptiontemplate();
  document.getElementById("duedatecontainer").innerHTML = duedatetemplate();
  document.getElementById("duedatecontainer").style =
    "gap: 10px;flex-direction:column;!important";
  document.getElementById("priority-containercontent").innerHTML =
    prioritytemplate();
  document.getElementById("date1").style.marginBottom = "unset";
  document.getElementById("priority-containercontent").style.flexDirection =
    "column";
  document.getElementById("priority-containercontent").style.gap = "10px";
  document.getElementById("assigned-containercontent").innerHTML =
    reselectionofcontacts(task);
  document.getElementById;
  document.getElementById("assigned-containercontent").children[0].style.gap =
    "unset";
  document.getElementById(
    "buttonss"
  ).innerHTML = `<button id="oksavebutton" class="savecontact" type="button" ><span>OK</span><div> <img src="/img/checkwhite.png" alt="" /></div> </button>`;
  document
    .getElementById("oksavebutton")
    .addEventListener("click", function () {
      savechanges(task);
    });
  document.getElementById("subtaskbox").innerHTML = "";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
  document.getElementById("closebtn").addEventListener("click", function () {
    resettemplate(task);
  });
  document.getElementById("layoutid").children[1].style =
    "overflow-x: hidden;  overflow-y: scroll; scrollbar-width: thin; height: 700px; margin: 10px 0 10px 0;padding-right: 8px;";
  document.getElementById("closebtn1").addEventListener("click", function () {
    resettemplate(task);
  });
  definedbuttons(button_1, button_2, button_3);

  loadinfos(task);
}

function definedbuttons() {
  // Assign the buttons inside the function
  button_1 = document
    .getElementById("priority-containercontent")
    .children[1].children[0].querySelector("#button1");

  button_2 = document
    .getElementById("priority-containercontent")
    .children[1].children[1].querySelector("#button2");

  button_3 = document
    .getElementById("priority-containercontent")
    .children[1].children[2].querySelector("#button3");
}

function loadinfos(task) {
  document.querySelector(".titleinputdesign").value = task.title;
  document.getElementById("descriptioninput").children[1].value =
    task.description;
  document.getElementById("date1").value = task.duedate;
  if (task.prio === "Urgent") {
    selectbutton_1();
  } else if (task.prio === "Medium") {
    selectbutton_2();
  } else {
    selectbutton_3();
  }
  showsavedinitials(task);
}

async function showsavedinitials(task) {
  // Fetch all contacts once to avoid repetitive API calls inside the loop
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  if (!response.ok) {
    console.error("Failed to fetch contacts");
    return;
  }
  const responsestoJson = await response.json();

  // Map the response to an array of contact objects
  const entries = Object.entries(responsestoJson).map(([firebaseId, contact]) =>
    contact && contact.name
      ? {
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
          color: contact.color,
          email: contact.email,
          telefone: contact.telefone,
        }
      : null
  );

  // Loop through each assigned user (from task.asignedto)
  for (let index = 0; index < task.asignedto.length; index++) {
    const contactId = task.asignedto[index]; // Get the contact ID for the current user

    // Find the corresponding contact object based on the contact ID
    const selectedContact = entries.find(
      (contact) => contact && contact.id === contactId
    );

    // Create a new div element for the initials
    const badge = document.createElement("div");
    badge.className = "badgeassigned badge";
    badge.style.width = "32px";
    badge.style.height = "32px";
    badge.style.backgroundColor = selectedContact.color; // Use the color of the selected contact
    badge.textContent = selectedContact.initials; // Set the text content to the initials

    // Append the badge to the "assignedusers1" container
    document.getElementById("assignedusers1").appendChild(badge);

    // Set the marginLeft of the newly added badge
    badge.style.marginLeft = "0";
  }
}

/**
 * Edits the profile section of a user or task and updates the UI.
 * @param {Object} task - The task object containing all task details.
 */
function editprofile(task) {
  const titlebox = document.getElementById("userbox");
  if (titlebox) {
    titlebox.remove();
  }
  document.querySelector(".headerprofile").style.justifyContent = "flex-end";
  document.querySelector(".titlebox span").style = "line-height: unset";
  document.querySelector(".titlebox").innerHTML = titletemplate(task);
  document.querySelector(".description").innerHTML = descriptiontemplate();

  document.getElementById("due-date-container-edit").innerHTML =
    duedatetemplate();
  document
    .getElementById("due-date-container-edit")
    .classList.add("due-date-containerprofile");
  document.getElementById("prio").innerHTML = prioritytemplate();
  document.getElementById("prio").classList.add("buttonss");
  document.getElementById("profileassingedarea").innerHTML =
    reselectionofcontacts();
  document.getElementById("profileassingedarea").style.gap = "unset";
  document.getElementById("profileassingedarea").style.padding = "unset";
  document.querySelector(".button-containers").innerHTML = buttontemplate(task);
  document.getElementById("subtaskbox").innerHTML = "";
  document.getElementById("subtaskarea").innerHTML = subtaskboxemplate();
  document.getElementById("subtaskarea").style = "padding: 6px 0px 60px 0";
  document.getElementById("selectbutton1").parentElement.style = "gap: unset";
  document.querySelector(".scrollbar").style =
    "overflow-x: hidden;  overflow-y: scroll; scrollbar-width: thin; height: 700px; margin: 10px 0 10px 0;padding-right: 8px;";

  document
    .getElementById("oksavebutton")
    .addEventListener("click", function () {
      savechanges(task);
    });
  document.getElementById("closebtn").addEventListener("click", function () {
    resettemplate(task);
  });
  definedbuttons();
}

/**
 * Resets the template to its initial state based on the task type.
 * @param {Object} task - The task object containing all task details.
 */
async function resettemplate(task) {
  if (task.category === "User Story") {
    closeoverlayprofiletemplate();
    const response2 = await fetch(GLOBAL + "users/1/contacts.json");
    const contacts = await response2.json();
    const profiletemplate = document.getElementById("overlayprofile-template");
    profiletemplate.innerHTML = "";
    profiletemplate.setAttribute("w3-include-html", "profile-template.html");
    includeHTML();
    w3.includeHTML();
  } else {
    closeoverlayprofiletemplate();
    const response2 = await fetch(GLOBAL + "users/1/contacts.json");
    const contacts = await response2.json();
    const profiletemplate = document.getElementById(
      "overlaytechinical-task-template"
    );
    profiletemplate.innerHTML = "";
    profiletemplate.setAttribute(
      "w3-include-html",
      "techinical-task-template.html"
    );
    includeHTML();
    w3.includeHTML();
  }
}

function buttontemplate(task) {
  return /*html*/ `
    <button id="oksavebutton" class="savecontact" type="button" ><span>OK</span><div> <img src="/img/checkwhite.png" alt="" /></div> </button>
  `;
}

/**
 * Saves changes made to the task by sending an update request to the server.
 * @param {Object} task - The task object containing all task details.
 */
async function savechanges(task) {
  const parentElement = document.getElementById(`${task.id}`).parentElement.id;

  // Extract current values from the UI
  const title = document.querySelector(".titleinputdesign").value;
  const description =
    document.querySelector(".description")?.children[1]?.value ||
    document.getElementById("descriptioninput")?.children[1]?.value;

  const duedate = document.getElementById("date1").value;

  // Create an object to store only the changed fields
  const changes = {};

  // Check for changes and add to the changes object
  if (title && title !== task.title) {
    changes.title = title;
  } else if (!title && task.title) {
    changes.title = task.title; // Add the current task title if no change
  }

  if (description === "") {
    changes.description = task.description;
  } else {
    changes.description = description; // Add the current task description if no change
  }

  if (duedate === "") {
    changes.duedate = task.duedate; // Add the current task due date if no change
  } else {
    changes.duedate = duedate;
  }

  if (selectedPriority === null) {
    changes.prio = task.prio;
  } else {
    changes.prio = selectedPriority; // Keep the original priority if no change
  }
  changes.category = task.category;
  if (asignedtousers.length === 0) {
    changes.asignedto = task.asignedto;
  } else {
    changes.asignedto = asignedtousers;
  }

  if (initialsArray.length === 0) {
    // If initials have changed or it's a new value
    changes.initials = task.initials;
  } else {
    changes.initials = initialsArray;
  }

  if (subtasks.length === 0) {
    changes.subtask = task.subtask; // Keep current subtasks if no change
  } else {
    changes.subtask = subtasks.map((subtask) => ({
      subtask: subtask,
      completed: false,
    }));
  }

  const response2 = await fetch(GLOBAL + "users/1/contacts.json");
  const contacts = await response2.json();

  // Include the category (if it must be sent unchanged)
  await putData(`/users/1/tasks/${parentElement}/${task.id}`, changes);

  // Reload the tasks and close the overlay
  await loadtasks();

  if (task.category === "User Story") {
    document.getElementById("overlayprofile-template").innerHTML = "";
    resetOverlayTemplate("overlayprofile-template", "profile-template.html");
    setTimeout(() => {
      inputacessprofile(task, contacts);
    }, 10);
  } else {
    document.getElementById("overlaytechinical-task-template").innerHTML = "";
    resetOverlayTemplate(
      "overlaytechinical-task-template",
      "techinical-task-template.html"
    );
    setTimeout(() => {
      inputacesstechnicall(changes, contacts);
    }, 10);
  }
}

async function resetOverlayTemplate(elementId, templatePath) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute("w3-include-html", templatePath);
    includeHTML(); // Re-run the includeHTML function to load the content
  }
}

function subtaskboxemplate() {
  return /*html*/ `
    <div class="subtaskcontainer">
                      <input
                        onclick="subtaskchangeicons()"
                        type="text"
                        id="subtaskinput0"
                        placeholder="Add New Subtask"
                        class="inputsubtask"
                      />
                      <button
                        type="button"
                        onclick="subtaskchangeicons()"
                        class="subtaskbutton"
                        id="inputsubtask11"
                      >
                        <img src="/img/plusblack.png" alt="" />
                      </button>
                      <button
                        class="subtaskbutton2 d-none"
                        onclick="resetsubtaskinput()"
                        type="button"
                        id="inputsubtask22"
                      >
                        <img src="/img/vector.png" alt="" />
                      </button>
                      <div class="seperateline d-none" id="seperate1"></div>
                      <button
                        type="button"
                        onclick="addsubtask()"
                        class="subtaskbutton3 d-none"
                        id="inputsubtask33"
                      >
                        <img src="/img/checkmark.png" alt="" />
                      </button>
                      <span class="spansubtaskdesign" id="spansubtask"></span>
                      <div id="subtasksbox11" class="subtasksbox1"></div>
                      <div id="spanplace"></div>
                    </div>
  `;
}

function titletemplate(task) {
  return /*html*/ `
    <label>Title</label>
    <input type="text" placeholder="Enter a title" class="titleinputdesign">
    `;
}

function descriptiontemplate() {
  return /*html*/ `
    <label>Description</label>
    <textarea  class="text" placeholder="Enter a Description"></textarea>
    `;
}

function duedatetemplate() {
  return /*html*/ `
<div class="buttonsalignment_1-2">
                      Due Date <span class="required-indicator">*</span>
                    </div>
                    <div class="emailinput">
                      <input
                        oninput="filternumbers(this)"
                        class="emailinput2"
                        type="datetime"
                        name="date"
                        id="date1"
                        placeholder="dd/mm/yyyy"
                        maxlength="10"
                      />
                      <span class="spansubtaskdesign" id="spandate"></span>
                    </div>`;
}

function prioritytemplate() {
  return /*html*/ `
                <label>Prio</label>
                <div class="buttons2">
                  <div class="button-container1">
                    <button
                      type="button"
                      id="button1"
                      class="buttons2_1"
                      onclick="selectbutton_1();handleButtonClick('Urgent')"
                    >
                      <span id="urgent">Urgent</span>
                      <img src="/img/Urgent.png" alt="" />
                    </button>
                  </div>
                  <div class="button-container1">
                    <button
                      type="button"
                      onclick="selectbutton_2();handleButtonClick('Medium')"
                      id="button2"
                      class="buttons2_2"
                    >
                      <span id="medium">Medium</span>
                      <img src="/img/Medium.png" alt="" />
                    </button>
                  </div>
                  <div class="button-container1">
                    <button
                      type="button"
                      onclick="selectbutton_3();handleButtonClick('Low')"
                      id="button3"
                      class="buttons2_3"
                    >
                      <span id="low">Low</span>
                      <img src="/img/Low.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            `;
}

function reselectionofcontacts() {
  return /*html*/ `
  <div class="selectbox">
                  <button
                    id="selectbutton1"
                    type="button"
                    class="selectbutton"
                    onclick="showcontacts()"
                  >
                    <span>Select contacts to assign</span
                    ><img src="/img/arrow_drop_down.png" alt="" />
                  </button>
                  <ul id="contacts-box1" class="outsidedesign"></ul>
                <div id="assignedusers1"></div>
            </div>
`;
}

async function getUserTaskss(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
  document.getElementById(
    "typeoftask"
  ).innerHTML = `${responsestoJson[0].category}`;
  document.getElementById("title").innerHTML = `${responsestoJson[0].title}`;
  document.getElementById(
    "descriptioninput"
  ).innerHTML = `${responsestoJson[0].description}`;
  document.getElementById(
    "due-date-containerinput"
  ).innerHTML = `${responsestoJson[0].duedate}`;
  document.getElementById("showprio").innerHTML = `${responsestoJson[0].prio}`;
  document.getElementById(
    "showassignedperson"
  ).innerHTML = `${responsestoJson[0].asignedto}`;
  document.getElementById(
    "showsubtask"
  ).innerHTML = `${responsestoJson[0].subtask}`;
}
