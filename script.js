/**
 * Loads HTML content into elements with the `w3-include-html` attribute.
 * Replaces the attribute with the fetched HTML content or an error message.
 */
function includeHTML() {
  var elements = document.querySelectorAll("[w3-include-html]");
  elements.forEach((elmnt) => {
    const file = elmnt.getAttribute("w3-include-html");
    if (file) {
      const xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("w3-include-html");
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
    }
  });
}

/**
 * Redirects the user to the last visited page stored in `localStorage`.
 * If no page is found, displays an alert message.
 */
function reloadLastPage() {
  const lastVisitedPage = localStorage.getItem("lastVisitedPage");
  if (lastVisitedPage) {
    window.location.href = lastVisitedPage;
  } else {
    alert("Keine letzte Seite gefunden.");
  }
}

window.addEventListener("beforeunload", function () {
  const currentUrl = window.location.href;
  localStorage.setItem("lastVisitedPage", currentUrl);
});

document.addEventListener("DOMContentLoaded", function () {
  const reloadButton = document.getElementById("reloadLastPage");
  if (reloadButton) {
    reloadButton.onclick = reloadLastPage;
  }
});

/**
 * Toggles the visibility of the dropdown menu.
 * Shows the dropdown if hidden, hides it if shown.
 */
function toggleDropdown() {
  const dropdownMenu = document.getElementById("dropdownMenu");
  dropdownMenu.style.display =
    dropdownMenu.style.display === "block" ? "none" : "block";
}

window.onclick = function (event) {
  if (!event.target.matches(".user-initials")) {
    const dropdowns = document.getElementsByClassName("dropdown-menu");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.style.display === "block") {
        openDropdown.style.display = "none";
      }
    }
  }
};

window.onload = function () {
  const logo = document.querySelector(".logo");
  const overlay = document.querySelector(".overlay");

  logo.classList.add("fly-in");


  setTimeout(() => {
    overlay.classList.add("fade-out");
  }, 500);
};



