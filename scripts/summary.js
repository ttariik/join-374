import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getDatabase, ref, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";


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
const realtimeDb = getDatabase();


onAuthStateChanged(auth, (user) => {
  const loggedUserNameElement = document.getElementById('loggedUserName');
  const loggedUserNameMobile = document.getElementById('loggedUserName-mobile');
  const welcomeTextElement = document.getElementById('welcomeText');
  const userGuest = document.getElementById('user-initials');
  if (user) {
    handleLoggedInUser(user.uid, loggedUserNameElement, loggedUserNameMobile, userGuest);
  } else {
    handleLoggedOutUser(loggedUserNameElement, welcomeTextElement, userGuest);
  }
});


async function handleLoggedInUser(userId, loggedUserNameElement, loggedUserNameMobile, userGuest) {
  try {
    const docSnap = await getDoc(doc(db, "users", userId));

    if (docSnap.exists()) {
      const userName = docSnap.data().name;
      updateUIForLoggedInUser(userName, loggedUserNameElement, loggedUserNameMobile, userGuest);
      localStorage.setItem('loggedInUserId', userId);
      loadUrgentTaskCount(userId); 
    } else {
      console.error('No such document!');
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzerdokuments:", error);
  }
}


function updateUIForLoggedInUser(userName, loggedUserNameElement, loggedUserNameMobile, userGuest) {
  const initials = getInitials(userName);

  if (loggedUserNameElement) loggedUserNameElement.innerText = userName;
  if (loggedUserNameMobile) loggedUserNameMobile.innerText = userName;
  if (userGuest) userGuest.innerText = initials;
}


function getInitials(userName) {
  const nameParts = userName.split(" ");
  return nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : userName[0].toUpperCase(); 
}


function handleLoggedOutUser(loggedUserNameElement, welcomeTextElement, userGuest) {
  localStorage.removeItem('loggedInUserId');
  if (loggedUserNameElement) loggedUserNameElement.innerText = '';
  const greet = getGreetingMessage();
  if (welcomeTextElement) welcomeTextElement.innerText = greet;
  if (document.getElementById("welcomeText-mobile")) document.getElementById("welcomeText-mobile").innerHTML = greet;
  if (userGuest) userGuest.innerText = 'G';
}


function getGreetingMessage() {
  const greetings = [
    'Good Night',
    'Good morning',
    'Good afternoon',
    'Good evening'
  ];
  return greetings[Math.floor(new Date().getHours() / 24 * greetings.length)];
}
document.addEventListener("DOMContentLoaded", loadTaskCounts);


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


async function loadUrgentTaskCount() {
  try {
    const tasksRef = ref(realtimeDb, `users`); 
    const snapshot = await get(tasksRef);
    let urgentTaskCount = 0;
    const urgentTasks = []; 

    if (snapshot.exists()) {
      const users = snapshot.val();
      for (const userId in users) {
        const tasks = users[userId].tasks;
        if (tasks) {
          for (const taskId in tasks) {
            if (tasks[taskId].prio === "Urgent") {
              urgentTaskCount++;
              
              urgentTasks.push({
                id: taskId,
                title: tasks[taskId].title, 
                duedate: tasks[taskId].duedate 
              });
            }
          }
        }
      }

      const urgentTaskCountElement = document.getElementById("urgent-task-count");
      if (urgentTaskCountElement) {
        urgentTaskCountElement.textContent = urgentTaskCount > 0 ? urgentTaskCount : "Keine dringenden Aufgaben.";
      }
      if (urgentTasks.length > 0) {
        const randomIndex = Math.floor(Math.random() * urgentTasks.length);
        const randomTask = urgentTasks[randomIndex];
        const randomDueDate = randomTask.duedate;
        const formattedDate = formatDate(randomDueDate);
        const dateElement = document.getElementById("due-date"); 
        if (dateElement) {
          dateElement.innerHTML = `<span>${formattedDate}</span><br>`;
        }
        console.log("Zufällige dringende Aufgabe:", randomTask);
        console.log("Zufälliges Fälligkeitsdatum:", formattedDate);
      } else {
        console.log("Keine dringenden Aufgaben gefunden.");
      }
    } else {
      console.log("Keine Aufgaben gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Zählen der Aufgaben:", error);
  }
}


function formatDate(dateString) {
  const [day, month, year] = dateString.split('/');
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  return `${monthNames[Number(month) - 1]} ${Number(day)}th, ${year}`;
}




