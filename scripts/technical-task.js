function loadinfosifpart1(task) {
  setTaskTitleAndDate(task);
  setButtonStyles();
  showsavedinitials(task);
  loadsubtasks(task);
  setDescription(task);
}


function setTaskTitleAndDate(task) {
  document.getElementById("technicaltasktitle").children[1].value = task.title;
  document.getElementById("date1").value = task.duedate;
}


function setButtonStyles() {
  ["button11", "button22", "button33"].forEach((id) => {
    const button = document.getElementById(id);
    button.style.maxWidth = "136px";
    button.style.height = "56px";
  });
}


function setDescription(task) {
  document
    .querySelectorAll(".text1")
    .forEach((input) => (input.value = task.description));
}


async function loadinfos(task) {
  resetGlobalVariables();
  clearAssignedUsers();

  if (task.category === "Technical Task") {
    loadinfosifpart1(task);
    setTechnicalButtonListeners(task);
    setPriorityForTechnicalTask(task);
  } else {
    setNonTechnicalTaskValues(task);
    await showsavedinitials(task);
    loadsubtasks(task);
    setNonTechnicalButtonListeners(task);
    setPriorityButtonListeners(task);
  }
}


function resetGlobalVariables() {
  subtasks = [];
  asignedtousers = [];
  initialsArray = [];
}


function clearAssignedUsers() {
  document.getElementById("assignedusers1").innerHTML = "";
}


function setTechnicalButtonListeners(task) {
  setButton11Listener(task);
  setButton22Listener(task);
  setButton33Listener(task);
}


function setNonTechnicalButtonListeners(task) {
  setButton1_1Listener(task);
  setButton2_2Listener(task);
  setButton3_3Listener(task);
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
  setNonTechnicalTitleAndDate(task);
  setNonTechnicalButtonStyles();
  setDescription(task);
}


function setNonTechnicalTitleAndDate(task) {
  document.querySelector(".titleinputdesign").value = task.title;
  document.getElementById("date1").value = task.duedate;
}


function setNonTechnicalButtonStyles() {
  ["button1-1", "button2-2", "button3-3"].forEach((id) => {
    const button = document.getElementById(id);
    button.style.maxWidth = "136px";
    button.style.height = "56px";
  });
}


async function showsavedinitials(task) {
  clearBadges();
  const contacts = await fetchContacts();
  const contactMap = createContactMap(contacts);

  processAssignedUsers(task, contactMap);
}


function clearBadges() {
  document.getElementById("assignedusers1").innerHTML = "";
}


async function fetchContacts() {
  const response = await fetch(GLOBAL + `users/1/contacts.json`);
  return await response.json();
}


function createContactMap(contacts) {
  const entries = Object.entries(contacts).map(([firebaseId, contact]) =>
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

  return new Map(entries.filter((contact) => contact).map((contact) => [contact.initials, contact]));
}


function processAssignedUsers(task, contactMap) {
  task.asignedto.forEach((initial, index) => {
    const selectedContact = contactMap.get(initial);
    if (selectedContact) {
      createBadge(selectedContact, index);
    } else {
      console.error(`No contact found for initials: ${initial}`);
    }
  });
}


function createBadge(contact, index) {
  const badge = document.createElement("div");
  badge.className = "badgeassigned badge";
  badge.style.width = "32px";
  badge.style.height = "32px";
  badge.id = `${contact.id}_${index}`;
  badge.style.backgroundColor = contact.color;
  badge.textContent = contact.initials;
  if (!document.getElementById(badge.id)) {
    document.getElementById("assignedusers1").appendChild(badge);
    badge.style.marginLeft = "0";
  }
  initialsArray.push({
    id: contact.id,
    initials: contact.initials,
    name: contact.name,
  });
}
