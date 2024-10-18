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

function opentasktemplate() {
  document.querySelector(".overlay").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay").style.transform = "translateX(0%)";
  }, 10);
}

function closeaddtasktemplate() {
  document.querySelector(".overlay").style.transform = "translateX(126%)";
}





function countTasks() {

  const todoFolder = document.getElementById('todo-folder');
  const inprogressFolder = document.getElementById('inprogress-folder');
  const reviewFolder = document.getElementById('review-folder');
  const doneFolder = document.getElementById('done-folder');

  const todoCount = todoFolder.getElementsByClassName('task').length;
  const inprogressCount = inprogressFolder.getElementsByClassName('task').length;
  const reviewCount = reviewFolder.getElementsByClassName('task').length;
  const doneCount = doneFolder.getElementsByClassName('task').length;

  localStorage.setItem('todoCount', todoCount);
  localStorage.setItem('inprogressCount', inprogressCount);
  localStorage.setItem('reviewCount', reviewCount);
  localStorage.setItem('doneCount', doneCount);
}

document.addEventListener('DOMContentLoaded', countTasks);

function countAndStoreTasks() {
  const folders = ['todo-folder', 'inprogress-folder', 'review-folder', 'done-folder'];
  let totalTaskCount = 0; 

  folders.forEach(folderId => {
    const folder = document.getElementById(folderId);
    const taskCount = folder ? folder.getElementsByClassName('task').length : 0;
    localStorage.setItem(`${folderId}Count`, taskCount);
    totalTaskCount += taskCount; 
  });

  localStorage.setItem('totalTaskCount', totalTaskCount);
}

document.addEventListener('DOMContentLoaded', countAndStoreTasks);




