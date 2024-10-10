

function onLoadFunc() {
    console.log('test');
    loadData("")
}

const GLOBAL = "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadData(path ="") {
    let response = await fetch (BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    
}