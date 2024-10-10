const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

function onLoadFunc() {
  postData("O8qLwXTcpuwmcg1hMwW/", { name: "page" });
}

async function loadData() {
  let response = await fetch(GLOBAL + ".json");
  let responseToJson = await response.json();
  console.log(responseToJson);
}

async function postData(path = "", data = {}) {
  let response = await fetch(GLOBAL + ".json", {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = response.json());
}
