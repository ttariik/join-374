function editinputs(task) {
  console.log(task);

  document.getElementById("type").remove();
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("title").innerHTML = titletemplate();
  document.getElementById("descriptioninput").innerHTML = descriptiontemplate();
  document.getElementById("duedatecontainer").innerHTML = duedatetemplate();
  document.getElementById("priority-containercontent").innerHTML =
    prioritytemplate();
  document.getElementById("assigned-containercontent").innerHTML =
    reselectionofcontacts();
  document.getElementById("buttons").innerHTML = "";
  document.getElementById(
    "buttons"
  ).innerHTML = `<button>OK <img "/img/checkmark.png" alt="" /> </button>`;
  document.querySelector(".layout").style = "gap: 3px";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
}

function editprofile(task) {
  document.getElementById("userbox").classList.remove("userboxprofile");
  document.getElementById("profilecategory").remove();
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.querySelector(".titlebox span").style = "line-height: unset";
  document.getElementById("profiletitle").innerHTML = titletemplate();
  document.getElementById("profiledescription").innerHTML =
    descriptiontemplate();
  document.getElementById("due-date-container-edit").innerHTML =
    duedatetemplate();
  document.getElementById("prio").innerHTML = prioritytemplate();
  document.getElementById("profileassingedarea").innerHTML =
    reselectionofcontacts();
  document.getElementById(
    "buttons"
  ).innerHTML = `<button>OK <img "/img/checkmark.png" alt="" /> </button>`;
  document.querySelector(".layout").style = "gap: 3px";
  document.getElementById("subtaskbox").innerHTML = "";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
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
                        <img src="/img/add.png" alt="" />
                      </button>
                      <button
                        class="subtaskbutton2 d-none"
                        onclick="resetsubtaskinput()"
                        type="button"
                        id="inputsubtask2"
                      >
                        <img src="/img/Vector.png" alt="" />
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
                      <div id="subtasksbox" required class="subtasksbox1"></div>
                      <div id="spanplace"></div>
                    </div>
  `;
}

function titletemplate() {
  return `<div class="headertitle">
    <label>Title</label>
    <input type="text" placeholder="Enter a title" class="titleinputdesign">
    </div>`;
}

function descriptiontemplate() {
  return `
    <div class="descriptionpart">
    <label>Description</label>
    <textarea  class="descriptionpartinput" placeholder="Enter a Description"></textarea>
    </div>
    `;
}

function duedatetemplate() {
  return `
<div class="duedateinputcontainer">
   <label>Due date</label>
   <input type="date" class="duedateinput">
</div>  `;
}

function prioritytemplate() {
  return `<div class="buttons">
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
  return `<div class="selectbox">
                  <button
                    id="selectboxbutton"
                    type="button"
                    class="selectbutton"
                    onclick="showcontacts()"
                  >
                    <span>Select contacts to assign</span
                    ><img src="/img/arrow_drop_down.png" alt="" />
                  </button>
                  <ul id="contacts-box" class="outsidedesign"></ul>
                <div id="assignedusers"></div>
            </div>`;
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
