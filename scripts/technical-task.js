/**
 * Edits the inputs for a task and updates the UI accordingly.
 * @param {Object} task - The task object containing task details.
 */

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
    prioritytemplatetechnicaltask();
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

  loadinfos(task);
}

async function loadinfos(task) {
  // Resetting shared variables
  subtasks = [];
  asignedtousers = [];
  initialsArray = [];
  document.getElementById("assignedusers1").innerHTML = "";

  if (task.category === "Technical Task") {
    document.getElementById("technicaltasktitle").children[1].value =
      task.title;

    document.getElementById("date1").value = task.duedate;

    showsavedinitials(task);
    loadsubtasks(task);

    document.getElementById("button11").addEventListener("click", function () {
      selectbutton_11(task);
    });
    document.getElementById("button22").addEventListener("click", function () {
      selectbutton_22(task);
    });
    document.getElementById("button33").addEventListener("click", function () {
      selectbutton_33(task);
    });

    // Set priority based on task.prio
    if (task.prio === "Urgent") {
      selectbutton_11(task);
    } else if (task.prio === "Medium") {
      selectbutton_22(task);
    } else if (task.prio === "Low") {
      selectbutton_33(task);
    }
  } else {
    document.querySelector(".titleinputdesign").value = task.title;
    document.getElementById("date1").value = task.duedate;

    await showsavedinitials(task);
    loadsubtasks(task);

    document.getElementById("button1-1").addEventListener("click", function () {
      selectbutton_11(task);
    });
    document.getElementById("button2-2").addEventListener("click", function () {
      selectbutton_22(task);
    });
    document.getElementById("button3-3").addEventListener("click", function () {
      selectbutton_33(task);
    });

    // Set priority based on task.prio
    if (task.prio === "Urgent") {
      selectbutton_11(task);
    } else if (task.prio === "Medium") {
      selectbutton_22(task);
    } else if (task.prio === "Low") {
      selectbutton_33(task);
    }
  }

  // Update all inputs with task description
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}

async function showsavedinitials(task) {
  // Clear previous badges to avoid duplicates
  document.getElementById("assignedusers1").innerHTML = "";

  // Fetch all contacts once
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  if (!response.ok) {
    console.error("Failed to fetch contacts");
    return;
  }

  const responsestoJson = await response.json();
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

  // Create a Map for quick lookup by initials
  const contactMap = new Map(
    entries
      .filter((contact) => contact)
      .map((contact) => [contact.initials, contact])
  );

  // Process assigned users
  for (let index = 0; index < task.asignedto.length; index++) {
    const assignedInitial = task.asignedto[index];
    const selectedContact = contactMap.get(assignedInitial);

    if (selectedContact) {
      const badge = document.createElement("div");
      badge.className = "badgeassigned badge";
      badge.style.width = "32px";
      badge.style.height = "32px";
      badge.id = `${selectedContact.id}_${index}`;
      badge.style.backgroundColor = selectedContact.color;
      badge.textContent = selectedContact.initials;

      // Avoid duplicate badges
      if (!document.getElementById(badge.id)) {
        document.getElementById("assignedusers1").appendChild(badge);
        badge.style.marginLeft = "0";
      }

      // Push to initialsArray
      initialsArray.push({
        id: selectedContact.id,
        initials: selectedContact.initials,
        name: selectedContact.name,
      });
    } else {
      console.error(`No contact found for initials: ${assignedInitial}`);
    }
  }
}

function selectbutton_11(task) {
  if (task.category === "Technical Task") {
    document.getElementById("button11").classList.toggle("lightred");
    document.getElementById("button22").classList.remove("lightorange");
    document.getElementById("button33").classList.remove("lightgreen");

    const urgentImg = document.getElementById("urgentImg11");
    urgentImg.src = urgentImg.src.includes("Urgent.png")
      ? "/img/urgent-white.png"
      : "/img/Urgent.png";

    const urgentText = document.getElementById("urgent11");
    urgentText.style.color =
      urgentText.style.color === "white" ? "black" : "white";

    document.getElementById("mediumImg22").src = "/img/Medium.png";
    document.getElementById("lowImg33").src = "/img/Low.png";
    document.getElementById("medium22").style.color = "black";
    document.getElementById("low33").style.color = "black";
    selectedPriority = "Urgent";
  } else {
    document.getElementById("button1-1").classList.toggle("lightred");
    document.getElementById("button2-2").classList.remove("lightorange");
    document.getElementById("button3-3").classList.remove("lightgreen");

    const urgentImg = document.getElementById("urgentImg1-1");
    urgentImg.src = urgentImg.src.includes("Urgent.png")
      ? "/img/urgent-white.png"
      : "/img/Urgent.png";

    const urgentText = document.getElementById("urgent1-1");
    urgentText.style.color =
      urgentText.style.color === "white" ? "black" : "white";

    document.getElementById("mediumImg2-2").src = "/img/Medium.png";
    document.getElementById("lowImg3-3").src = "/img/Low.png";
    document.getElementById("medium2-2").style.color = "black";
    document.getElementById("low3-3").style.color = "black";
    selectedPriority = "Urgent";
  }
}

function selectbutton_22(task) {
  if (task.category === "Technical Task") {
    document.querySelector("#button11").classList.remove("lightred");
    document.querySelector("#button22").classList.toggle("lightorange");
    document.querySelector("#button33").classList.remove("lightgreen");

    const mediumImg = document.getElementById("mediumImg22");
    mediumImg.src = mediumImg.src.includes("Medium.png")
      ? "/img/medium-white.png"
      : "/img/Medium.png";

    const mediumText = document.getElementById("medium22");
    mediumText.style.color =
      mediumText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg11").src = "/img/Urgent.png";
    document.getElementById("lowImg33").src = "/img/Low.png";
    document.getElementById("urgent11").style.color = "black";
    document.getElementById("low33").style.color = "black";
    selectedPriority = "Medium";
  } else {
    document.querySelector("#button1-1").classList.remove("lightred");
    document.querySelector("#button2-2").classList.toggle("lightorange");
    document.querySelector("#button3-3").classList.remove("lightgreen");

    const mediumImg = document.getElementById("mediumImg2-2");
    mediumImg.src = mediumImg.src.includes("Medium.png")
      ? "/img/medium-white.png"
      : "/img/Medium.png";

    const mediumText = document.getElementById("medium2-2");
    mediumText.style.color =
      mediumText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg1-1").src = "/img/Urgent.png";
    document.getElementById("lowImg3-3").src = "/img/Low.png";
    document.getElementById("urgent1-1").style.color = "black";
    document.getElementById("low3-3").style.color = "black";
    selectedPriority = "Medium";
  }
}

function selectbutton_33(task) {
  if (task.category === "Technical Task") {
    document.getElementById("button11").classList.remove("lightred");
    document.getElementById("button22").classList.remove("lightorange");
    document.getElementById("button33").classList.toggle("lightgreen");

    const lowImg = document.getElementById("lowImg33");
    lowImg.src = lowImg.src.includes("Low.png")
      ? "/img/low-white.png"
      : "/img/Low.png";

    const lowText = document.getElementById("low33");
    lowText.style.color = lowText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg11").src = "/img/Urgent.png";
    document.getElementById("mediumImg22").src = "/img/Medium.png";
    document.getElementById("urgent11").style.color = "black";
    document.getElementById("medium22").style.color = "black";
    selectedPriority = "Low";
  } else {
    document.getElementById("button1-1").classList.remove("lightred");
    document.getElementById("button2-2").classList.remove("lightorange");
    document.getElementById("button3-3").classList.toggle("lightgreen");

    const lowImg = document.getElementById("lowImg3-3");
    lowImg.src = lowImg.src.includes("Low.png")
      ? "/img/low-white.png"
      : "/img/Low.png";

    const lowText = document.getElementById("low3-3");
    lowText.style.color = lowText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg1-1").src = "/img/Urgent.png";
    document.getElementById("mediumImg2-2").src = "/img/Medium.png";
    document.getElementById("urgent1-1").style.color = "black";
    document.getElementById("medium2-2").style.color = "black";
    selectedPriority = "Low";
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
  document.getElementById("prio").innerHTML = prioritytemplateprofile();
  selectbutton_22(task);

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
  loadinfos(task);
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
    <input type="text" maxlength="15" placeholder="Enter a title" class="titleinputdesign">
    `;
}

function descriptiontemplate() {
  return /*html*/ `
    <label>Description</label>
    <textarea  class="text1" maxlength="15" placeholder="Enter a Description"></textarea>
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

function prioritytemplateprofile() {
  return /*html*/ `
                <label>Prio</label>
                    <div class="buttons2">
                      <div class="button-containerss">
                        <button
                          type="button"
                          id="button1-1"
                          class="buttons2_1"
                          onclick="handleButtonClick('Urgent')"
                        >
                          <span id="urgent1-1">Urgent</span>
                          <img id="urgentImg1-1" src="/img/Urgent.png" alt="" />
                          <img
                            id="urgentWhiteImg1-1"
                            src="/img/urgent-white.png"
                            alt="urgent white"
                            class="hidden"
                          />
                        </button>
                      </div>
                      <div class="button-containerss">
                        <button
                          type="button"
                          onclick="handleButtonClick('Medium')"
                          id="button2-2"
                          class="buttons2_2"
                        >
                          <span id="medium2-2">Medium</span>
                          <img
                            id="mediumImg2-2"
                            src="/img/Medium.png"
                            alt="medium task"
                          />
                          <img
                            id="mediumWhiteImg2-2"
                            src="/img/medium-white.png"
                            alt="medium white"
                            class="hidden"
                          />
                        </button>
                      </div>
                      <div class="button-containerss">
                        <button
                          type="button"
                          onclick="handleButtonClick('Low')"
                          id="button3-3"
                          class="buttons2_3"
                        >
                          <span id="low3-3">Low</span>
                          <img id="lowImg3-3" src="/img/Low.png" alt="low task" />
                          <img
                            id="lowWhiteImg3-3"
                            src="/img/low-white.png"
                            alt="low white"
                            class="hidden"
                          />
                        </button>
                      </div>
                    </div>
            `;
}

function prioritytemplatetechnicaltask() {
  return /*html*/ `
                <label>Prio</label>
                    <div class="buttons2">
                      <div class="button-containerss">
                        <button
                          type="button"
                          id="button11"
                          class="buttons2_1"
                          onclick="handleButtonClick('Urgent')"
                        >
                          <span id="urgent11">Urgent</span>
                          <img id="urgentImg11" src="/img/Urgent.png" alt="" />
                          <img
                            id="urgentWhiteImg11"
                            src="/img/urgent-white.png"
                            alt="urgent white"
                            class="hidden"
                          />
                        </button>
                      </div>
                      <div class="button-containerss">
                        <button
                          type="button"
                          onclick="handleButtonClick('Medium')"
                          id="button22"
                          class="buttons2_2"
                        >
                          <span id="medium22">Medium</span>
                          <img
                            id="mediumImg22"
                            src="/img/Medium.png"
                            alt="medium task"
                          />
                          <img
                            id="mediumWhiteImg22"
                            src="/img/medium-white.png"
                            alt="medium white"
                            class="hidden"
                          />
                        </button>
                      </div>
                      <div class="button-containerss">
                        <button
                          type="button"
                          onclick="handleButtonClick('Low')"
                          id="button33"
                          class="buttons2_3"
                        >
                          <span id="low33">Low</span>
                          <img id="lowImg33" src="/img/Low.png" alt="low task" />
                          <img
                            id="lowWhiteImg33"
                            src="/img/low-white.png"
                            alt="low white"
                            class="hidden"
                          />
                        </button>
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
