let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

let selectedPriority = null;

function selectbutton_1() {
  document.getElementById("button1").classList.toggle("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");
}

function selectbutton_2() {
  document.getElementById("button2").classList.toggle("lightorange");
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button3").classList.remove("lightgreen");
}

function selectbutton_3() {
  document.getElementById("button3").classList.toggle("lightgreen");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightred");
}

function clearinputs() {
  document.getElementById("myform").reset();
}

function handleButtonClick(priority) {
  selectedPriority = priority;
}

async function addtask(event) {
  event.preventDefault();
  let form = document.querySelector("form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  let userResponse = await getAllUsers("users");
  let title = document.getElementById("title").value;
  let description = document.getElementById("description").value;
  let asignedto = document.getElementById("asignment").value;
  let duedate = document.getElementById("date").value;
  let category = document.getElementById("Category").value;
  let subtask = document.getElementById("subtaskinput").value;
  let UserKeyArray = Object.keys(userResponse);
  console.log(UserKeyArray);

  if (!selectedPriority) {
    alert("Please select a priority!");
    return;
  }
  for (let index = 0; index < UserKeyArray.length; index++) {
    users.push({
      id: UserKeyArray[index],
      user: userResponse[UserKeyArray[index]],
    });
  }
  await addEditSingleUser((id = 1), {
    title: title,
    description: description,
    asignedto: asignedto,
    prio: selectedPriority,
    duedate: duedate,
    category: category,
    subtask: {
      subtask: subtask,
      completed: false,
    },
  });
  emptyinputs();
}

function emptyinputs() {
  let form = document.querySelector("form");
  form.reset();
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button1").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightgreen");
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
  await putData(`users/${id}/tasks/${nextIndex}`, tasks);
}

async function getUserTaskss(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
}

async function getUserTasks(id) {
  let response = await fetch(GLOBAL + `users/${id}/tasks.json`);
  return await response.json();
  console.log(response);
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

function subtaskchangeicons() {
  document.getElementById("inputsubtask1").classList.add("d-none");
  document.getElementById("inputsubtask2").classList.remove("d-none");
  document.getElementById("inputsubtask3").classList.remove("d-none");
  document.getElementById("seperate").classList.remove("d-none");
}

function subtaskiconsreset() {
  document.getElementById("inputsubtask1").classList.remove("d-none");
  document.getElementById("inputsubtask2").classList.add("d-none");
  document.getElementById("inputsubtask3").classList.add("d-none");
  document.getElementById("seperate").classList.add("d-none");
  document.getElementById("subtaskinput").value = "";
}

function addsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  document.getElementById("subtasksbox").innerHTML +=
    subtaskstemplate(subtaskinput1);
  subtaskiconsreset();
}

function resetsubtask() {
  let subtaskinput1 = document.getElementById("subtaskinput").value;
  subtaskinput1.reset();
}

function subtaskstemplate(subtaskinput1) {
  return /*html*/ `
    <div class="subbox">
      <div>•</div>
      <div>${subtaskinput1}</div>
      <button class="d-none"><img src="/img/delete1 (2).png" alt="Delete" /></button>
      <button class="d-none"><img src="/img/check1 (1).png" alt="Check" /></button>
    </div>
  `;
}
