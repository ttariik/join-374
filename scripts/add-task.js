let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null;
let subtasks = [];
let initialsarra = [];
let asignedtousers = [];
let usernamecolor = [];
let initialsArray = [];

function selectbutton_1() {
  document.getElementById("button1").classList.toggle("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");

  const urgentImg = document.getElementById("urgentImg");
  urgentImg.src = urgentImg.src.includes("Urgent.png")
    ? "/img/urgent-white.png"
    : "/img/Urgent.png";

  const urgentText = document.getElementById("urgent");
  urgentText.style.color =
    urgentText.style.color === "white" ? "black" : "white";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";
  selectedPriority = "Urgent"; // Set priority to "Urgent"
}

function selectbutton_2() {
  document.getElementById("button2").classList.toggle("lightorange");
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button3").classList.remove("lightgreen");

  const mediumImg = document.getElementById("mediumImg");
  mediumImg.src = mediumImg.src.includes("Medium.png")
    ? "/img/medium-white.png"
    : "/img/Medium.png";

  const mediumText = document.getElementById("medium");
  mediumText.style.color =
    mediumText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("lowImg").src = "/img/Low.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("low").style.color = "black";
  selectedPriority = "Medium"; // Set priority to "Urgent"
}

function selectbutton_3() {
  document.getElementById("button3").classList.toggle("lightgreen");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightred");

  const lowImg = document.getElementById("lowImg");
  lowImg.src = lowImg.src.includes("Low.png")
    ? "/img/low-white.png"
    : "/img/Low.png";

  const lowText = document.getElementById("low");
  lowText.style.color = lowText.style.color === "white" ? "black" : "white";
  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
  selectedPriority = "Low"; // Set priority to "Urgent"
}

function clearinputs() {
  document.getElementById("myform").reset();
  emptyinputs();
}

function resetsubtaskinput() {
  subtaskiconsreset();
}

function handleButtonClick(priority) {
  selectedPriority = priority;
}

function checkAddTaskInputs() {
  // Get input values
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = document.getElementById("date").value.trim();
  const category = document.getElementById("Category").value;
  const assignedUsers =
    document.getElementById("assignedusers").children.length;
  const subtasks = document.querySelectorAll(".subbox1 ").length;
  const createTaskButton = document.querySelector(".bt2");

  const isFormValid =
    title &&
    description &&
    assignedUsers > 0 &&
    selectedPriority &&
    dueDate &&
    category !== "Select Task Category" &&
    subtasks >= 0 &&
    subtasks <= 2;

  if (isFormValid) {
    createTaskButton.disabled = false;
    createTaskButton.style.backgroundColor = "#2a3647";
    createTaskButton.classList.add("enabled-hover");
  } else {
    createTaskButton.disabled = true;
    createTaskButton.style.backgroundColor = "#d3d3d3";
    createTaskButton.classList.remove("enabled-hover");
  }
}

function initializeFormCheck() {
  const inputs = document.querySelectorAll(
    "#title, #description, #date, #Category"
  );
  const priorityButtons = document.querySelectorAll(
    "#button1, #button2, #button3"
  );
  const subtaskInput = document.getElementById("subtaskinput");

  inputs.forEach((input) =>
    input.addEventListener("input", checkAddTaskInputs)
  );
  priorityButtons.forEach((button) =>
    button.addEventListener("click", () => {
      getSelectedPriority(button);
      checkAddTaskInputs();
    })
  );
  subtaskInput.addEventListener("input", checkAddTaskInputs);

  checkAddTaskInputs();
}

async function addtask(event) {
  event.preventDefault();

  const form = document.querySelector("form");
  if (validateTaskForm()) {
    let userResponse = await getAllUsers("users");
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;
    let duedate = document.getElementById("date").value;
    let category = document.getElementById("Category").value;
    let UserKeyArray = Object.keys(userResponse);

    for (let index = 0; index < UserKeyArray.length; index++) {
      users.push({
        id: UserKeyArray[index],
        user: userResponse[UserKeyArray[index]],
      });
    }
    await addEditSingleUser((id = 1), {
      title: title,
      description: description,
      asignedto: asignedtousers,
      prio: selectedPriority,
      duedate: duedate,
      category: category,
      subtask: subtasks.map((subtask) => ({
        subtask: subtask,
        completed: false,
      })),
      initials: initialsArray,
    });
    emptyinputs();
  } else {
  }
}

function emptyinputs() {
  let form = document.querySelector("form");
  form.reset();
  document.getElementById("assignedusers").innerHTML = "";
  document.getElementById("subtasksbox").innerHTML = "";

  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");

  document.getElementById("urgentImg").src = "/img/Urgent.png";
  document.getElementById("mediumImg").src = "/img/Medium.png";
  document.getElementById("lowImg").src = "/img/Low.png";

  document.getElementById("urgent").style.color = "black";
  document.getElementById("medium").style.color = "black";
  document.getElementById("low").style.color = "black";

  asignedtousers = [];
  subtasks = [];
  initialsArray = [];
}

async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responsetoJson = await response.json());
}

async function addEditSingleUser(id = 1, tasks) {
  let usertasks = await getUserTasks(id);
  if (!usertasks) {
    usertasks = {};
  }
  let existingIndexes = Object.keys(usertasks).map(Number);
  let nextIndex =
    existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;
  await putData(`users/${id}/tasks/todo-folder/${nextIndex}`, tasks);
}

async function getUserTaskss(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
}

async function getUserTasks(id) {
  let response = await fetch(
    GLOBAL +
      `users/${id}/tasks/todo-folder
.json`
  );
  return await response.json();
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

function subtaskchangeicons() {
  if (
    document.querySelector("#inputsubtask11, #inputsubtask22, #inputsubtask33")
  ) {
    document.getElementById("inputsubtask11").classList.add("d-none");
    document.getElementById("inputsubtask22").classList.remove("d-none");
    document.getElementById("inputsubtask33").classList.remove("d-none");
    document.getElementById("seperate1").classList.remove("d-none");
  } else {
    document.getElementById("inputsubtask1").classList.add("d-none");
    document.getElementById("inputsubtask2").classList.remove("d-none");
    document.getElementById("inputsubtask3").classList.remove("d-none");
    document.getElementById("seperate").classList.remove("d-none");
  }
}

function subtaskiconsreset() {
  if (
    document.querySelector("#inputsubtask11, #inputsubtask22, #inputsubtask33")
  ) {
    document.getElementById("inputsubtask11").classList.remove("d-none");
    document.getElementById("inputsubtask22").classList.add("d-none");
    document.getElementById("inputsubtask33").classList.add("d-none");
    document.getElementById("seperate1").classList.add("d-none");
    document.getElementById("subtaskinput0").value = "";
  } else {
    document.getElementById("inputsubtask1").classList.remove("d-none");
    document.getElementById("inputsubtask2").classList.add("d-none");
    document.getElementById("inputsubtask3").classList.add("d-none");
    document.getElementById("seperate").classList.add("d-none");
    document.getElementById("subtaskinput").value = "";
  }
}

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

function hidesubeditbuttons(event, index) {
  const subtaskBox = document.getElementById(`subboxinput_${index}`);
  if (subtaskBox) {
    const buttons = subtaskBox.querySelectorAll(".buttondesign");
    buttons.forEach((button) => button.classList.add("d-none"));
  }
}

function resetsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  subtaskinput1.value = "";
  document.getElementById("subtasksbox").innerHTML = "";
}

function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
    <div class="subbox1 subs${subtasks.length}" id="subboxinput_${subtasks.length}"  data-index="${subtasks.length}" >
      <div class="subbox_11">
      <div id="dot">•</div>
      <div id="sub${subtasks.length}" onclick="editsubtask(${subtasks.length})">${subtaskinput1}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${subtasks.length}" onclick="editsubtask(${subtasks.length})" class="buttondesign d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${subtasks.length}" type="button" class="buttondesign d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${subtasks.length}" type="button" class="buttondesign1 d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
    </div>
  `;
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

  document.getElementById(`subboxinput_${index}`).innerHTML = `
    <input id="inputsub${index}" class="editinput" type="text" placeholder="Edit subtask" />
    <div class="subbox_22">
      <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
  `;

  const inputField = document.getElementById(`inputsub${index}`);
  inputField.focus();
}

function deletesub(index) {
  const subtaskElement = document.getElementById(`sub${index}`);
  if (subtaskElement) {
    const result = subtaskElement.innerHTML.trim();
  }

  subtasks.splice(index - 1, 1);

  const subtaskContainer = document.getElementById(`subboxinput_${index}`);
  if (subtaskContainer) {
    subtaskContainer.remove();
  } else {
  }
}

function savesub(index) {
  const result = document.getElementById(`inputsub${index}`).value.trim();

  subtasks[index - 1] = result;

  const subboxElement = document.getElementById(`inputsub${index}`);

  document.getElementById(
    `subboxinput_${index}`
  ).innerHTML = `<div class="subbox_11" >
      <div id="dot">•</div>
      <div id="sub${index}" onclick="editsubtask(${index})">${result}</div>
      </div>
      <div class="subbox_22">
      <button type="button" id="editsub${index}" class="buttondesign0 d-none"><img src="/img/edit.png" alt=""></button>
      <button id="deletesub${index}" type="button" class="buttondesign0"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button id="savesub${index}" type="button" class="buttondesign1"><img src="/img/check1 (1).png" alt="Check" /></button>
      </div>
      </div>`;
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
}

function smallerfunction() {
  if (document.querySelector("#contacts-box1,#selectbutton1")) {
    document.getElementById("contacts-box1").style.display = "flex";
    document.getElementById("selectbutton1").onclick = "";
  } else {
    document.getElementById("contacts-box").style.display = "flex";
    document.getElementById("selectbutton").onclick = "";
  }
}

async function showcontacts() {
  smallerfunction();
  let response = await fetch(GLOBAL + `users/1/contacts.json`);
  let responsestoJson = await response.json();

  responsestoJson = Object.entries(responsestoJson).map(
    ([firebaseId, contact]) => {
      if (contact && contact.name) {
        return {
          firebaseId,
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
        };
      }
      return null;
    }
  );
  if (document.getElementById("selectbutton1")) {
    document.getElementById("selectbutton1").onclick = resetsearchbar;
    document.getElementById("selectbutton1").innerHTML = searchbar();
  } else {
    document.getElementById("selectbutton").onclick = resetsearchbar;

    document.getElementById("selectbutton").innerHTML = searchbar();
  }

  let contactHTML = "";

  responsestoJson.forEach((contact) => {
    if (contact !== null) {
      users.push(contact.name);
      const color = getColorFromString(contact.name);
      usernamecolor.push(color);

      contactHTML += contactstemplate(contact, color);
    }
  });
  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box1").innerHTML = contactHTML;
  } else {
    document.getElementById("contacts-box").innerHTML = contactHTML;
  }
}

function resetsearchbar() {
  if (document.getElementById("selectbutton1")) {
    document.getElementById("contacts-box1").innerHTML = "";
    document.getElementById("selectbutton1").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />`;
    document.getElementById("contacts-box1").style.display = "none";

    document.getElementById("selectbutton1").onclick = showcontacts;
  } else {
    document.getElementById("contacts-box").style.display = "none";
    document.getElementById("selectbutton").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />
  `;

    if ((document.getElementById("contacts-box").style.display = "flex")) {
      document.getElementById("contacts-box").style.display = "none";
    } else {
      document.getElementById("contacts-box").style.display = "flex";
    }
  }
}

function searchbar() {
  return /*html*/ `
  <input type="text" class="searchbar"> <img src="/img/drop-up-arrow.png" alt="">
  `;
}

function contactstemplate(contact, color) {
  return /*html*/ `
    <li class="contact-menudesign" id="div${contact.id}" onclick="selectcontact(${contact.id})">
      <div class="splitdivs">
        <div class="contactbox-badge" style="background-color:${color}">${contact.initials}</div>
        <div>${contact.name}</div>
      </div>
      <label class="custom-checkbox" >
        <input type="checkbox" id="checkbox${contact.id}" class="checkboxdesign" />
        <span class="checkmark" ></span>
      </label>
    </li>
  `;
}

async function variables(contact) {
  const contactDiv = document.getElementById(`div${contact.id}`);
  const checkbox = document.getElementById(`checkbox${contact.id}`);

  const initials = contact.initials;
  const color = contact.color;
  const assignedUsersDiv =
    document.getElementById("assignedusers1") ||
    document.getElementById("assignedusers");
  return { contactDiv, checkbox, initials, color, assignedUsersDiv };
}

async function selectcontact(id) {
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
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

  const selectedContact = entries.find(
    (contact) => contact && contact.id === String(id)
  );

  const { contactDiv, checkbox, initials, color, assignedUsersDiv } =
    await variables(selectedContact);

  checkbox.addEventListener("change", () => {
    checkbox.checked = !checkbox.checked;
    if (checkbox.checked) {
      contactDiv.classList.add("dark-blue");

      contactDiv.addEventListener("click", () => {
        checkbox.checked = false;
        contactDiv.classList.remove("dark-blue");

        elsefunction(initials, selectedContact.id);
      });

      iffunction(
        initials,
        selectedContact.name,
        color,
        contactDiv,
        assignedUsersDiv,
        selectedContact.id
      );
    } else {
      contactDiv.classList.remove("dark-blue");
      elsefunction(initials, selectedContact.id);
    }
  });

  checkbox.dispatchEvent(new Event("change"));
  checkAddTaskInputs();
}

function iffunction(
  initials,
  name,
  color,
  contactDiv,
  assignedUsersDiv,
  firebaseId
) {
  if (!asignedtousers.includes(initials)) {
    asignedtousers.push(initials);

    initialsArray.push({
      id: firebaseId,
      initials: initials,
      name: name,
    });
    const badge = document.createElement("div");
    badge.className = "badgeassigned badge";
    badge.style.backgroundColor = color;
    badge.textContent = initials;
    assignedUsersDiv.appendChild(badge);
    if (document.getElementById("assignedusers1")) {
      document.getElementById("assignedusers1").children[0].style.width =
        "40px";
      document.getElementById("assignedusers1").children[0].style.height =
        "40px";
    } else {
    }
    if (document.getElementById("assignedusers")) {
      document.getElementById("assignedusers").children[0].style.width = "40px";
      document.getElementById("assignedusers").children[0].style.height =
        "40px";
    } else {
    }

    const assignedUsers1 = document.getElementById("assignedusers1");

    if (assignedUsers1 && assignedUsers1.children[0]) {
      assignedUsers1.style.display = "flex";
      assignedUsers1.style.marginLeft = "20px";
      assignedUsers1.children[0].style.marginLeft = "0";
      document.getElementById("contacts-box1").style.top = "46%";
      document.getElementById("contacts-box1").style.maxWidth = "422px%";
    } else {
    }
  } else {
    const index = asignedtousers.indexOf(initials);
    if (index !== -1) {
      asignedtousers.splice(index, 1);
    }

    const objIndex = initialsArray.findIndex(
      (item) => item.initials === initials
    );
    if (objIndex !== -1) {
      initialsArray.splice(objIndex, 1);
    }

    const badge = document.querySelector(
      `.badgeassigned[data-initials="${initials}"]`
    );
    if (badge) {
      badge.remove();
    }
  }
}

function elsefunction(initials, firebaseId) {
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== firebaseId);
}

function filternumbers(input) {
  let value = input.value.replace(/[^0-9]/g, "");

  if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
  if (value.length > 5) value = value.slice(0, 5) + "/" + value.slice(5, 10);
  if (value.length > 0) {
    const day = value.slice(0, 2);
    if (day[0] > "3") value = "3" + value.slice(1);
    if (day[0] === "3" && day[1] > "1") value = "31" + value.slice(2);
  }
  if (value.length > 3) {
    const month = value.slice(3, 5);
    if (month[0] > "1") value = value.slice(0, 3) + "1";
    if (month[0] === "1" && month[1] > "2") value = value.slice(0, 4) + "2";
  }
  if (value.length > 6) {
    const year = value.slice(6, 10);
    if (year[0] !== "2") value = value.slice(0, 6) + "2";
    if (year[1] !== "0") value = value.slice(0, 7) + "0";
    if (year[2] !== "2") value = value.slice(0, 8) + "2";
    if (year[3] && (year[3] < "4" || year[3] > "9")) {
      value = value.slice(0, 8) + "2";
    }
  }
  input.value = value;
}
function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let r = (hash >> 24) & 0xff;
  let g = (hash >> 16) & 0xff;
  let b = (hash >> 8) & 0xff;
  const lightnessFactor = 0.4;
  r = Math.floor(r + (255 - r) * lightnessFactor);
  g = Math.floor(g + (255 - g) * lightnessFactor);
  b = Math.floor(b + (255 - b) * lightnessFactor);
  return `rgb(${r}, ${g}, ${b})`;
}

document.addEventListener("DOMContentLoaded", () => {
  const requiredmessage = document.getElementById("requiredmessage");
  const parent = document.getElementById("parent");
  const spanplace = document.getElementById("spanplace");

  if (requiredmessage && parent && spanplace) {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 400) {
        spanplace.appendChild(requiredmessage);
      } else {
        parent.insertBefore(requiredmessage, parent.firstChild);
      }
    });
  }
});

function validateTaskForm() {
  let isValid = true;

  clearValidationMessages();

  const title = document.getElementById("title").value.trim();
  if (title === "") {
    isValid = false;
    displayError("spantitle", "Please select a title.");
  }

  const description = document.getElementById("description").value.trim();
  if (description === "") {
    isValid = false;
    displayError("spandescription", "Please enter a description.");
  }

  if (document.getElementById("assignedusers1")) {
    const assignedUsers =
      document.getElementById("assignedusers1").children.length;
    if (assignedUsers === 0) {
      isValid = false;
      displayError("spantasignedbox", "Please select a contact.");
    }
  } else {
    const assignedUsers =
      document.getElementById("assignedusers").children.length;
    if (assignedUsers === 0) {
      isValid = false;
      displayError("spantasignedbox", "Please select a contact.");
    }
  }

  const dateInput = document.getElementById("date").value.trim();
  const dateElement = document.getElementById("date");

  if (dateInput === "") {
    isValid = false;
    displayError("spandate", "Please enter a date.");
  } else {
    const dueDate = new Date(dateInput);
    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (isNaN(dueDate.getTime())) {
      isValid = false;
      displayError("spandate", "Please enter a valid date.");
    } else if (dueDate < today) {
      isValid = false;
      displayError("spandate", "Due date cannot be in the past.");
    } else {
      clearError("spandate");
    }
  }

  function clearError(spanId) {
    const errorElement = document.getElementById(spanId);
    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  const priority = getSelectedPriority();
  if (!priority) {
    isValid = false;
    displayError("spanprio", "Please select a priority.");
  }

  const category = document.getElementById("Category").value;
  if (category === "" || category === "Select Task Category") {
    isValid = false;
    displayError("spancategory", "Please select a category.");
  }

  const subtasks = document.querySelectorAll(".subbox1 ").length;
  if (subtasks < 2) {
    isValid = true;
  } else if (subtasks > 2) {
    isValid = false;
    displayError("spansubtask", "You can only add up to 2 subtasks.");
    return isValid;
  }
  return isValid;
}

function displayError(elementId, message) {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.classList.add("error-message");
}

function getSelectedPriority() {
  const buttons = document.querySelectorAll(".buttons2 button");
  for (let button of buttons) {
    if (button.classList.contains("selected")) {
      return true;
    }
  }
  return false;
}

function clearValidationMessages() {
  const errorElements = document.querySelectorAll(".error-message");
  errorElements.forEach((element) => {
    element.textContent = "";
    element.classList.remove("error-message");
  });
}

function handleButtonClick(priority) {
  const buttons = document.querySelectorAll(".buttons2 button");
  buttons.forEach((button) => {
    if (button.querySelector("span").textContent === priority) {
      button.classList.add("selected");
    } else {
      button.classList.remove("selected");
    }
  });
}
