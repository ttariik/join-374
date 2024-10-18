let nextIndex = 0;

async function addcontact(event) {
  event.preventDefault();
  let form = document.querySelector("form");

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  let userResponse = await getAllUsers("users");
  let telefonename = document.getElementById("name").value;
  let email = document.getElementById("email").value;
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
  });
  emptyinputs();
}

function emptyinputs() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
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

  let nextIndex = Object.keys(userContacts).length;
  console.log(nextIndex);

  await putData(`users/${id}/contacts/${nextIndex}`, contact);
}

async function getUserContacts(id) {
  let response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  return await response.json();
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
