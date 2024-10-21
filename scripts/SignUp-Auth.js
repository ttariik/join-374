import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
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

    const checkbox = document.getElementById('checkPrivacy');
    const checkboxError = document.getElementById('checkboxError');

  
    if (!checkbox.checked) {
        checkboxError.style.display = 'inline'; 
        return; 
    } else {
        checkboxError.style.display = 'none'; 
    }

    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const confirmPassword = document.getElementById('rConfirmPassword').value;
    const name = document.getElementById('rName').value;

    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'signUpMessage');
        return;  
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