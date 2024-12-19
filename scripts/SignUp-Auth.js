import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

/**
 * Firebase configuration object for initializing the Firebase app.
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

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

/**
 * Displays a message in a specified HTML element for a limited time.
 * 
 * @param {string} message - The message to display.
 * @param {string} divId - The ID of the HTML element where the message will be shown.
 */
function showMessage(message, divId) {
    const overlayDiv = document.getElementById('overlayDiv');
    const messageDiv = document.getElementById(divId);
    overlayDiv.style.display = "flex";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
        overlayDiv.style.display = "none";
    }, 2000);
}

/**
 * Validates if the privacy policy checkbox is checked.
 * 
 * @returns {boolean} - True if the checkbox is checked, false otherwise.
 */
function validatePrivacyCheckbox() {
    const checkbox = document.getElementById('checkPrivacy');
    const checkboxError = document.getElementById('checkboxError');
    if (!checkbox.checked) {
        checkboxError.style.display = 'inline';
        setTimeout(() => checkboxError.style.display = 'none', 2000);
        return false;
    }
    checkboxError.style.display = 'none';
    return true;
}

/**
 * Validates the password and confirms that it meets criteria.
 * 
 * @param {string} password - The entered password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} - True if the password is valid, false otherwise.
 */
function validatePassword(password, confirmPassword) {
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    if (password !== confirmPassword) {
        confirmPasswordError.style.display = 'inline';
        setTimeout(() => confirmPasswordError.style.display = 'none', 2000);
        return false;
    }
    if (password.length < 6) {
        passwordError.style.display = 'inline';
        setTimeout(() => passwordError.style.display = 'none', 2000);
        return false;
    }
    passwordError.style.display = 'none';
    confirmPasswordError.style.display = 'none';
    return true;
}

/**
 * Checks if an email address is valid.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} - True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    const emailError = document.getElementById('emailError');
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(email).toLowerCase())) {
        emailError.style.display = 'inline';
        setTimeout(() => emailError.style.display = 'none', 2000);
        return false;
    }
    emailError.style.display = 'none';
    return true;
}

/**
 * Handles the sign-up process when the sign-up form is submitted.
 * 
 * @param {Event} event - The submit event of the sign-up form.
 */
function handleSignUp(event) {
    event.preventDefault();
    if (!validatePrivacyCheckbox()) return;
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const confirmPassword = document.getElementById('rConfirmPassword').value;
    const name = document.getElementById('rName').value;
    if (!isValidEmail(email)) return;
    if (!validatePassword(password, confirmPassword)) return;  
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => createUserDocument(userCredential.user, email, name))
        .catch((error) => handleSignUpError(error));
}

/**
 * Creates a new user document in Firestore.
 * 
 * @param {Object} user - The Firebase user object.
 * @param {string} email - The user's email address.
 * @param {string} name - The user's name.
 * @returns {Promise<void>} - A promise that resolves when the document is created.
 */
function createUserDocument(user, email, name) {
    const userData = { email, name };
    const docRef = doc(db, "users", user.uid);
    return setDoc(docRef, userData)
        .then(() => {
            showMessage('Account Created Successfully. Please log in.', 'signUpMessage');
            setTimeout(() => window.location.href = 'index.html', 2000);
        });
}

/**
 * Handles errors that occur during the sign-up process.
 * 
 * @param {Object} error - The error object returned by Firebase.
 */
function handleSignUpError(error) {
    const errorMessages = {
        'auth/email-already-in-use': 'Email Already Exists!',
        'auth/invalid-email': 'Invalid email format',
        'auth/weak-password': 'Password is too weak'
    };
    const message = errorMessages[error.code] || 'Unable to create User: ' + error.message;
    showMessage(message, 'signUpMessage');
}

document.getElementById('submitSignUp').addEventListener('click', handleSignUp);

function validateSignUpForm() {
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const confirmPassword = document.getElementById('rConfirmPassword').value;
    const name = document.getElementById('rName').value;
    const checkPrivacy = document.getElementById('checkPrivacy').checked;
    const submitButton = document.getElementById('submitSignUp');
    
    const validEmail = email && isValidEmail(email);
    const validPassword = password && confirmPassword && validatePassword(password, confirmPassword);
    const formValid = validEmail && validPassword && name && checkPrivacy;
    
    submitButton.disabled = !formValid; 
}

document.querySelectorAll('#rEmail, #rPassword, #rConfirmPassword, #rName, #checkPrivacy')
    .forEach(el => el.addEventListener('input', validateSignUpForm));

validateSignUpForm(); 

