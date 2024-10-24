function includeHTML() {
  var z, i, elmnt, file, xhttp;
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      return;
    }
  }
}


function reloadLastPage() {
  const lastVisitedPage = localStorage.getItem('lastVisitedPage');
  if (lastVisitedPage) {
    window.location.href = lastVisitedPage; 
  } else {
    alert("Keine letzte Seite gefunden.");
  }
}


window.addEventListener('beforeunload', function () {
  const currentUrl = window.location.href;
  localStorage.setItem('lastVisitedPage', currentUrl);
});


document.addEventListener('DOMContentLoaded', function () {
  const reloadButton = document.getElementById('reloadLastPage');


  if (reloadButton) {
    reloadButton.onclick = reloadLastPage; 
  }
});


function toggleDropdown() {
  const dropdownMenu = document.getElementById('dropdownMenu');
  dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
}


window.onclick = function (event) {
  if (!event.target.matches('.user-initials')) {
      const dropdowns = document.getElementsByClassName('dropdown-menu');
      for (let i = 0; i < dropdowns.length; i++) {
          const openDropdown = dropdowns[i];
          if (openDropdown.style.display === 'block') {
              openDropdown.style.display = 'none';
          }
      }
  }
};


// 


window.onload = function() {
  const logo = document.querySelector('.logo');
  const overlay = document.querySelector('.overlay');
  

  logo.classList.add('fly-in');
  

  setTimeout(() => {
    overlay.classList.add('fade-out');
  }, 500); 
};