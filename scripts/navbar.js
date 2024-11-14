import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyCgtAsiQmSwKltGMjS6qRva_RZJjPqOCpw",
    authDomain: "join-backend-dd268.firebaseapp.com",
    databaseURL: "https://join-backend-dd268-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "join-backend-dd268",
    storageBucket: "join-backend-dd268.appspot.com",
    messagingSenderId: "399648374722",
    appId: "1:399648374722:web:563373ff4a688596bba05b",
    measurementId: "G-D3K960J8WM"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        let initials = "G";
        if (user) {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                initials = userDoc.data().name ? getInitials(userDoc.data().name) : initials;
            } else {
                console.log('Benutzerdokument nicht gefunden.');
            }
        }
        displayUserInitials(initials);
        setupLogout();
    });
});


function getInitials(name) {
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
    return firstInitial + lastInitial;
}


function displayUserInitials(initials) {
    const checkExist = setInterval(() => {
        const initialsElement = document.getElementById('user-initials');
        if (initialsElement) {
            initialsElement.textContent = initials;
            clearInterval(checkExist); 
        } else {
            console.error('Element mit ID "user-initials" nicht gefunden!');
        }
    }, 100); 
}


function setupLogout() {
    const logoutButton = document.getElementById('logoutID');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); 
            signOut(auth)
            .then(() => {
                console.log('Erfolgreich abgemeldet.');
                window.location.href = '../index.html'; 
            })
            .catch((error) => {
                console.error('Fehler beim Abmelden:', error);
            });
        });
    } 
}


document.addEventListener('DOMContentLoaded', function() {
    setupLogout();
    window.onclick = function (event) {
        if (!event.target.matches('.user-initials')) {
            const dropdowns = document.getElementsByClassName('dropdown-menu');
            for (let i = 0; i < dropdowns.length; i++) {
                const openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    };
});


window.onclick = function(event) {
    const menu = document.getElementById('dropupMenu');
    if (!event.target.matches('.overlay-options img') && !menu.contains(event.target)) {
        menu.style.display = 'none';
    }
  }
