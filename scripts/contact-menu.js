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

async function showcontacts(id = 1) {
  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();

  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );
  let displayedLetters = new Set();

  responsestoJson.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();

    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });

  for (let index = 0; index < responsestoJson.length; index++) {
    document.getElementById("contactmenu").innerHTML += contactsmenutemplate(
      responsestoJson,
      index,
      displayedLetters
    );
  }
}

function contactsmenutemplate(responsestoJson, index, displayedLetters, i) {
  let firstletter = responsestoJson[index].name.charAt(0).toUpperCase();

  let title = "";
  if (!displayedLetters.has(firstletter)) {
    title = `<h2>${firstletter}</h2>
    <div class="lineseperator"></div>`;
    displayedLetters.add(firstletter);
  }
  return /*html*/ `
      ${title}
  <div class="align" id="${index}"onclick="showcontacttemplate(id)">
    <div class="badge">${responsestoJson[index].initials}</div><div class="secondpart"><div class="name">${responsestoJson[index].name}</div>
    <div class="email">${responsestoJson[index].email}</div></div>
  </div>
  
  `;
}

async function showcontacttemplate(index, id = 1) {
  document.getElementById("contacttemplate").style.display = "block";

  let responses = await fetch(GLOBAL + `users/${id}/contacts.json`);
  let responsestoJson = await responses.json();
  responsestoJson = responsestoJson.filter(
    (contact) => contact && contact.name
  );

  document.getElementById("badge").innerHTML = responsestoJson[index].initials;
  document.getElementById("title").innerHTML = responsestoJson[index].name;
  document.getElementById("email").innerHTML = responsestoJson[index].email;
  document.getElementById("telefone").innerHTML =
    responsestoJson[index].telefone;

  document.getElementById("contacttemplate").style =
    "transform: translateX(0%);";
  document.getElementById(`${index}`).onclick = () => resetclick(index, id);
}

function resetclick(index, id) {
  document.getElementById("contacttemplate").style.display = "none";
  setTimeout(() => {
    document.getElementById("contacttemplate").style =
      "transform: translateX(250%);";
  }, 10);
  document.getElementById(`${index}`).onclick = () =>
    showcontacttemplate(index, id);
}
