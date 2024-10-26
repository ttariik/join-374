let contactusers = [];
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
  contactusers.push(responsestoJson);

  document.getElementById("contactmenu").innerHTML = "";
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

  const color = getColorFromString(responsestoJson[index].name);

  return /*html*/ `
      ${title}
  <div class="align" id="${index}" onclick="showcontacttemplate(${index})">
    <div class="badge" style="background-color: ${color};">
      ${responsestoJson[index].initials}
    </div>
    <div class="secondpart">
      <div class="name">${responsestoJson[index].name}</div>
      <div class="email">${responsestoJson[index].email}</div>
    </div>
  </div>
  `;
}

function getColorFromString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  let r = (hash >> 24) & 0xff;
  let g = (hash >> 16) & 0xff;
  let b = (hash >> 8) & 0xff;

  const lightnessFactor = 0.4;
  r = Math.floor(r + (255 - r) * lightnessFactor);
  g = Math.floor(g + (255 - g) * lightnessFactor);
  b = Math.floor(b + (255 - b) * lightnessFactor);

  return `rgb(${r}, ${g}, ${b})`;
}

async function showcontacttemplate(index, id = 1) {
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

  document.querySelector(".contacttemplatedesing").style.display = "flex";
  document.querySelector(".contacttemplatedesing").style.transform =
    "translateX(0%)";

  const contact = responsestoJson[index];
  if (contact) {
    document.getElementById("badge").innerHTML = contact.initials;
    document.getElementById("title").innerHTML = contact.name;
    document.getElementById("email").innerHTML = contact.email;
    document.getElementById("telefone").innerHTML = contact.telefone;
  } else {
    console.error("Contact not found at the given index");
  }
}

function resetclick(index, id) {
  document.getElementById("contacttemplate").style =
    "transform: translateX(250%);";
  setTimeout(() => {
    document.getElementById("contacttemplate").style.display = "none";
  }, 10);
  document.getElementById(`${index}`).onclick = () =>
    showcontacttemplate(index, id);
}
