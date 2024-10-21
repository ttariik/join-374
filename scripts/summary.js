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
  const loggedInUserId = localStorage.getItem('loggedInUserId');
  if (loggedInUserId) {
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          document.getElementById('loggedUserName').innerText = userData.name;
        } else {
          console.error('No such document!');
        }
      })
  }
});

document.addEventListener('DOMContentLoaded', function () {

  const todoCount = localStorage.getItem('todoCount') || 0;
  const inprogressCount = localStorage.getItem('inprogressCount') || 0;
  const reviewCount = localStorage.getItem('reviewCount') || 0;
  const doneCount = localStorage.getItem('doneCount') || 0;

  document.getElementById('todo-task-count').textContent = todoCount;
  document.getElementById('inprogress-task-count').textContent = inprogressCount;
  document.getElementById('review-task-count').textContent = reviewCount;
  document.getElementById('done-task-count').textContent = doneCount;
});

document.addEventListener('DOMContentLoaded', function () {

  const todoCount = localStorage.getItem('todo-folderCount') || 0;
  const inprogressCount = localStorage.getItem('inprogress-folderCount') || 0;
  const reviewCount = localStorage.getItem('review-folderCount') || 0;
  const doneCount = localStorage.getItem('done-folderCount') || 0;

  document.getElementById('todo-task-count').textContent = todoCount;
  document.getElementById('inprogress-task-count').textContent = inprogressCount;
  document.getElementById('review-task-count').textContent = reviewCount;
  document.getElementById('done-task-count').textContent = doneCount;

  const totalTaskCount = parseInt(todoCount) + parseInt(inprogressCount) + parseInt(reviewCount) + parseInt(doneCount);
  document.getElementById('total-task-count').textContent = totalTaskCount;
});
