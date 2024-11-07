import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 2000);
}

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const signIn = document.getElementById('submitSignIn');
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);

            setTimeout(() => {
                window.location.href = '/summary.html';
            }, 1000);
        })
        .catch((error) => {
            console.error("Error during sign in:", error);
            showMessage('Incorrect Email or Password', 'signInMessage');
        });
});


const guestLogin = document.getElementById('guestLogin');
guestLogin.addEventListener('click', (event) => {
    event.preventDefault();
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            signOut(auth).then(() => {
                localStorage.removeItem('loggedInUserId'); 
                localStorage.setItem('isGuest', 'true'); 
                localStorage.setItem('guestInitial', 'G'); 
                window.location.href = '/summary.html';
            }).catch((error) => {
                console.error("Error during sign out:", error);
                showMessage('Error signing out, please try again.', 'signInMessage');
            });
        } else {
            localStorage.removeItem('loggedInUserId');
            localStorage.setItem('isGuest', 'true'); 
            localStorage.setItem('guestInitial', 'G'); 
            window.location.href = '/summary.html';
        }
    });
});

function handleRememberMe() {
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const emailInput = document.getElementById('email');

    document.getElementById('submitSignIn').addEventListener('click', () => {
        if (rememberMeCheckbox.checked) {
            localStorage.setItem('rememberedEmail', emailInput.value);
        } else {
            localStorage.removeItem('rememberedEmail');
        }
    });
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
}
handleRememberMe();