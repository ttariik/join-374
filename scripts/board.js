let completedtasks = 0;
let fullnames = [];
let colors = [];
let initialsss = [];
let taskss = [];
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

  const todoCount = todoFolder.getElementsByClassName("article").length;
  const inprogressCount =
    inprogressFolder.getElementsByClassName("article").length;
  const reviewCount = reviewFolder.getElementsByClassName("article").length;
  const doneCount = doneFolder.getElementsByClassName("article").length;

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
    const taskCount = folder
      ? folder.getElementsByClassName("article").length
      : 0;
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
  taskss.push(responsestoJson);
  for (let index = 0; index < responsestoJson.length; index++) {
    for (let k = 0; k < responsestoJson[index].subtask.length; k++) {
      if (responsestoJson[index].subtask[k].completed === true) {
        completedtasks++;
      }
    }

    if (responsestoJson[index].category === "User Story") {
      document.getElementById("article").innerHTML += userstorytemplate(
        responsestoJson,
        index,
        completedtasks
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

function userstorytemplate(responsestoJson, index, completedtasks) {
  for (let l = 0; l < fullnames.length; l++) {
    const color = getColorFromString(fullnames[l]);
    colors.push(color);
  }
  const initials = responsestoJson[index].initials;
  let initialsHTML = "";

  for (let a = 0; a < initials.length; a++) {
    initialsHTML += `<div class="badgestyle" style="background-color:${colors[index]}">${initials[a]}</div>`;
  }
  return /*html*/ `
  <div onclick="showtemplate(${index})" class="user-container task"  draggable="true"
  ondragstart="drag(event)"             id="task1">
  <div class="task-detailss">
    <span>${responsestoJson[index].category}</span>
  </div>
  <div class="titlecontainer">
    <div class="section-one">${responsestoJson[index].title}</div>
    <div class="section-two">${responsestoJson[index].description}</div>
   </div>
   <div class="outsidebox">
        <div class="progressbar">
          <div class="progressbar-inside" style="width:${
            completedtasks * 50
          }%"></div>
        </div>
        <div class="subtask-info"><span>${completedtasks}/${
    responsestoJson[index].subtask.length
  } Subtasks</span></div>
        
    </div>
    <div class="asignbox badge">
         <div  id="initialsarea" class="initialsbox" >${initialsHTML}</div>  <img src="/img/${
    responsestoJson[index].prio
  }.png" alt=""> 
        </div>
</div>
  `;
}

function showtemplate(index, category, title, description) {
  document.getElementById("templateoverlay").classList.add("overlays");
  fetch("profile-template.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text(); // Parse the response as text (HTML content)
    })
    .then((html) => {
      document.getElementById("templateoverlay").innerHTML = html;

      const taskscategory = responsestoJson[index].category;
      console.log(taskscategory);

      // Inject the fetched HTML into the overlay div
    })
    .catch((error) => {
      console.error("Error loading HTML:", error);
    });
}

function Technicaltasktemplate(responsestoJson, index) {
  const color = getColorFromString(responsestoJson[index].name);

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
  <div class="task-statuss badge" style="background-color:${color}">
    ${responsestoJson[index].initials} <img src="/img/${responsestoJson[index].prio}.png" alt="" />

  </div>
</div>

  `;
}

async function getusernames(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();
  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );
  for (let o = 0; o < responsestoJson.length; o++) {
    fullnames.push(responsestoJson[o].name);
  }
}

function opentasktemplate() {
  document.querySelector(".overlays").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlays").style.transform = "translateX(0%)";
  }, 10);
}

function closeaddtasktemplate() {
  document.querySelector(".overlays").style.transform = "translateX(126%)";
  setTimeout(() => {
    document.querySelector(".overlays").style.display = "none";
  }, 50);
}
