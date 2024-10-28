let displayedLetters = new Set(); // Changed to a Set for better management

async function opencontactstemplate() {
  if (document.getElementById("overlap").childElementCount === 0) {
    const response = await fetch("./Add-Contact.html"); // Fetch the HTML file
    if (!response.ok) throw new Error("Network response was not ok");

    const htmlContent = await response.text(); // Get the text content
    document.getElementById("overlap").innerHTML = htmlContent; // Insert into div

    // Now attach the event listener after the form is added to the DOM
    document.getElementById("formid").onsubmit = function (event) {
      event.preventDefault(); // Prevent the default form submission
      savedata(contactKey); // Call your save data function
    };
  }
  document.querySelector(".overlay2").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay2").style.transform = "translateX(0%)";
  }, 0.5);
}

function closecontactstemplate() {
  document.querySelector(".overlay2").style.transform = "translateX(126%)";
  setTimeout(() => {
    document.getElementById("overlap").innerHTML = "";
  }, 100);
}

async function showcontacts(id = 1) {
  const response = await fetch(GLOBAL + `users/${id}/contacts.json`);
  const responsestoJson = await response.json();

  contactUsers = Object.entries(responsestoJson || {})
    .map(([key, contact]) => ({ key, ...contact }))
    .filter((contact) => contact && contact.name)
    .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

  displayedLetters.clear();
  const contactMenu = document.getElementById("contactmenu");
  contactMenu.innerHTML = "";

  contactUsers.forEach((contact) => {
    contactMenu.innerHTML += contactsmenutemplate(contact);
  });
}

function contactsmenutemplate(contact) {
  console.log(contact);

  let firstLetter = contact.name.charAt(0).toUpperCase();

  if (!displayedLetters.has(firstLetter)) {
    title = `<h2>${firstLetter}</h2>
             <div class="lineseperator"></div>`;
    displayedLetters.add(firstLetter);
  }

  const color = getColorFromString(contact.name);

  return /*html*/ `
      ${title}
      <div class="align" id="${contact.key}" onclick="showcontacttemplate('${
    contact.key
  }');">
        <div class="badge" style="background-color: ${color};">
          ${contact.initials || contact.name.charAt(0).toUpperCase()}
        </div>
        <div class="secondpart">
          <div class="name">${contact.name}</div>
          <div class="email">${contact.email || ""}</div>
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

async function edicontact(contactKey) {
  if (document.getElementById("overlap").childElementCount === 0) {
    const response = await fetch("./Add-Contact.html"); // Fetch the HTML file
    if (!response.ok) throw new Error("Network response was not ok");

    const htmlContent = await response.text(); // Get the text content
    document.getElementById("overlap").innerHTML = htmlContent; // Insert into div
  }
  document.getElementById("spantitle").innerHTML = "Edit contact";
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  document.getElementById("name").value = contact.name;
  document.getElementById("emailarea").value = contact.email || "";
  document.getElementById("phone").value = contact.telefone || "";
  document.getElementById("spandescription").innerHTML = "";
  // Ensure you set the event listener after the HTML content is inserted
  document.getElementById("formid").onsubmit = function (event) {
    event.preventDefault(); // Prevent the default form submission
    savedata(contactKey); // Call your save data function
  };
  document.querySelector(".overlay2").style.display = "flex";
  setTimeout(() => {
    document.querySelector(".overlay2").style.transform = "translateX(0%)";
  }, 0.5);
  document.getElementById("deletedbtn").addEventListener("click", function () {
    deletecontact(contactKey);
    document.getElementById("overlap").innerHTML = "";
    document.getElementById("contacttemplate").innerHTML = "";
    showcontacts((id = 1));
  });
}

async function deletecontact(contactKey) {
  const contactIndex = contactUsers.findIndex(
    (contact) => contact.key === contactKey
  );
  if (contactIndex === -1) {
    console.error("Contact not found");
    return;
  }

  await deleteData(`/users/1/contacts/${contactKey}`);
  showcontacts((id = 1));
  document.getElementById("contacttemplate").innerHTML = "";
}

async function deleteData(path = "", data = {}) {
  const response = await fetch(GLOBAL + path + ".json", {
    method: "DELETE",
  });
  return await response.json();
}

async function showcontacttemplate(contactKey) {
  // Fetch the contact template if not already loaded
  if (document.getElementById("contacttemplate").childElementCount === 0) {
    try {
      const response = await fetch("./contact-template.html");
      if (!response.ok) throw new Error("Network response was not ok");

      const htmlContent = await response.text();
      document.getElementById("contacttemplate").innerHTML = htmlContent;
    } catch (error) {
      console.error("Error fetching contact template:", error);
      return; // Exit the function to prevent further errors
    }
  }

  // Find the contact by key
  const contact = contactUsers.find((user) => user.key === contactKey);

  // Update the UI with contact details
  document.getElementById("title").innerHTML = contact.name;
  document.getElementById("email").innerHTML = contact.email || "";
  document.getElementById("telefone").innerHTML = contact.telefone || "";

  // Set up the edit and delete button actions
  document.getElementById("editbutton").onclick = () => edicontact(contact.key);
  document.getElementById("deletebutton").onclick = () =>
    deletecontact(contact.key);

  // Show the contact template
  const contactTemplate = document.getElementById("contacttemplate");
  contactTemplate.style.display = "flex";
  contactTemplate.style.transform = "translateX(0%)";
}

async function savedata(contactKey) {
  // Find the contact by key
  const contact = contactUsers.find((user) => user.key === contactKey);
  if (!contact) {
    console.error("Contact not found");
    return;
  }

  // Get values from the form
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("emailarea").value.trim();
  let telefone = document.getElementById("phone").value.trim();

  // Validate the inputs
  if (!name || !email || !telefone) {
    alert("All fields must be filled out.");
    return;
  }

  // Save the updated contact data
  const response = await putData(`/users/1/contacts/${contactKey}`, {
    name: name,
    email: email,
    telefone: telefone,
  });

  // Check for response success
  if (!response) {
    console.error("Failed to save contact");
    return;
  }

  // Refresh the contacts display
  await showcontacts(1); // Ensure to specify the correct ID if needed
  closecontactstemplate();

  // Show the updated contact template after a brief delay
  setTimeout(() => {
    showcontacttemplate(contactKey);
  }, 500); // Use 500ms to ensure the overlay has closed
}

async function putData(path = "", data = {}) {
  console.log(`PUT request to ${GLOBAL + path}.json with data:`, data);

  let response = await fetch(GLOBAL + path + ".json", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
}

async function addEditSingleUser(contactKey, contact) {
  const result = await putData(`/users/1/contacts/${contactKey}`, contact);
}
