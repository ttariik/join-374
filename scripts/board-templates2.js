/**
 * Generates HTML for a title input field.
 * @param {Object} task - The task object, though it is not used in this function.
 * @returns {string} - The HTML string for the title input field.
 */
function titletemplate(task) {
  return /*html*/ `
      <label>Title</label>
      <input type="text"  placeholder="Enter a title" class="titleinputdesign">
      `;
}

/**
 * Generates HTML for a description input field.
 * @returns {string} - The HTML string for the description textarea.
 */
function descriptiontemplate() {
  return /*html*/ `
      <label>Description</label>
      <textarea  class="text1"  placeholder="Enter a Description"></textarea>
      `;
}

/**
 * Generates HTML for a due date input field.
 * @returns {string} - The HTML string for the due date input field.
 */
function duedatetemplate() {
  return /*html*/ `
  <div class="buttonsalignment_1-2">
                        Due Date <span class="required-indicator">*</span>
                      </div>
                      <div class="emailinput2">
                      <input
                        onchange="formatDateToDDMMYYYY(this)"
                        class="emaildesign"
                        type="date"
                        name="date"
                        id="date21"
                        placeholder="dd/mm/yyyy"
                        maxlength="10"
                      />
                      <input
                        oninput="filternumbers(this)"
                        class="emaildesign2"
                        id="date23"
                        type="text"
                        placeholder="dd/mm/yyyy"
                        maxlength="10"
                      />
                    </div>
                        <span class="spansubtaskdesign" id="spandate"></span>
                      </div>`;
}

/**
 * Generates HTML for a priority selection button (Urgent).
 * @returns {string} - The HTML string for the "Urgent" priority button.
 */
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

/**
 * Generates HTML for a priority selection button (Medium).
 * @returns {string} - The HTML string for the "Medium" priority button.
 */
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

/**
 * Generates HTML for a priority selection button (Low).
 * @returns {string} - The HTML string for the "Low" priority button.
 */
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

/**
 * Generates HTML for the priority section, combining all priority buttons.
 * @returns {string} - The HTML string for the priority section.
 */
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

/**
 * Generates HTML for a priority selection button (Urgent) for technical tasks.
 * @returns {string} - The HTML string for the "Urgent" priority button (technical task).
 */
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

/**
 * Generates HTML for a priority selection button (Medium) for technical tasks.
 * @returns {string} - The HTML string for the "Medium" priority button (technical task).
 */
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

/**
 * Generates HTML for a priority selection button (Low) for technical tasks.
 * @returns {string} - The HTML string for the "Low" priority button (technical task).
 */
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

/**
 * Generates HTML for the priority section for technical tasks, combining all priority buttons.
 * @returns {string} - The HTML string for the technical task priority section.
 */
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

/**
 * Generates HTML for the contact assignment section, with a button to select contacts.
 * @returns {string} - The HTML string for the contact assignment section.
 */
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

/**
 * Generates HTML for a contact badge displaying initials and name.
 * @param {string} contactColor - The background color for the badge.
 * @param {string} initials - The initials to display on the badge.
 * @param {string} name - The name to display next to the initials.
 * @returns {string} - The HTML string for the contact badge.
 */
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
