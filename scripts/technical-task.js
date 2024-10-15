function editinputs() {
  document.getElementById("type").remove();
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("title").innerHTML = titletemplate();
  document.getElementById("description").innerHTML = descriptiontemplate();
}

function titletemplate() {
  return `<div class="headertitle">
    <label>Title</label>
    <input type="text" placeholder="Enter a title" class="titleinputdesign">
    </div>`;
}

function descriptiontemplate() {
  return `
    <div class="descriptionpart">
    <label>Description</label>
    <textarea class="descriptionpartinput" placeholder="Enter a Description"></textarea>
    </div>
    `;
}
