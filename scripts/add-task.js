let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

function selectbutton_1() {
  document.getElementById("button1").classList.toggle("lightred");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button3").classList.remove("lightgreen");
}

function selectbutton_2() {
  document.getElementById("button2").classList.toggle("lightorange");
  document.getElementById("button1").classList.remove("lightred");
  document.getElementById("button3").classList.remove("lightgreen");
}

function selectbutton_3() {
  document.getElementById("button3").classList.toggle("lightgreen");
  document.getElementById("button2").classList.remove("lightorange");
  document.getElementById("button1").classList.remove("lightred");
}

function clearinputs() {
  document.getElementById("myform").reset();
}

async function onLoadFunc() {
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
    tasks: [{}],
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
  putData(`users/${id}`, contact);
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}
