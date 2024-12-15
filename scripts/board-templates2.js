function titletemplate(task) {
  return /*html*/ `
      <label>Title</label>
      <input type="text"  placeholder="Enter a title" class="titleinputdesign">
      `;
}

function descriptiontemplate() {
  return /*html*/ `
      <label>Description</label>
      <textarea  class="text1"  placeholder="Enter a Description"></textarea>
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

function prioritytemplateprofile2_1() {
  return `<div class="button-containerss">
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
                        </div>`;
}

function prioritytemplateprofile2_2() {
  return `<div class="button-containerss">
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
                        </div>`;
}

function prioritytemplateprofile2_3() {
  return `<div class="button-containerss">
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
                        </div>`;
}

function prioritytemplateprofile() {
  return /*html*/ `
                  <label>Prio</label>
                      <div class="buttons2">
                        ${prioritytemplateprofile2_1()}
                        ${prioritytemplateprofile2_2()}
                        ${prioritytemplateprofile2_3()}
                      </div>
              `;
}

function prioritytemplatetechnicaltask2_1() {
  return ` <div class="button-containerss">
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
                        </div>`;
}

function prioritytemplatetechnicaltask2_2() {
  return `<div class="button-containerss">
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
                        </div>`;
}

function prioritytemplatetechnicaltask2_3() {
  return `<div class="button-containerss">
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
                        </div>`;
}

function prioritytemplatetechnicaltask() {
  return /*html*/ `
                  <label>Prio</label>
                      <div class="buttons2">
                       ${prioritytemplatetechnicaltask2_1()}
                       ${prioritytemplatetechnicaltask2_2()}
                      ${prioritytemplatetechnicaltask2_3()}
                      </div>
              `;
}

function reselectionofcontacts() {
  return /*html*/ `<div><label>Assigned to</label></div>
    <div class="selectbox">
                    <button
                      id="selectbutton1"
                      type="button"
                      class="selectbutton"
                      onclick="showcontacts(event)"
                    >
                      <span>Select contacts to assign</span
                      ><img src="/img/arrow_drop_down.png" alt="" />
                    </button>
                    <ul id="contacts-box1" class="outsidedesign"></ul>
                  <div id="assignedusers1"></div>
              </div>
  `;
}

function generateContactBadgeHTML(contactColor, initials, name) {
  return `
    <div>
      <div class="badge alignment" style="background-color:${contactColor}">
        ${initials}
      </div>
      <span>${name}</span>
    </div>
  `;
}
