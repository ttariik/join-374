
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