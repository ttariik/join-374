import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";


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


function validatePassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'signUpMessage');
        return false;
    }
    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', 'signUpMessage');
        return false;
    }
    return true;
}


function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}


function handleSignUp(event) {
    event.preventDefault();
    if (!validatePrivacyCheckbox()) return;
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const confirmPassword = document.getElementById('rConfirmPassword').value;
    const name = document.getElementById('rName').value;
    if (!isValidEmail(email)) {
        showMessage('Invalid email address', 'signUpMessage');
        return;
    }

    if (!validatePassword(password, confirmPassword)) return;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => createUserDocument(userCredential.user, email, name))
        .catch((error) => handleSignUpError(error));
}


function createUserDocument(user, email, name) {
    const userData = { email, name };
    const docRef = doc(db, "users", user.uid);
    return setDoc(docRef, userData)
        .then(() => {
            showMessage('Account Created Successfully. Please log in.', 'signUpMessage');
            setTimeout(() => window.location.href = 'index.html', 2000);
        });
}


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
