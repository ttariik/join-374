let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null;
let subtasks = [];
let initialsarra = [];
let asignedtousers = [];
let usernamecolor = [];
let initialsArray = [];
let contacts = []; // Array to hold the contact data.

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
  selectedPriority = "Urgent";
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
  selectedPriority = "Medium";
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
  selectedPriority = "Low";
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
  showsuccesstaskmessage();
}

function showsuccesstaskmessage() {
  if (document.getElementById("overlaysuccesstaskprofile")) {
    document
      .getElementById("overlaysuccesstaskprofile")
      .classList.add("overlay");
    document.getElementById("overlaysuccesstaskprofile").style.transform =
      "translateX(0)";

    document.getElementById("overlaysuccesstaskprofile").innerHTML =
      sucsessfullycreatedtasktemplate();
    setTimeout(() => {
      document.getElementById("overlaysuccesstaskprofile").style.transform =
        "translateX(250%)";
    }, 1500);
  } else {
    document.getElementById("overlaysuccesstask").classList.add("overlay");
    document.getElementById("overlaysuccesstask").style.transform =
      "translateX(0)";

    document.getElementById("overlaysuccesstask").innerHTML =
      sucsessfullycreatedtasktemplate();
    setTimeout(() => {
      document.getElementById("overlaysuccesstask").style.transform =
        "translateX(250%)";
    }, 1500);
  }
}

function sucsessfullycreatedtasktemplate() {
  return /*html*/ `
    <div class="successdesign">
      <div class="successoverlay"><span class="successdesign_span">Task added to board</span><img src="/img/board.png" alt=""></div>
    </div>   
`;
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
  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box1").innerHTML = "";
    document.getElementById("selectbutton1").onclick = showcontacts;
  } else {
    document.getElementById("contacts-box").innerHTML = "";
    document.getElementById("selectbutton").onclick = showcontacts;
  }
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

function showcontactbox() {
  if (document.getElementById("contacts-box")) {
    document.getElementById("contacts-box").classList.remove("d-none");
    document.getElementById("selectbutton").onclick = resetsearchbar;
    document.getElementById("selectbutton").innerHTML = searchbar();

    document.getElementById("contacts-box").style.display = "flex";
  }
  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box").classList.remove("d-none");
    document.getElementById("selectbutton").onclick = resetsearchbar;
    document.getElementById("selectbutton1").innerHTML = searchbar();
    document.getElementById("contacts-box1").style.display = "flex";
    document.ge;
  }
}

async function showcontacts() {
  smallerfunction();
  let response = await fetch(GLOBAL + `users/1/contacts.json`);
  let responsestoJson = await response.json();

  // Process the response to create a list of contact objects
  contacts = Object.entries(responsestoJson)
    .map(([firebaseId, contact]) => {
      if (contact && contact.name) {
        return {
          firebaseId,
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
        };
      }
      return null;
    })
    .filter((contact) => contact !== null);

  // Initialize the search bar
  if (document.getElementById("selectbutton1")) {
    document.getElementById("selectbutton1").onclick = resetsearchbar;
    document.getElementById("selectbutton1").innerHTML = searchbar();
  } else {
    document.getElementById("selectbutton").onclick = resetsearchbar;
    document.getElementById("selectbutton").innerHTML = searchbar();
  }

  // Render the contact list
  renderContacts(contacts);
}

// Function to render contacts
function renderContacts(contactList) {
  let contactHTML = "";
  contactList.forEach((contact) => {
    if (contact !== null) {
      const color = getColorFromString(contact.name);
      contactHTML += contactstemplate(contact, color);
    }
  });

  // Display the contacts inside the contact box
  const contactsBox =
    document.getElementById("contacts-box1") ||
    document.getElementById("contacts-box");
  contactsBox.innerHTML = contactHTML;
}

function resetsearchbar() {
  if (document.getElementById("selectbutton1")) {
    document.getElementById("selectbutton1").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />`;
    document.getElementById("contacts-box1").classList.add("d-none");
    document.getElementById("selectbutton1").onclick = showcontactbox;
  } else {
    document.getElementById("selectbutton").innerHTML = `
      <span>Select contacts to assign</span>
      <img src="/img/arrow_drop_down.png" alt="" />`;
    document.getElementById("contacts-box").classList.add("d-none");
    document.getElementById("selectbutton").onclick = showcontactbox;
  }

  // Toggle contact box visibility
  const contactsBox = document.getElementById("contacts-box");
  contactsBox.style.display =
    contactsBox.style.display === "flex" ? "none" : "flex";
}

// Function to filter contacts based on search input
function filterContacts(event) {
  const filter = event.target.value.toLowerCase();

  // Filter contacts based on the search input
  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter)
  );

  // Re-render the filtered contacts
  renderContacts(filteredContacts);
}

// Function to generate the search bar HTML and add event listener for filtering
function searchbar() {
  return /*html*/ `
    <input id="search" type="text" class="searchbar" onclick="event.stopPropagation()" oninput="filterContacts(event)">
    <img src="/img/drop-up-arrow.png" alt="">
  `;
}

// Function to display the contact box
function showcontactbox() {
  if (document.getElementById("contacts-box")) {
    document.getElementById("contacts-box").classList.remove("d-none");
    document.getElementById("selectbutton").onclick = resetsearchbar;
    document.getElementById("selectbutton").innerHTML = searchbar();
    document.getElementById("contacts-box").style.display = "flex";
  }

  if (document.getElementById("contacts-box1")) {
    document.getElementById("contacts-box1").classList.remove("d-none");
    document.getElementById("selectbutton1").innerHTML = searchbar();
    document.getElementById("contacts-box1").style.display = "flex";
  }
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
  asignedtousers.push(initials);

  initialsArray.push({
    id: selectedContact.id, // Use selectedContact's ID
    initials: initials,
    name: selectedContact.name, // Correctly reference the name
  });

  checkbox.checked = !checkbox.checked;
  const badge = document.createElement("div");
  badge.className = "badgeassigned badge";
  badge.style.backgroundColor = color;
  badge.textContent = initials;
  badge.setAttribute("data-initials", initials);
  badge.style.width = "32px";
  badge.style.height = "32px";
  badge.style.marginLeft = "0";
  assignedUsersDiv.appendChild(badge);
  contactDiv.classList.add("dark-blue");
  contactDiv.onclick = function () {
    resetcontact(contactDiv, checkbox, selectedContact.id, initials);
  };
  checkAddTaskInputs();
}

function resetcontact(contactDiv, checkbox, id, initials) {
  checkbox.checked = false;
  contactDiv.classList.remove("dark-blue");
  asignedtousers = asignedtousers.filter((item) => item !== initials);
  initialsArray = initialsArray.filter((item) => item.id !== id); // Corrected from firebaseId to id

  const badge = document.querySelector(
    `.badgeassigned[data-initials="${initials}"]`
  );
  if (badge) {
    badge.remove();
  }
  contactDiv.onclick = function () {
    selectcontact(id);
  };
}

function updateAssignedUserStyles() {
  const assignedUsers1 = document.getElementById("assignedusers1");
  if (assignedUsers1) {
    const assignedUsers1Children = assignedUsers1.children;
    for (let i = 0; i < assignedUsers1Children.length; i++) {
      assignedUsers1Children[i].style.width = "32pxpx";
      assignedUsers1Children[i].style.height = "32pxpx";
      assignedUsers1Children[i].style.marginLeft = "0";
    }
  }

  const assignedUsers = document.getElementById("assignedusers");
  if (assignedUsers) {
    const assignedUsersChildren = assignedUsers.children;
    for (let i = 0; i < assignedUsersChildren.length; i++) {
      assignedUsersChildren[i].style.width = "32px";
      assignedUsersChildren[i].style.height = "32px";
      assignedUsersChildren[i].style.marginLeft = "0";
    }
  }
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
