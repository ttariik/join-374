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
    if (responsestoJson[index].category === "User Story") {
      document.getElementById("article").innerHTML += userstorytemplate(
        responsestoJson,
        index
      );
    }
    if (responsestoJson[index].category === "Technical Task") {
      document.getElementById("article").innerHTML += Technicaltasktemplate(
        responsestoJson,
        index
      );
    }
  }
}

function userstorytemplate(responsestoJson, index) {
  return /*html*/ `
  <div class="user-container task"  draggable="true"
  ondragstart="drag(event)"             id="task1">
  <div class="task-details">
    <span>${responsestoJson[index].category}</span>
  </div>
  <div class="titlecontainer">
    <div class="section-one">${responsestoJson[index].title}</div>
    <div class="section-two">${responsestoJson[index].description}</div>
   </div>
   <div class="outsidebox">
        <div class="progressbar">
          <div class="progressbar-inside"></div>
        </div>
        <div class="subtask-info"><span>${responsestoJson[index].subtask.subtask.length}/${responsestoJson[index].subtask.subtask.length} Subtasks</span></div>
        
    </div>
    <div class="asignbox badge">
          ${responsestoJson[index].initials} <img src="/img/${responsestoJson[index].prio}.png" alt=""> 
        </div>
</div>

  `;
}

function Technicaltasktemplate(responsestoJson, index) {
  return /*html*/ `
<div class="task-container task" 
            draggable="true"
            ondragstart="drag(event)"             id="task1"
            onclick="opentechnicaltemplate(${index})">
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
  <div class="task-statuss">
    ${responsestoJson[index].initials} <img src="/img/${responsestoJson[index].prio}.png" alt="" />

  </div>
</div>

  `;
}

function opentasktemplate() {
  document.querySelector(".overlays").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlays").style.transform = "translateX(0%)";
  }, 10);
}

function closeaddtasktemplate() {
  document.querySelector(".overlays").style.transform = "translateX(126%)";
}
