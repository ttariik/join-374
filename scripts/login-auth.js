import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Firebase configuration object for connecting to the Firebase database.
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
 * Initializes the Firebase app with the provided configuration.
 * @type {Object}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase authentication instance.
 * @type {Object}
 */
const auth = getAuth();

/**
 * Firebase Firestore database instance.
 * @type {Object}
 */
const db = getFirestore();

/**
 * Displays a message in a specified HTML div.
 * @param {string} message - The message to display.
 * @param {string} divId - The ID of the div where the message should be displayed.
 */
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => messageDiv.style.opacity = 0, 2000);
}

/**
 * Handles user sign-in using email and password.
 * @param {Event} event - The event triggered when the sign-in form is submitted.
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
 * Handles guest login where the user is either signed out or no sign-in is required.
 * @param {Event} event - The event triggered when the guest login button is clicked.
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
 * Clears guest login data and redirects the user to the summary page.
 */
function clearGuestData() {
    localStorage.removeItem('loggedInUserId');
    localStorage.setItem('isGuest', 'true');
    localStorage.setItem('guestInitial', 'G');
    window.location.href = '/summary.html';
}

/**
 * Handles the "Remember Me" functionality and stores the user's email address.
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

document.getElementById('submitSignIn').addEventListener('click', handleSignIn);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);

handleRememberMe();

function validateForm() {
    const submitButton = document.getElementById('submitSignIn');
    submitButton.disabled = !document.getElementById('email').value || !document.getElementById('password').value;
}
['email', 'password'].forEach(id => document.getElementById(id).addEventListener('input', validateForm));

validateForm();
document.getElementById('submitSignIn').addEventListener('click', handleSignIn);
document.getElementById('guestLogin').addEventListener('click', handleGuestLogin);

handleRememberMe();
