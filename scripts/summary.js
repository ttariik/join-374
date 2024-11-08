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


async function loadTaskCounts(userId) {
  try {
    let taskCounts = { todos: 0, inprogress: 0, awaitingfeedback: 0, donetasks: 0, urgent: 0 };
    let totalTasks = 0;
    let upcomingDeadline = null;

    // Liste der Folder, die gezählt werden sollen
    const folders = {
      todos: 'todo-folder',
      inprogress: 'inprogress-folder',
      awaitingfeedback: 'awaiting-feedback-folder',
      donetasks: 'done-folder'
    };

    // Array zum Speichern der Urgent Tasks, um später das zufällige Fälligkeitsdatum auszuwählen
    let urgentTasks = [];

    // Durch jeden Folder iterieren und die Anzahl der Tasks zählen
    for (let [key, folderName] of Object.entries(folders)) {
      const folderRef = ref(realtimeDb, `users/${userId}/tasks/${folderName}`);
      const folderSnapshot = await get(folderRef);

      if (folderSnapshot.exists()) {
        const tasks = folderSnapshot.val();
        const taskCount = Object.keys(tasks).length;
        taskCounts[key] = taskCount;
        totalTasks += taskCount; // Gesamte Task-Zahl erhöhen

        for (let taskId in tasks) {
          const task = tasks[taskId];

          // Zählen der "Urgent" Tasks und Bestimmen der Deadline
          if (task.prio === "Urgent") {
            taskCounts.urgent += 1;
            urgentTasks.push(task); // Speichern der Urgent Tasks

            if (!upcomingDeadline || new Date(task.duedate) < new Date(upcomingDeadline)) {
              upcomingDeadline = task.duedate;
            }
          }
        }
      }
    }
    if (urgentTasks.length > 1) {
      const randomUrgentTask = urgentTasks[Math.floor(Math.random() * urgentTasks.length)];
      upcomingDeadline = randomUrgentTask.duedate;
    }
    document.getElementById("todo-task-count").textContent = taskCounts.todos || 0;
    document.getElementById("done-task-count").textContent = taskCounts.donetasks || 0;
    document.getElementById("total-task-count").textContent = totalTasks;
    document.getElementById("inprogress-task-count").textContent = taskCounts.inprogress || 0;
    document.getElementById("review-task-count").textContent = taskCounts.awaitingfeedback || 0;
    document.getElementById("urgent-task-count").textContent = taskCounts.urgent || 0;
    document.getElementById("due-date").textContent = upcomingDeadline || "No Date";

  } catch (error) {
    console.error("Fehler beim Laden der Task Counts von Firebase:", error);
  }
}

const userId = "1"; 
loadTaskCounts(userId);


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






