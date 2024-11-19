function editinputs(task) {
  console.log(task);
  document.getElementById("type").remove();
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("title").innerHTML = titletemplate(task);
  document.getElementById("descriptioninput").innerHTML = descriptiontemplate();
  document.getElementById("duedatecontainer").innerHTML = duedatetemplate();
  document.getElementById("priority-containercontent").innerHTML =
    prioritytemplate();
  document.getElementById("assigned-containercontent").innerHTML =
    reselectionofcontacts(task);
  document.getElementById("buttons").innerHTML = "";
  document.getElementById(
    "buttons"
  ).innerHTML = `<button>OK <img "/img/checkmark.png" alt="" /> </button>`;
  document.querySelector(".layout").style = "gap: 3px";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
}

function editprofile(task) {
  document.getElementById("userbox").remove();
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.querySelector(".titlebox span").style = "line-height: unset";
  document.getElementById("profiletitle").innerHTML = titletemplate(task);
  document.getElementById("profiledescription").innerHTML =
    descriptiontemplate();
  document.getElementById("due-date-container-edit").innerHTML =
    duedatetemplate();
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
}

function buttontemplate(task) {
  return /*html*/ `
    <button id="oksavebutton" type="button" >OK <img src="/img/check1 (1).png" alt="" /> </button>
  `;
}

async function savechanges(task) {
  const title = document.querySelector(".titleinputdesign").value;
  const description = document.querySelector(".descriptionpartinput").value;
  const duedate = document.querySelector(".duedateinput").value;

  await putData(`/users/1/tasks/${task.id}`, {
    title: title,
    description: description,
    duedate: duedate,
    selectedPriority: selectedPriority,
  });
  loadtasks();
}

function categorytemplate() {
  return /*html*/ `
    <div class="firsthalfbox">
                  <div class="emailbox">
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
<div class="duedateinputcontainer">
   <label>Due date</label>
   <input type="date" class="duedateinput">
</div>  `;
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
  return /*html*/ `<div class="selectbox">
                  <button
                    id="selectboxbutton"
                    type="button"
                    class="selectbutton"
                    onclick="showcontacts()"
                  >
                    <span>Select contacts to assign</span
                    ><img src="/img/arrow_drop_down.png" alt="" />
                  </button>
                  
            </div>
            <ul id="contacts-box" class="outsidedesign"></ul>
                <div id="assignedusers"></div>`;
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
