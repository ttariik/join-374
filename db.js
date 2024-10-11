let users = [];
const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

async function onLoadFunc() {
  let userResponse = await getAllUsers("users");

  let UserKeyArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeyArray.length; index++) {
    users.push({
      id: UserKeyArray[index],
      user: userResponse[UserKeyArray[index]],
    });
  }
  await addEditSingleUser((id = 1), {
    name: "Ioannis",
    lastname: "Karakasidis",
    username: "Ioannis",
    password: "123",
    email: "gianniskarakasidhs@hotmail.com",
    contacts: {
      name: "peter",
      telefone: "123456789",
    },
    tasks: {
      name: "Log in / Sign up Logik",
    },
    inprogress: {
      name: "Backend",
    },
    awaitingfeedback: {
      name: "Backend",
    },
    done: {
      name: "board drag and drop",
    },
  });
  console.log(users);
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

async function addEditSingleUser(id = 1, user = { name: "Kevin" }) {
  putData(`users/${id}`, user);
}

async function getAllUsers(path) {
  let response = await fetch(GLOBAL + path + ".json");
  return (responsetoJson = await response.json());
}
