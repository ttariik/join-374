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
  if (document.querySelector("#button1-1,#utton2-2,#button3-3")) {
    document.getElementById("button1-1").classList.toggle("lightred");
    document.getElementById("button2-2").classList.remove("lightorange");
    document.getElementById("button3-3").classList.remove("lightgreen");
  }
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
  document.querySelector("#button1").classList.remove("lightred");
  document.querySelector("#button2").classList.toggle("lightorange");
  document.querySelector("#button3").classList.remove("lightgreen");
  if (document.querySelector("#button1-1,#utton2-2,#button3-3")) {
    document.getElementById("button1-1").classList.remove("lightred");
    document.getElementById("button2-2").classList.toggle("lightorange");
    document.getElementById("button3-3").classList.remove("lightgreen");
  }
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
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.toggle("lightgreen");
  if (document.querySelector("#button1-1,#utton2-2,#button3-3")) {
    document.getElementById("button1-1").classList.remove("lightred");
    document.getElementById("button2-2").classList.remove("lightorange");
    document.getElementById("button3-3").classList.toggle("lightgreen");
  }
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
  const contactsBox1 = document.getElementById("contacts-box1");
  const contactsBox = document.getElementById("contacts-box");

  if (contactsBox1) {
    contactsBox1.style.display = "flex";
    contactsBox1.style.top = "34%";
    contactsBox1.style.left = "-5px";
  } else if (contactsBox) {
    contactsBox.style.display = "flex";
  }
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
