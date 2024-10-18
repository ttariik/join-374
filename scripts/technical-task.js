function editinputs() {
  document.getElementById("type").remove();
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("title").innerHTML = titletemplate();
  document.getElementById("descriptioninput").innerHTML = descriptiontemplate();
  document.getElementById("duedatecontainer").innerHTML = duedatetemplate();
  document.getElementById("priority-containercontent").innerHTML =
    prioritytemplate();
  document.getElementById("assigned-containercontent").innerHTML =
    assignedtotemplate();
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
    <textarea class="descriptionpartinput" placeholder="Enter a Description"></textarea>
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
                      <img src="/img/Prio alta.png" alt="" />
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
                      <img src="/img/Capa 2.png" alt="" />
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
                      <img src="/img/Prio baja.png" alt="" />
                    </button>
                  </div>
                </div>
              </div>
            </div>`;
}

function assignedtotemplate() {
  return `<div class="selectbox">
              <div><label>Assigned to</label></div>
              <div>
                <select class="selection" name="" id="asignment">
                  <option
                    disabled
                    selected
                    hidden
                    value="Select Contacts to asign"
                  >
                    Select Contacts to asign
                  </option>
                  <option value="task1">task1</option>
                </select>
              </div>
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
