// Firebase imports
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Firebase-Konfiguration
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

// Firebase App initialisieren
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Benutzerdaten aus Firebase holen
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log('Benutzer eingeloggt:', user);
        const userDocRef = doc(db, "users", user.uid);  // Hier die UID verwenden, die im Firestore gespeichert ist
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('Benutzerdaten:', userData); // Überprüfen, ob die Benutzerdaten abgerufen werden
            const name = userData.name;

            if (name) {
                const initials = getInitials(name);
                console.log('Initialen:', initials); // Überprüfen, ob die Initialen korrekt generiert werden
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
});

// Funktion zum Erstellen der Initialen aus dem Namen
function getInitials(name) {
    const nameParts = name.split(' '); 
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0) : ''; 
    return firstInitial + lastInitial; 
}

// Funktion zum Anzeigen der Initialen in der Navbar
function displayUserInitials(initials) {
    const initialsElement = document.getElementById('user-initials');
    if (initialsElement) {
        initialsElement.textContent = initials;
    } else {
        console.log('Element zum Anzeigen der Initialen nicht gefunden.');
    }
}
