let initialsarray = [];
async function addcontact(event) {
  event.preventDefault();
  let form = document.querySelector("form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  let userResponse = await getAllUsers("users");
  let telefonename = document.getElementById("name").value;
  let nameParts = telefonename.trim().split(" ");
  let initials = "";
  let firstname = nameParts[0].charAt(0).toUpperCase();
  let lastname = nameParts[1]?.charAt(0).toUpperCase();
  if (firstname && lastname) {
    let initials = firstname + lastname;
    initialsarray.push(initials);
  } else {
    let initials = firstname;
    initialsarray.push(initials);
  }
  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;
  let UserKeyArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeyArray.length; index++) {
    users.push({
      id: UserKeyArray[index],
      user: userResponse[UserKeyArray[index]],
    });
  }
  await addEditSingleUser((id = 1), {
    name: telefonename,
    email: email,
    telefone: phone,
    initials: initials,
  });
  emptyinputs();
  closecontactstemplate();
}

async function firstlastnameletters(id) {
  let contacts = await getUserContacts(id);
}

function emptyinputs() {
  document.getElementById("name").value = "";
  document.getElementById("emailarea").value = "";
  document.getElementById("phone").value = "";
  showcontacts();
}

async function putData(path = "", data = {}) {
  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responsetoJson = await response.json());
}

async function addEditSingleUser(id = 1, contact = { name: "Kevin" }) {
  let userContacts = await getUserContacts(id);

  let existingIndexes = Object.keys(userContacts).map(Number);

  let nextIndex =
    existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;

  await putData(`users/${id}/contacts/${nextIndex}`, contact);
}

async function getUserContacts(id) {
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  return await response.json();
}

async function showinitials(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();

  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );

  responsestoJson.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
  for (let index = 0; index < responsestoJson.length; index++) {
    let firstlastname = responsestoJson[index].name.trim().split(" ");
    let firstname = firstlastname[0].charAt(0).toUpperCase();
    let lastname = firstlastname[1].charAt(0).toUpperCase();
    if (firstname && lastname) {
      let initials = firstname + lastname;
      initialsarray.push(initials);
    } else {
      let initials = firstname;
      initialsarray.push(initials);
    }
  }
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}

function checkwidth() {
  if (window.innerWidth < 1050) {
    document.getElementById("closeimage").src = "/img/close1.png";
  } else {
    document.getElementById("closeimage").src = "/img/close.png";
  }
}
window.addEventListener("resize", checkwidth);
