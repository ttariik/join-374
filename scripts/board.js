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
  document.getElementById();
}

function addtasktemplate() {
  return `  <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100vh;
      "
    >
      <div
        style="
          border: 1px solid;
          border-radius: 30px;
          width: 1116px;
          height: 721px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <div style="width: 89%"><h1>Add Task</h1></div>
        <div class="wholebox">
          <form id="myform" action="">
            <div class="alignment2">
              <div class="firstbox">
                <div class="title2">
                  <label>Title*</label>
                  <input
                    id="title"
                    class="titleinput"
                    placeholder="Enter a title"
                    type="text"
                  />
                </div>
                <div class="descriptioninput">
                  <div><label>Description</label></div>
                  <div>
                    <textarea
                      id="description"
                      name="Enter a Description"
                      id=""
                    ></textarea>
                  </div>
                </div>
                <div class="selectbox">
                  <div><label>Assigned to</label></div>
                  <div>
                    <select name="" id="asignment">
                      <option
                        disabled
                        selected
                        hidden
                        value="Select Contacts to asign"
                      >
                        Select Contacts to asign
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="line"></div>
              <div class="secondbox">
                <div class="firsthalfbox">
                  <div class="emailbox">
                    <div><label>Due date*</label></div>
                    <div class="emailinput">
                      <input
                        class="emailinput2"
                        type="datetime"
                        name="date"
                        id="date"
                        placeholder="dd/mm/yyyy"
                        maxlength="10"
                      />
                    </div>
                  </div>
                  <div class="buttons">
                    <label>Prio</label>
                    <div class="buttons2">
                      <div style="width: 136px">
                        <button
                          type="button"
                          id="button1"
                          class="buttons2_1"
                          onclick="selectbutton_1()"
                        >
                          <span id="urgent">Urgent</span>
                          <img src="/img/Prio alta.png" alt="" />
                        </button>
                      </div>
                      <div style="width: 136px">
                        <button
                          type="button"
                          onclick="selectbutton_2()"
                          id="button2"
                          class="buttons2_2"
                        >
                          <span id="medium">Medium</span>
                          <img src="/img/Capa 2.png" alt="" />
                        </button>
                      </div>
                      <div style="width: 136px">
                        <button
                          type="button"
                          onclick="selectbutton_3()"
                          id="button3"
                          class="buttons2_3"
                        >
                          <span id="low">Low</span>
                          <img src="/img/Prio baja.png" alt="" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="secondhalfbox">
                  <div>
                    <label>Category*</label>
                    <select name="" id="category">
                      <option
                        disabled
                        selected
                        hidden
                        value="Select Task Category"
                      >
                        Select Task Category
                      </option>
                      <option value="Technical Task">Technical Task</option>
                      <option value="User Story">User Story</option>
                    </select>
                  </div>
                  <div>
                    <label>Subtasks</label>
                    <select name="subtasks" id="subtasks">
                      <option disabled selected hidden value="Add New Task">
                        Add New Task
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="buttonsalignment">
              <div class="buttonsalignment_1">
                <span style="color: red">*</span>This field is required
              </div>
              <div class="buttonsalignment_2">
                <button type="button" class="bt1" onclick="clearinputs()">
                  Clear <img src="../img/Vector.png" alt="" /></button
                ><button onclick="" disabled class="bt2">
                  Create Task <img src="../img/check.png" alt="" />
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>`;
}
