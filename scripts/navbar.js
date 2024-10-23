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

// Funktion zur Abmeldung
function setupLogout() {
    const logoutButton = document.getElementById('logoutID');

    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Verhindert das Standardverhalten des Links
            signOut(auth)
            .then(() => {
                console.log('Erfolgreich abgemeldet.');
                window.location.href = '../index.html'; // Korrekte Umleitung
            })
            .catch((error) => {
                console.error('Fehler beim Abmelden:', error);
            });
        });
    } else {
        console.error('Logout-Button nicht gefunden!');
    }
}

// Überwachung des Authentifizierungsstatus
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const name = userData.name;

            if (name) {
                const initials = getInitials(name);
                displayUserInitials(initials);
            } else {
                console.log('Kein Name im Firestore-Dokument vorhanden.');
            }
        } else {
            console.log('Benutzerdokument nicht gefunden.');
        }
    } else {
        console.log('Kein Benutzer eingeloggt.');
    }

    setupLogout(); // Setup für Logout
});

// Funktion zur Ermittlung der Initialen
function getInitials(name) {
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
    return firstInitial + lastInitial;
}

// Funktion zur Anzeige der Initialen
function displayUserInitials(initials) {
    const initialsElement = document.getElementById('user-initials');
    if (initialsElement) {
        initialsElement.textContent = initials;
    } else {
        console.log('Element zum Anzeigen der Initialen nicht gefunden.');
    }
}
