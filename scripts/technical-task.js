function loadinfosifpart1(task) {
  document.getElementById("technicaltasktitle").children[1].value = task.title;
  document.getElementById("date1").value = task.duedate;
  document.getElementById("button11").style.maxWidth = "136px";
  document.getElementById("button22").style.maxWidth = "136px";
  document.getElementById("button33").style.maxWidth = "136px";
  document.getElementById("button11").style.height = "56px";
  document.getElementById("button22").style.height = "56px";
  document.getElementById("button33").style.height = "56px";
  setButton11Listener(task);
  showsavedinitials(task.id, task);
  loadsubtasks(task);
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}

function setButton11Listener(task) {
  document.getElementById("button11").addEventListener("click", function () {
    selectbutton_11(task);
  });
}

function setButton22Listener(task) {
  document.getElementById("button22").addEventListener("click", function () {
    selectbutton_22(task);
  });
}

function setButton33Listener(task) {
  document.getElementById("button33").addEventListener("click", function () {
    selectbutton_33(task);
  });
}

function setButton1_1Listener(task) {
  document.getElementById("button1-1").addEventListener("click", function () {
    selectbutton_11(task);
  });
}

function setButton2_2Listener(task) {
  document.getElementById("button2-2").addEventListener("click", function () {
    selectbutton_22(task);
  });
}

function setButton3_3Listener(task) {
  document.getElementById("button3-3").addEventListener("click", function () {
    selectbutton_33(task);
  });
}

async function loadinfos(task) {
  asignedtousers = [];
  initialsArray = [];
  document.getElementById("assignedusers1").innerHTML = "";
  if (task.category === "Technical Task") {
    loadinfosifpart1(task);
    setButton22Listener(task);
    setButton33Listener(task);
    setPriorityForTechnicalTask(task);
  } else {
    setButton1_1Listener(task);
    setButton2_2Listener(task);
    setButton3_3Listener(task);
    setNonTechnicalTaskValues(task);
    showsavedinitials(task.id, task);
    loadsubtasks(task);
    setPriorityButtonListeners(task);
  }
}

function setPriorityForTechnicalTask(task) {
  if (task.prio === "Urgent") {
    selectbutton_11(task);
  } else if (task.prio === "Medium") {
    selectbutton_22(task);
  } else if (task.prio === "Low") {
    selectbutton_33(task);
  }
}

function setNonTechnicalTaskValues(task) {
  document.querySelector(".titleinputdesign").value = task.title;
  document.getElementById("date1").value = task.duedate;
  document.getElementById("button1-1").style.maxWidth = "136px";
  document.getElementById("button2-2").style.maxWidth = "136px";
  document.getElementById("button3-3").style.maxWidth = "136px";
  document.getElementById("button1-1").style.height = "56px";
  document.getElementById("button2-2").style.height = "56px";
  document.getElementById("button3-3").style.height = "56px";
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}

function setPriorityButtonListeners(task) {
  if (task.prio === "Urgent") {
    selectbutton_11(task);
  } else if (task.prio === "Medium") {
    selectbutton_22(task);
  } else if (task.prio === "Low") {
    selectbutton_33(task);
  }
}

async function showsavedinitials(id, task) {
  document.getElementById("assignedusers1").innerHTML = "";
  const { entries, contactMap } = await fetchsavedinitials();
  if (task.asignedto === undefined) {
    return;
  }
  for (let index = 0; index < task.asignedto.length; index++) {
    const assignedInitial = task.asignedto[index];
    const selectedContact = contactMap.get(assignedInitial);
    asignedtousers.push(assignedInitial);
    if (selectedContact) {
      forasignedto(selectedContact, index);
    }
  }
}

async function fetchsavedinitials() {
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
  const contactMap = new Map(
    entries
      .filter((contact) => contact)
      .map((contact) => [contact.initials, contact])
  );
  return { entries, contactMap };
}

function forasignedto(selectedContact, index) {
  document.getElementById("assignedusers1").style.width = "100%";
  const badge = document.createElement("div");
  badge.className = "badgeassigned badge";
  badge.style.width = "32px";
  badge.style.height = "32px";
  badge.id = `${selectedContact.id}_${index}`;
  badge.style.backgroundColor = selectedContact.color;
  badge.textContent = selectedContact.initials;
  badge.setAttribute("data-initials", selectedContact.initials);
  if (!document.getElementById(badge.id)) {
    document.getElementById("assignedusers1").appendChild(badge);
    badge.style.marginLeft = "0";
  }
  initialsArray.push({
    id: selectedContact.id,
    initials: selectedContact.initials,
    name: selectedContact.name,
  });
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
