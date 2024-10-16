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
  console.log("Selected Priority: " + selectedPriority);
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
  let subtask = document.getElementById("subtasks").value;
  let UserKeyArray = Object.keys(userResponse);
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
    subtask: subtask,
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

  let nextIndex = Object.keys(usertasks).length;

  await putData(`users/${id}/tasks/${nextIndex}`, tasks);
}

async function getUserTasks(id) {
  let response = await fetch(GLOBAL + `users/${id}/tasks.json`);
  return await response.json();
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}
