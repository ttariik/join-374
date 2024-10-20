import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBd0pN6k7g1-JTajsrebcmW_E5uxomtV5M",
    authDomain: "login-form-f8aa0.firebaseapp.com",
    projectId: "login-form-f8aa0",
    storageBucket: "login-form-f8aa0.appspot.com",
    messagingSenderId: "606123084207",
    appId: "1:606123084207:web:6d83a901d7d5637060475a",
    measurementId: "G-DBXXGLYQHX"
};

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

const app = initializeApp(firebaseConfig);

const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const confirmPassword = document.getElementById('rConfirmPassword').value;  // Bestätigungsfeld
    const name = document.getElementById('rName').value;

    // Überprüfen, ob das Passwort mit dem Bestätigungspasswort übereinstimmt
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'signUpMessage');
        return;  // Registrierung abbrechen
    }

    const auth = getAuth();
    const db = getFirestore();

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const userData = {
                email: email,
                name: name,
            };
            showMessage('Account Created Successfully', 'signUpMessage');
            const docRef = doc(db, "users", user.uid);
            setDoc(docRef, userData)
            .then(() => {
                showMessage('Account Created Successfully', 'signUpMessage');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000); 
            })
            .catch((error) => {
                console.error("Error writing document", error);
            });
        
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/email-already-in-use') {
                showMessage('Email Already Exists!', 'signUpMessage');
            } else {
                showMessage('Unable to create User', 'signUpMessage');
            }
        });
});
