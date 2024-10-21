import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
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

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const auth = getAuth();
    const db = getFirestore();

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);

            setTimeout(() => {
                window.location.href = '/templates-html/summary.html';
            }, 2000);
        })
        .catch((error) => {
            console.error("Error during sign in:", error);
            const errorCode = error.code;
            showMessage('Incorrect Email or Password', 'signInMessage');
        });
});

const guestLogin = document.getElementById('guestLogin');
guestLogin.addEventListener('click', (event) => {
    event.preventDefault();
    localStorage.setItem('loggedInUserId', 'guest');
    window.location.href = '/templates-html/summary.html';
});
