let initialsarrays = [];

async function addcontact(event) {
  event.preventDefault();
  let form = document.querySelector("form");

  // Check if the form is valid
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Get contact details from the form
  let telefonename = document.getElementById("name").value;
  let nameParts = telefonename.trim().split(" ");
  let firstname = nameParts[0].charAt(0).toUpperCase();
  let lastname = nameParts[1]?.charAt(0).toUpperCase();
  let initials = firstname + (lastname || ""); // Generate initials

  let email = document.getElementById("emailarea").value;
  let phone = document.getElementById("phone").value;

  // Check if the contacts object exists in users/1
  const contactsResponse = await fetch(GLOBAL + "users/1/contacts.json");
  const contactsData = await contactsResponse.json();

  // If contacts is null or undefined, initialize it
  if (!contactsData) {
    await fetch(GLOBAL + "users/1/contacts.json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // Initialize contacts as an empty object
    });
  }

  // Determine the next available index
  const contactKeys = Object.keys(contactsData || {});
  let nextIndex = 1; // Start from 1
  if (contactKeys.length > 0) {
    // Find the highest existing index
    nextIndex = Math.max(...contactKeys.map(Number)) + 1;
  }

  // Add the new contact under `users/1/contacts`
  await fetch(GLOBAL + `users/1/contacts/${nextIndex}.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: telefonename,
      email: email,
      telefone: phone,
      initials: initials,
    }),
  });

  emptyinputs(); // Clear the form inputs
  closecontactstemplate(); // Close the contact template/modal
  showcontacts(1); // Refresh contact list to include the new contact
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
