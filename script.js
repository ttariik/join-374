function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}


function reloadLastPage() {
  const lastVisitedPage = localStorage.getItem('lastVisitedPage');
  if (lastVisitedPage) {
    window.location.href = lastVisitedPage; // Seite neu laden
  } else {
    alert("Keine letzte Seite gefunden.");
  }
}

// Speichern der aktuellen URL in localStorage, wenn die Seite gewechselt wird
window.addEventListener('beforeunload', function () {
  const currentUrl = window.location.href;
  localStorage.setItem('lastVisitedPage', currentUrl);
});

// Warten, bis das DOM vollständig geladen ist
document.addEventListener('DOMContentLoaded', function () {
  const reloadButton = document.getElementById('reloadLastPage');

  // Überprüfen, ob das Element existiert, bevor wir den Event-Listener setzen
  if (reloadButton) {
    reloadButton.onclick = reloadLastPage; // Event-Listener nur setzen, wenn der Button existiert
  }
});


