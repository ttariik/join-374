let initialsarrays = [];

async function addcontact(event) {
  event.preventDefault();
  let form = document.querySelector("form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Check if "contacts" folder exists
  let contactsPath = `/users/1/contacts`;
  let contactsResponse = await fetch(GLOBAL + contactsPath + ".json");
  let contactsData = await contactsResponse.json();

  // If "contacts" folder does not exist, initialize it as an empty object
  if (!contactsData) {
    await putData(contactsPath, {}); // This will create an empty "contacts" folder if it doesn't exist
  }

  // Now proceed with adding the new contact
  let telefonename = document.getElementById("name").value;
  let nameParts = telefonename.trim().split(" ");
  let firstname = nameParts[0].charAt(0).toUpperCase();
  let lastname = nameParts[1]?.charAt(0).toUpperCase();
  let initials = firstname + (lastname || "");

  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;

  await addEditSingleUser(1, {
    name: telefonename,
    email: email,
    telefone: phone,
    initials: initials,
  });

  emptyinputs();
  closecontactstemplate();
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

  // If there are no contacts, initialize `userContacts` as an empty object
  if (!userContacts) {
    userContacts = {};
  }

  let existingIndexes = Object.keys(userContacts).map(Number);

  // Determine the next index for the contact
  let nextIndex =
    existingIndexes.length > 0 ? Math.max(...existingIndexes) + 1 : 1;

  // Add the new contact with the calculated index
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
      initials = firstname + lastname;
    } else {
      initials = firstname;
    }
    initialsarray.push(initials);
  }
  console.log(initialsarray);
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
