// Event Listener für die Eingabe im Suchfeld
document.getElementById("input-search").addEventListener("input", function () {
  const searchQuery = this.value.toLowerCase(); // Suchbegriff in Kleinbuchstaben
  const tasks = document.querySelectorAll(".task"); // Alle Task-Elemente auswählen

  tasks.forEach(function (task) {
    const title = task.getAttribute("data-title").toLowerCase(); // Task-Titel in Kleinbuchstaben

    if (title.includes(searchQuery)) {
      task.style.display = "block"; // Task anzeigen, wenn der Suchbegriff übereinstimmt
    } else {
      task.style.display = "none"; // Task ausblenden, wenn der Suchbegriff nicht passt
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
  document.getElementById("overlay").style.display = "flex";
  document.querySelector(".overlay").style.transform = "translateX(0%)";
}

function closeaddtasktemplate() {
  document.getElementById("overlay").style.display = "none";
}
