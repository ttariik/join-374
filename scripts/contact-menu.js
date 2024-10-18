function opencontactstemplate() {
  document.querySelector(".overlay2").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay2").style.transform = "translateX(0%)";
  }, 0.5);
}

function closecontactstemplate() {
  document.querySelector(".overlay2").style.transform = "translateX(126%)";
  setTimeout(() => {
    document.querySelector(".overlay2").style.display = "none";
  }, 100);
}

function showcontacts() {
  document.getElementById("contactmenu").innerHTML += `${responsestoJson[1]}`;
}

async function getUsercontacts(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();
  console.log(responsestoJson[1]);
}
