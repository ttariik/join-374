const GLOBAL =
  "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app/";

function loaddata() {
  fetch(GLOBAL).then((response) => {
    if (!response.ok) {
      throw new Error("funktioniert");
    }
    return response.json();
  });
  then((data) => {
    console.log(data);
  }).catch((error) => {
    console.error("keine ahung");
  });
}


loaddata();