const searchInput = document.getElementById("searchInput");
const tasks = document.querySelectorAll(".task");

searchInput.addEventListener("input", function () {
  const filter = searchInput.value.toLowerCase();

  tasks.forEach((task) => {
    const taskText = task.textContent.toLowerCase();

    if (taskText.includes(filter)) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
});

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const task = document.getElementById(data);
  event.target.appendChild(task);
}

function countTasks() {
  const todoFolder = document.getElementById("todo-folder");
  const inprogressFolder = document.getElementById("inprogress-folder");
  const reviewFolder = document.getElementById("review-folder");
  const doneFolder = document.getElementById("done-folder");

  const todoCount = todoFolder.getElementsByClassName("task").length;
  const inprogressCount =
    inprogressFolder.getElementsByClassName("task").length;
  const reviewCount = reviewFolder.getElementsByClassName("task").length;
  const doneCount = doneFolder.getElementsByClassName("task").length;

  localStorage.setItem("todoCount", todoCount);
  localStorage.setItem("inprogressCount", inprogressCount);
  localStorage.setItem("reviewCount", reviewCount);
  localStorage.setItem("doneCount", doneCount);
}

document.addEventListener("DOMContentLoaded", countTasks);

function countAndStoreTasks() {
  const folders = [
    "todo-folder",
    "inprogress-folder",
    "review-folder",
    "done-folder",
  ];
  let totalTaskCount = 0;

  folders.forEach((folderId) => {
    const folder = document.getElementById(folderId);
    const taskCount = folder ? folder.getElementsByClassName("task").length : 0;
    localStorage.setItem(`${folderId}Count`, taskCount);
    totalTaskCount += taskCount;
  });

  localStorage.setItem("totalTaskCount", totalTaskCount);
}

document.addEventListener("DOMContentLoaded", countAndStoreTasks);

async function loadtasks(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
  responsestoJson = responsestoJson.filter(
    (task) =>
      task &&
      task.asignedto &&
      task.category &&
      task.description &&
      task.duedate &&
      task.prio &&
      task.subtask &&
      task.title
  );
  for (let index = 0; index < responsestoJson.length; index++) {
    if (responsestoJson[index].category === "Technical Task")
      document.getElementById("todo-folder").innerHTML += Technicaltasktemplate(
        responsestoJson,
        index
      );
  }
}

function Technicaltasktemplate(responsestoJson, index) {
  return /*html*/ `
<div class="task-container" onclick="opentechnicaltemplate(${index})">
  <div class="task-category">
    <span class="task-category-name">${responsestoJson[index].category}</span>
  </div>
  <div class="task-details">
    <div class="task-title">
      <span class="task-title-name">${responsestoJson[index].title}</span>
    </div>
    <div class="task-description">
      ${responsestoJson[index].description}
   </div>
  </div>
  <div class="task-status">
    ${responsestoJson[index].initials} ${responsestoJson[index].prio}
  </div>
</div>

  `;
}

function opentechnicaltemplate() {
  const template = document.getElementById("showtemplates");
  const file = "/templates-html/techinical-task-template.html";

  if (!document.getElementById("techinical-task-template")) {
    const link = document.createElement("link");
    link.id = "techinical-task-template";
    link.rel = "stylesheet";
    link.href = "/styles/techinical-task-template.css";
    document.head.appendChild(link);

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status === 200) {
        template.innerHTML = this.responseText;
      } else {
        template.innerHTML = "Error loading template: Page not found.";
      }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
  }
  edit;
}

function showTemplate() {
  const template = document.getElementById("template");
  const file = "/templates-html/overlay.html";

  if (!document.getElementById("addtasktemplate")) {
    const link = document.createElement("link");
    link.id = "addtasktemplate";
    link.rel = "stylesheet";
    link.href = "/styles/addtasktemplate.css";
    document.head.appendChild(link);

    const xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (this.status === 200) {
        template.innerHTML = this.responseText;
      } else {
        template.innerHTML = "Error loading template: Page not found.";
      }
    };
    xhttp.open("GET", file, true);
    xhttp.send();
  }
  opentasktemplate();
}

function hideTemplate() {
  const template = document.getElementById("template");
  template.innerHTML = "";
}

function opentasktemplate() {
  document.querySelector(".overlay").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay").style.transform = "translateX(0%)";
  }, 10);
}

function closeaddtasktemplate() {
  document.querySelector(".overlay").style.transform = "translateX(126%)";
  setTimeout(() => {
    hideTemplate();
  }, 10);
}
