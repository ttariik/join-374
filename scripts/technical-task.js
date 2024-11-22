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
  document.getElementById("assigned-containercontent").innerHTML =
    reselectionofcontacts(task);
  document.getElementById;
  document.getElementById("buttons").innerHTML = "";
  document.getElementById(
    "buttonss"
  ).innerHTML = `<button id="oksavebutton" type="button" >OK <img src="/img/check1 (1).png" alt="" /> </button>`;
  document.querySelector(".layout").style = "gap: 3px";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
}

function editprofile(task) {
  const titlebox = document.getElementById("userbox");
  if (titlebox) {
    titlebox.remove();
  }
  document.querySelector(".headerprofile").style.justifyContent = "flex-end";
  document.querySelector(".titlebox span").style = "line-height: unset";
  document.getElementById("profiletitle").innerHTML = titletemplate(task);
  document.getElementById("profiledescription").innerHTML =
    descriptiontemplate();

  document.getElementById("due-date-container-edit").innerHTML =
    duedatetemplate();
  document.querySelector(".due-date-container").style =
    "gap: 10px;flex-direction:column;!important";
  document.getElementById("prio").innerHTML = prioritytemplate();
  document.getElementById("profileassingedarea").innerHTML =
    reselectionofcontacts();
  document.querySelector(".button-containers").innerHTML = buttontemplate(task);
  document.querySelector(".layout").style = "gap: 3px";
  document.getElementById("subtaskbox").innerHTML = "";

  document.getElementById("subtaskarea").innerHTML = subtaskboxemplate();
  document.getElementById("subtaskarea").style = "padding: 6px 0px 60px 0";
  document.getElementById("profileassingedarea").style.gap = "unset";
  document.getElementById("subtaskinput").id = "subtaskinput15";
  document
    .getElementById("oksavebutton")
    .addEventListener("click", function () {
      savechanges(task);
    });
  document.getElementById("closebtn").addEventListener("click", function () {
    resettemplate(task);
  });
}

async function resettemplate(task) {
  if (task.category === "User Story") {
    closeoverlayprofiletemplate();
    const response2 = await fetch(GLOBAL + "users/1/contacts.json");
    const contacts = await response2.json();
    const profiletemplate = document.getElementById("overlayprofile-template");
    profiletemplate.innerHTML = "";
    profiletemplate.setAttribute("w3-include-html", "profile-template.html");
    w3.includeHTML();
  } else {
  }
}

function buttontemplate(task) {
  return /*html*/ `
    <button id="oksavebutton" type="button" >OK <img src="/img/check1 (1).png" alt="" /> </button>
  `;
}

async function savechanges(task) {
  const parentElement = document.getElementById(`${task.id}`).parentElement.id;
  console.log(parentElement);

  const title = document.querySelector(".titleinputdesign").value;
  const description = document.querySelector(".descriptionpartinput").value;
  const duedate = document.querySelector(".duedateinput").value;

  await putData(`/users/1/tasks/${parentElement}/${task.id}`, {
    title: title,
    description: description,
    duedate: duedate,
    prio: selectedPriority,
    category: `${task.category}`,
    asignedto: `${task.asignedto}`,
    initials: `${task.initials}`,
    subtask: `${task.subtasks}`,
  });
  await loadtasks();
  if (task.category === "User Story") {
    await closeoverlayprofiletemplate();
  } else {
    await closeoverlaytechnicaltemplate();
  }
}

function categorytemplate() {
  return /*html*/ `
    <div class="secondhalfbox">
                  <div>
                    <label
                      >Category<span class="required-indicator">*</span></label
                    >
                    <select name="" id="Category">
                      <option
                        disabled
                        selected
                        hidden
                        value="Select Task Category"
                      >
                        Select Task Category
                      </option>
                      <option value="Technical Task">Technical Task</option>
                      <option value="User Story">User Story</option>
                    </select>
                    <span class="spansubtaskdesign" id="spancategory"></span>
                  </div>
                  <div>
                    <label>Subtasks</label>
                    <div class="subtaskcontainer">
                      <input
                        onclick="subtaskchangeicons()"
                        type="text"
                        id="subtaskinput"
                        placeholder="Add New Subtask"
                        class="inputsubtask"
                      />
                      <button
                        type="button"
                        onclick="subtaskchangeicons()"
                        class="subtaskbutton"
                        id="inputsubtask1"
                      >
                        <img src="/img/plusblack.png" alt="" />
                      </button>
                      <button
                        class="subtaskbutton2 d-none"
                        onclick="resetsubtaskinput()"
                        type="button"
                        id="inputsubtask2"
                      >
                        <img src="/img/vector.png" alt="" />
                      </button>
                      <div class="seperateline d-none" id="seperate"></div>
                      <button
                        type="button"
                        onclick="addsubtask()"
                        class="subtaskbutton3 d-none"
                        id="inputsubtask3"
                      >
                        <img src="/img/checkmark.png" alt="" />
                      </button>
                      <span class="spansubtaskdesign" id="spansubtask"></span>
                      <div id="subtasksbox" class="subtasksbox1"></div>
                      <div id="spanplace"></div>
                    </div>
                  </div>
                </div>
  `;
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
                      <div id="subtasksbox" class="subtasksbox1"></div>
                      <div id="spanplace"></div>
                    </div>
  `;
}

function titletemplate(task) {
  return /*html*/ `<div class="headertitle">
    <label>Title</label>
    <input type="text" placeholder="Enter a title" class="titleinputdesign">
    </div>`;
}

function descriptiontemplate() {
  return /*html*/ `
    <div class="descriptionpart">
    <label>Description</label>
    <textarea  class="descriptionpartinput" placeholder="Enter a Description"></textarea>
    </div>
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
                        id="date"
                        placeholder="dd/mm/yyyy"
                        maxlength="10"
                      />
                      <span class="spansubtaskdesign" id="spandate"></span>
                    </div>`;
}

function prioritytemplate() {
  return /*html*/ `<div class="buttons">
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
            </div>`;
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
