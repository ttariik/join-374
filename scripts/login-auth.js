import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Firebase-Konfigurationsobjekt für die Verbindung zur Firebase-Datenbank.
 * @type {Object}
 */
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

/**
 * Initialisiert die Firebase-App mit der angegebenen Konfiguration.
 * @type {Object}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase-Authentifizierungsinstanz.
 * @type {Object}
 */
const auth = getAuth();

/**
 * Firebase Firestore-Datenbankinstanz.
 * @type {Object}
 */
const db = getFirestore();

/**
 * Zeigt eine Nachricht in einem bestimmten HTML-Div an.
 * @param {string} message - Die Nachricht, die angezeigt werden soll.
 * @param {string} divId - Die ID des Divs, in dem die Nachricht angezeigt werden soll.
 */
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => messageDiv.style.opacity = 0, 2000);
}

/**
 * Behandelt das Anmelden eines Benutzers mit E-Mail und Passwort.
 * @param {Event} event - Das Ereignis, das beim Absenden des Anmeldeformulars ausgelöst wird.
 */
function handleSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            setTimeout(() => window.location.href = '/summary.html', 1000);
        })
        .catch(() => showMessage('Incorrect Email or Password', 'signInMessage'));
}

/**
 * Behandelt das Gast-Login, bei dem der Benutzer entweder abgemeldet oder keine Anmeldung erforderlich ist.
 * @param {Event} event - Das Ereignis, das beim Klick auf den Gast-Login-Button ausgelöst wird.
 */
function handleGuestLogin(event) {
    event.preventDefault();
    auth.onAuthStateChanged((user) => {
        if (user) {
            signOut(auth)
                .then(() => clearGuestData())
                .catch(() => showMessage('Error signing out, please try again.', 'signInMessage'));
        } else {
            clearGuestData();
        }
    });
}

/**
 * Löscht die Daten des Gast-Logins und leitet den Benutzer zur Zusammenfassungsseite weiter.
 */
function clearGuestData() {
    localStorage.removeItem('loggedInUserId');
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestInitial', 'G');
    window.location.href = '/summary.html';
}

/**
 * Behandelt die Funktion "Angemeldet bleiben" und speichert die E-Mail-Adresse des Benutzers.
 */
function handleRememberMe() {
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');
    document.getElementById('submitSignIn').addEventListener('click', () => {
        if (rememberMeCheckbox.checked) localStorage.setItem('rememberedEmail', emailInput.value);
        else localStorage.removeItem('rememberedEmail');
    });
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
}

// Event Listener für die Anmelde- und Gastlogin-Buttons
document.getElementById('submitSignIn').addEventListener('click', handleSignIn);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);

// Funktion für "Angemeldet bleiben" aufrufen
handleRememberMe();

// Funktion zur Überprüfung der Eingabefelder
function validateForm() {
    const submitButton = document.getElementById('submitSignIn');
    submitButton.disabled = !document.getElementById('email').value || !document.getElementById('password').value;
}
['email', 'password'].forEach(id => document.getElementById(id).addEventListener('input', validateForm));

validateForm();
document.getElementById('submitSignIn').addEventListener('click', handleSignIn);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);

handleRememberMe();
