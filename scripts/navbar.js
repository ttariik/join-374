import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
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
});


function getInitials(name) {
    const nameParts = name.split(' ');
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts.length > 1 ? nameParts[1].charAt(0) : '';
    return firstInitial + lastInitial;
}


function displayUserInitials(initials) {
    const initialsElement = document.getElementById('user-initials');
    if (initialsElement) {
        initialsElement.textContent = initials;
    } else {
        console.log('Element zum Anzeigen der Initialen nicht gefunden.');
    }
}