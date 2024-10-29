import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
  const loggedUserNameElement = document.getElementById('loggedUserName');
  const loggedUserNameMobile = document.getElementById('loggedUserName-mobile');
  const welcomeTextElement = document.getElementById('welcomeText');
  const userGuest = document.getElementById('user-initials');

  if (user) {
    getDoc(doc(db, "users", user.uid)).then((docSnap) => {
      if (docSnap.exists()) {
        const userName = docSnap.data().name;
        
        const nameParts = userName.split(" ");
        const initials = nameParts.length >= 2 
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
            : userName[0].toUpperCase(); 

        if (loggedUserNameElement) loggedUserNameElement.innerText = userName;
        if (loggedUserNameMobile) loggedUserNameMobile.innerText = userName;
        if (userGuest) userGuest.innerText = initials; 
        
        localStorage.setItem('loggedInUserId', user.uid);
      } else {
        console.error('No such document!');
      }
    }).catch(console.error);
  } else {
    localStorage.removeItem('loggedInUserId');
    if (loggedUserNameElement) loggedUserNameElement.innerText = '';
    const greet = [
      'Good Night',
      'Good morning',
      'Good afternoon',
      'Good evening'
    ][parseInt(new Date().getHours() / 24 * 4)];
    if (welcomeTextElement) welcomeTextElement.innerText = greet;
    if (document.getElementById("welcomeText")) document.getElementById("welcomeText").innerHTML = greet;
    if (document.getElementById("welcomeText-mobile")) document.getElementById("welcomeText-mobile").innerHTML = greet;
    if (userGuest) userGuest.innerText = 'G';
  }
});

document.addEventListener("DOMContentLoaded", function() {
  loadTaskCounts(); 
});

function loadTaskCounts() {
  const taskCounts = JSON.parse(localStorage.getItem('taskCounts')) || { todos: 0, inprogress: 0, awaitingfeedback: 0, donetasks: 0 };
  const totalTasks = localStorage.getItem('totalTasks') || 0; 

  document.getElementById("todo-task-count").textContent = taskCounts.todos || 0;
  document.getElementById("done-task-count").textContent = taskCounts.donetasks || 0;
  document.getElementById("total-task-count").textContent = totalTasks;
  document.getElementById("inprogress-task-count").textContent = taskCounts.inprogress || 0;
  document.getElementById("review-task-count").textContent = taskCounts.awaitingfeedback || 0;
}


const greet = [
  'Go to bed!',
  'Good morning,',
  'Good afternoon,',
  'Good evening,'
][parseInt(new Date().getHours() / 24 * 4)];

if (document.getElementById("welcomeText")) document.getElementById("welcomeText").innerHTML = greet;
if (document.getElementById("welcomeText-mobile")) document.getElementById("welcomeText-mobile").innerHTML = greet;

setTimeout(function() {
  const welcomeWrapper = document.getElementById("welcomeWrapper");
  if (welcomeWrapper) welcomeWrapper.style.opacity = "0";
}, 2000);

setTimeout(function() {
  const welcomeWrapper = document.getElementById("welcomeWrapper");
  if (welcomeWrapper) welcomeWrapper.style.display = "none";
}, 3000); 
