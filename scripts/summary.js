import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBd0pN6k7g1-JTajsrebcmW_E5uxomtV5M",
    authDomain: "login-form-f8aa0.firebaseapp.com",
    projectId: "login-form-f8aa0",
    storageBucket: "login-form-f8aa0.appspot.com",
    messagingSenderId: "606123084207",
    appId: "1:606123084207:web:6d83a901d7d5637060475a",
    measurementId: "G-DBXXGLYQHX"
};

const app = initializeApp(firebaseConfig);

const auth= getAuth();
const db=getFirestore();

onAuthStateChanged(auth, (user)=> {
  const loggedInUserId=localStorage.getItem('loggedInUserId');
  if(loggedInUserId){
    const docRef = doc(db, "users", loggedInUserId);
    getDoc(docRef)
    .then ((docSnap) => {
      if(docSnap.exists()){
        const userData = docSnap.data();
        document.getElementById('loggedUserName').innerText = userData.name;
      } else {
        console.error('No such document!');
      }
    })
  }
});





document.addEventListener('DOMContentLoaded', function() {

    const todoCount = localStorage.getItem('todoCount') || 0;
    const inprogressCount = localStorage.getItem('inprogressCount') || 0;
    const reviewCount = localStorage.getItem('reviewCount') || 0;
    const doneCount = localStorage.getItem('doneCount') || 0;
  
    document.getElementById('todo-task-count').textContent = todoCount;
    document.getElementById('inprogress-task-count').textContent = inprogressCount;
    document.getElementById('review-task-count').textContent = reviewCount;
    document.getElementById('done-task-count').textContent = doneCount;
  });
  
  document.addEventListener('DOMContentLoaded', function() {
 
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
  