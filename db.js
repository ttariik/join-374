let GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

function onLoadFunc() {
  console.log("test");
  loadData();
}

async function loadData() {
  let response = await fetch(GLOBAL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}
