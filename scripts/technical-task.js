/**
 * Edits the inputs for a task and updates the UI accordingly.
 * @param {Object} task - The task object containing task details.
 */

function editinputs(task) {
  const type = document.getElementById("type");
  if (type) {
    type.remove();
  }
  document.getElementById("layoutid").style.gap = "10px";
  document.querySelector(".header").style.justifyContent = "flex-end";
  document.getElementById("technicaltasktitle").innerHTML = titletemplate(task);
  document.getElementById("descriptioninput").innerHTML = descriptiontemplate();
  document.getElementById("duedatecontainer").innerHTML = duedatetemplate();
  document.getElementById("duedatecontainer").style =
    "gap: 10px;flex-direction:column;!important";
  document.getElementById("priority-containercontent").innerHTML =
    prioritytemplatetechnicaltask();
  document.getElementById("date1").style.marginBottom = "unset";
  document.getElementById("priority-containercontent").style.flexDirection =
    "column";
  document.getElementById("priority-containercontent").style.gap = "10px";
  document.getElementById("assigned-containercontent").innerHTML =
    reselectionofcontacts(task);
  document.getElementById;
  document.getElementById("assigned-containercontent").children[0].style.gap =
    "unset";
  document.getElementById(
    "buttonss"
  ).innerHTML = `<button id="oksavebutton" class="savecontact" type="button" ><span>OK</span><div> <img src="/img/checkwhite.png" alt="" /></div> </button>`;
  document
    .getElementById("oksavebutton")
    .addEventListener("click", function () {
      savechanges(task);
    });
  document.getElementById("subtaskbox").innerHTML = "";
  document.getElementById("subtaskbox").innerHTML = subtaskboxemplate();
  document.getElementById("closebtn").addEventListener("click", function () {
    resettemplate(task);
  });
  document.getElementById("layoutid").children[1].style =
    "overflow-x: hidden;  overflow-y: scroll; scrollbar-width: thin; height: 700px; margin: 10px 0 10px 0;padding-right: 8px;";
  document.getElementById("closebtn1").addEventListener("click", function () {
    resettemplate(task);
  });
  document.getElementById("button1").style.maxWidth = "136px";
  document.getElementById("button2").style.maxWidth = "136px";
  document.getElementById("button3").style.maxWidth = "136px";
  document.getElementById("button1").style.height = "56px";
  document.getElementById("button2").style.height = "56px";
  document.getElementById("button3").style.height = "56px";
  loadinfos(task);
}

async function loadinfos(task) {
  // Resetting shared variables
  subtasks = [];
  asignedtousers = [];
  initialsArray = [];
  document.getElementById("assignedusers1").innerHTML = "";
  if (task.category === "Technical Task") {
    document.getElementById("technicaltasktitle").children[1].value =
      task.title;

    document.getElementById("date1").value = task.duedate;
    document.getElementById("button11").style.maxWidth = "136px";
    document.getElementById("button22").style.maxWidth = "136px";
    document.getElementById("button33").style.maxWidth = "136px";
    document.getElementById("button11").style.height = "56px";
    document.getElementById("button22").style.height = "56px";
    document.getElementById("button33").style.height = "56px";
    showsavedinitials(task);
    loadsubtasks(task);

    document.getElementById("button11").addEventListener("click", function () {
      selectbutton_11(task);
    });
    document.getElementById("button22").addEventListener("click", function () {
      selectbutton_22(task);
    });
    document.getElementById("button33").addEventListener("click", function () {
      selectbutton_33(task);
    });

    // Set priority based on task.prio
    if (task.prio === "Urgent") {
      selectbutton_11(task);
    } else if (task.prio === "Medium") {
      selectbutton_22(task);
    } else if (task.prio === "Low") {
      selectbutton_33(task);
    }
  } else {
    document.querySelector(".titleinputdesign").value = task.title;
    document.getElementById("date1").value = task.duedate;
    document.getElementById("button1-1").style.maxWidth = "136px";
    document.getElementById("button2-2").style.maxWidth = "136px";
    document.getElementById("button3-3").style.maxWidth = "136px";
    document.getElementById("button1-1").style.height = "56px";
    document.getElementById("button2-2").style.height = "56px";
    document.getElementById("button3-3").style.height = "56px";
    await showsavedinitials(task);
    loadsubtasks(task);

    document.getElementById("button1-1").addEventListener("click", function () {
      selectbutton_11(task);
    });
    document.getElementById("button2-2").addEventListener("click", function () {
      selectbutton_22(task);
    });
    document.getElementById("button3-3").addEventListener("click", function () {
      selectbutton_33(task);
    });

    // Set priority based on task.prio
    if (task.prio === "Urgent") {
      selectbutton_11(task);
    } else if (task.prio === "Medium") {
      selectbutton_22(task);
    } else if (task.prio === "Low") {
      selectbutton_33(task);
    }
  }

  // Update all inputs with task description
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}

async function showsavedinitials(task) {
  // Clear previous badges to avoid duplicates
  document.getElementById("assignedusers1").innerHTML = "";
  // Fetch all contacts once
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  const responsestoJson = await response.json();
  const entries = Object.entries(responsestoJson).map(([firebaseId, contact]) =>
    contact && contact.name
      ? {
          id: firebaseId,
          initials: contact.initials,
          name: contact.name,
          color: contact.color,
          email: contact.email,
          telefone: contact.telefone,
        }
      : null
  );
  // Create a Map for quick lookup by initials
  const contactMap = new Map(
    entries
      .filter((contact) => contact)
      .map((contact) => [contact.initials, contact])
  );

  // Process assigned users
  for (let index = 0; index < task.asignedto.length; index++) {
    const assignedInitial = task.asignedto[index];
    const selectedContact = contactMap.get(assignedInitial);

    if (selectedContact) {
      const badge = document.createElement("div");
      badge.className = "badgeassigned badge";
      badge.style.width = "32px";
      badge.style.height = "32px";
      badge.id = `${selectedContact.id}_${index}`;
      badge.style.backgroundColor = selectedContact.color;
      badge.textContent = selectedContact.initials;

      // Avoid duplicate badges
      if (!document.getElementById(badge.id)) {
        document.getElementById("assignedusers1").appendChild(badge);
        badge.style.marginLeft = "0";
      }

      // Push to initialsArray
      initialsArray.push({
        id: selectedContact.id,
        initials: selectedContact.initials,
        name: selectedContact.name,
      });
    } else {
      console.error(`No contact found for initials: ${assignedInitial}`);
    }
  }
}

function selectbutton_11(task) {
  if (task.category === "Technical Task") {
    document.getElementById("button11").classList.toggle("lightred");
    document.getElementById("button22").classList.remove("lightorange");
    document.getElementById("button33").classList.remove("lightgreen");

    const urgentImg = document.getElementById("urgentImg11");
    urgentImg.src = urgentImg.src.includes("Urgent.png")
      ? "/img/urgent-white.png"
      : "/img/Urgent.png";

    const urgentText = document.getElementById("urgent11");
    urgentText.style.color =
      urgentText.style.color === "white" ? "black" : "white";

    document.getElementById("mediumImg22").src = "/img/Medium.png";
    document.getElementById("lowImg33").src = "/img/Low.png";
    document.getElementById("medium22").style.color = "black";
    document.getElementById("low33").style.color = "black";
    if (document.getElementById("button11").classList.contains("lightred")) {
      selectedPriority = "Urgent";
      document.getElementById("button11").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  } else {
    document.getElementById("button1-1").classList.toggle("lightred");
    document.getElementById("button2-2").classList.remove("lightorange");
    document.getElementById("button3-3").classList.remove("lightgreen");

    const urgentImg = document.getElementById("urgentImg1-1");
    urgentImg.src = urgentImg.src.includes("Urgent.png")
      ? "/img/urgent-white.png"
      : "/img/Urgent.png";

    const urgentText = document.getElementById("urgent1-1");
    urgentText.style.color =
      urgentText.style.color === "white" ? "black" : "white";

    document.getElementById("mediumImg2-2").src = "/img/Medium.png";
    document.getElementById("lowImg3-3").src = "/img/Low.png";
    document.getElementById("medium2-2").style.color = "black";
    document.getElementById("low3-3").style.color = "black";
    if (document.getElementById("button1-1").classList.contains("lightred")) {
      selectedPriority = "Urgent";
      document.getElementById("button1-1").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  }
}

function selectbutton_22(task) {
  if (task.category === "Technical Task") {
    document.querySelector("#button11").classList.remove("lightred");
    document.querySelector("#button22").classList.toggle("lightorange");
    document.querySelector("#button33").classList.remove("lightgreen");
    const mediumImg = document.getElementById("mediumImg22");
    mediumImg.src = mediumImg.src.includes("Medium.png")
      ? "/img/medium-white.png"
      : "/img/Medium.png";

    const mediumText = document.getElementById("medium22");
    mediumText.style.color =
      mediumText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg11").src = "/img/Urgent.png";
    document.getElementById("lowImg33").src = "/img/Low.png";
    document.getElementById("urgent11").style.color = "black";
    document.getElementById("low33").style.color = "black";
    if (document.getElementById("button22").classList.contains("lightorange")) {
      selectedPriority = "Medium";
      document.getElementById("button22").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  } else {
    document.querySelector("#button1-1").classList.remove("lightred");
    document.querySelector("#button2-2").classList.toggle("lightorange");
    document.querySelector("#button3-3").classList.remove("lightgreen");

    const mediumImg = document.getElementById("mediumImg2-2");
    mediumImg.src = mediumImg.src.includes("Medium.png")
      ? "/img/medium-white.png"
      : "/img/Medium.png";

    const mediumText = document.getElementById("medium2-2");
    mediumText.style.color =
      mediumText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg1-1").src = "/img/Urgent.png";
    document.getElementById("lowImg3-3").src = "/img/Low.png";
    document.getElementById("urgent1-1").style.color = "black";
    document.getElementById("low3-3").style.color = "black";
    if (
      document.getElementById("button2-2").classList.contains("lightorange")
    ) {
      selectedPriority = "Medium";
      document.getElementById("button2-2").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  }
}

function selectbutton_33(task) {
  if (task.category === "Technical Task") {
    document.getElementById("button11").classList.remove("lightred");
    document.getElementById("button22").classList.remove("lightorange");
    document.getElementById("button33").classList.toggle("lightgreen");

    const lowImg = document.getElementById("lowImg33");
    lowImg.src = lowImg.src.includes("Low.png")
      ? "/img/low-white.png"
      : "/img/Low.png";

    const lowText = document.getElementById("low33");
    lowText.style.color = lowText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg11").src = "/img/Urgent.png";
    document.getElementById("mediumImg22").src = "/img/Medium.png";
    document.getElementById("urgent11").style.color = "black";
    document.getElementById("medium22").style.color = "black";
    if (document.getElementById("button33").classList.contains("lightorange")) {
      selectedPriority = "Low";
      document.getElementById("button33").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  } else {
    document.getElementById("button1-1").classList.remove("lightred");
    document.getElementById("button2-2").classList.remove("lightorange");
    document.getElementById("button3-3").classList.toggle("lightgreen");

    const lowImg = document.getElementById("lowImg3-3");
    lowImg.src = lowImg.src.includes("Low.png")
      ? "/img/low-white.png"
      : "/img/Low.png";

    const lowText = document.getElementById("low3-3");
    lowText.style.color = lowText.style.color === "white" ? "black" : "white";

    document.getElementById("urgentImg1-1").src = "/img/Urgent.png";
    document.getElementById("mediumImg2-2").src = "/img/Medium.png";
    document.getElementById("urgent1-1").style.color = "black";
    document.getElementById("medium2-2").style.color = "black";
    if (
      document.getElementById("button3-3").classList.contains("lightorange")
    ) {
      selectedPriority = "Low";
      document.getElementById("button3-3").classList.toggle("selected");
    } else {
      selectedPriority = "";
    }
  }
}

/**
 * Edits the profile section of a user or task and updates the UI.
 * @param {Object} task - The task object containing all task details.
 */
function editprofile(task) {
  // Check if event listeners have already been attached to the buttons
  const okSaveButton = document.getElementById("oksavebutton");
  const closeBtn = document.getElementById("closebtn");

  // Remove existing title box if it exists
  const titlebox = document.getElementById("userbox");
  if (titlebox) {
    titlebox.remove();
  }

  // Update layout
  document.querySelector(".headerprofile").style.justifyContent = "flex-end";
  document.querySelector(".titlebox span").style = "line-height: unset";
  document.querySelector(".titlebox").innerHTML = titletemplate(task);
  document.querySelector(".description").innerHTML = descriptiontemplate();
  document.getElementById("due-date-container-edit").innerHTML =
    duedatetemplate();
  document
    .getElementById("due-date-container-edit")
    .classList.add("due-date-containerprofile");
  document.getElementById("prio").innerHTML = prioritytemplateprofile();
  document.getElementById("prio").classList.add("buttonss");

  // Update assigned area and other sections
  document.getElementById("profileassingedarea").innerHTML =
    reselectionofcontacts();
  document.getElementById("profileassingedarea").style.gap = "unset";
  document.getElementById("profileassingedarea").style.padding = "unset";
  document.querySelector(".button-containers").innerHTML = buttontemplate(task);
  document.getElementById("subtaskbox").innerHTML = "";
  document.getElementById("subtaskarea").innerHTML = subtaskboxemplate();
  document.getElementById("subtaskarea").style = "padding: 6px 0px 60px 0";
  document.getElementById("selectbutton1").parentElement.style = "gap: unset";
  document.querySelector(".scrollbar").style =
    "overflow-x: hidden;  overflow-y: scroll; scrollbar-width: thin; height: 700px; margin: 10px 0 10px 0;padding-right: 8px;";

  // Remove previous event listeners (if any) to avoid multiple triggers
  if (okSaveButton) {
    okSaveButton.removeEventListener("click", handleSaveChanges); // Remove previous event listener
    okSaveButton.addEventListener("click", handleSaveChanges); // Add new event listener
  }

  if (closeBtn) {
    closeBtn.removeEventListener("click", handleResetTemplate); // Remove previous event listener
    closeBtn.addEventListener("click", handleResetTemplate); // Add new event listener
  }

  // Load additional task info and handle button selections
  loadinfos(task);

  // Event handler functions for the buttons
  function handleSaveChanges() {
    savechanges(task);
  }

  function handleResetTemplate() {
    resettemplate(task);
  }
}

/**
 * Resets the template to its initial state based on the task type.
 * @param {Object} task - The task object containing all task details.
 */
async function firstcondition() {
  closeoverlayprofiletemplate();
  const response2 = await fetch(GLOBAL + "users/1/contacts.json");
  const contacts = await response2.json();
  const profiletemplate = document.getElementById("overlayprofile-template");
  profiletemplate.innerHTML = "";
  profiletemplate.setAttribute("w3-include-html", "profile-template.html");
  includeHTML();
  w3.includeHTML();
}

async function resettemplate(task) {
  if (task.category === "User Story") {
    firstcondition();
  } else {
    closeoverlayprofiletemplate();
    const response2 = await fetch(GLOBAL + "users/1/contacts.json");
    const contacts = await response2.json();
    const profiletemplate = document.getElementById(
      "overlaytechinical-task-template"
    );
    profiletemplate.innerHTML = "";
    profiletemplate.setAttribute(
      "w3-include-html",
      "techinical-task-template.html"
    );
    includeHTML();
    w3.includeHTML();
  }
}

async function getUserTaskss(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/tasks.json`);
  let responsestoJson = await responses.json();
  document.getElementById(
    "typeoftask"
  ).innerHTML = `${responsestoJson[0].category}`;
  document.getElementById("title").innerHTML = `${responsestoJson[0].title}`;
  document.getElementById(
    "descriptioninput"
  ).innerHTML = `${responsestoJson[0].description}`;
  document.getElementById(
    "due-date-containerinput"
  ).innerHTML = `${responsestoJson[0].duedate}`;
  document.getElementById("showprio").innerHTML = `${responsestoJson[0].prio}`;
  document.getElementById(
    "showassignedperson"
  ).innerHTML = `${responsestoJson[0].asignedto}`;
  document.getElementById(
    "showsubtask"
  ).innerHTML = `${responsestoJson[0].subtask}`;
}
