import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-database.js";


/**
 * Firebase configuration object containing project details.
 */

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


/**
 * Handles UI updates for logged-in users.
 * @param {string} userId - The unique ID of the logged-in user.
 * @param {HTMLElement} loggedUserNameElement - DOM element for displaying the username.
 * @param {HTMLElement} loggedUserNameMobile - DOM element for displaying the username in mobile view.
 * @param {HTMLElement} userGuest - DOM element for displaying user initials.
 */
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

/**
 * Updates the UI elements for a logged-in user.
 * @param {string} userName - The name of the logged-in user.
 * @param {HTMLElement} loggedUserNameElement - DOM element for the username.
 * @param {HTMLElement} loggedUserNameMobile - DOM element for the username in mobile view.
 * @param {HTMLElement} userGuest - DOM element for displaying user initials.
 */
function updateUIForLoggedInUser(userName, loggedUserNameElement, loggedUserNameMobile, userGuest) {
  const initials = getInitials(userName);
  if (loggedUserNameElement) loggedUserNameElement.innerText = userName;
  if (loggedUserNameMobile) loggedUserNameMobile.innerText = userName;
  if (userGuest) userGuest.innerText = initials;
}

/**
 * Retrieves initials from a given username.
 * @param {string} userName - The user's full name.
 * @returns {string} The initials of the user.
 */
function getInitials(userName) {
  const nameParts = userName.split(" ");
  return nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
      : userName[0].toUpperCase(); 
}

/**
 * Handles UI updates for logged-out users.
 * @param {HTMLElement} loggedUserNameElement - DOM element for the username.
 * @param {HTMLElement} welcomeTextElement - DOM element for the welcome text.
 * @param {HTMLElement} userGuest - DOM element for displaying user initials.
 */
function handleLoggedOutUser(loggedUserNameElement, welcomeTextElement, userGuest) {
  localStorage.removeItem('loggedInUserId');
  if (loggedUserNameElement) loggedUserNameElement.innerText = '';
  const greet = getGreetingMessage();
  if (welcomeTextElement) welcomeTextElement.innerText = greet;
  if (document.getElementById("welcomeText-mobile")) document.getElementById("welcomeText-mobile").innerHTML = greet;
  if (userGuest) userGuest.innerText = 'G';
}

/**
 * Generates a greeting message based on the current time.
 * @returns {string} The greeting message.
 */
function getGreetingMessage() {
  const greetings = [
    'Good Night',
    'Good morning',
    'Good afternoon',
    'Good evening'
  ];
  return greetings[Math.floor(new Date().getHours() / 24 * greetings.length)];
}

/**
 * Loads task counts from the database and updates the UI.
 * @param {string} userId - The user's ID.
 */
async function loadTaskCounts(userId) {
  try {
    const { taskCounts, totalTasks, upcomingDeadline } = await initializeTaskCounts(userId);
    updateTaskCountsDisplay(taskCounts, totalTasks, upcomingDeadline);
  } catch (error) {
    console.error("Fehler beim Laden der Task Counts von Firebase:", error);
  }
}

/**
 * Fetches task counts and other related data from specified folders in the database.
 * @param {string} userId - The user's ID.
 * @param {Object} folders - A mapping of folder keys to folder names in the database.
 * @returns {Promise<{taskCounts: Object, totalTasks: number, upcomingDeadline: string | null}>} An object containing task counts, total tasks, and the next upcoming deadline.
 */
async function fetchTaskCountsFromFolders(userId, folders) {
  let taskCounts = { todos: 0, inprogress: 0, awaitingfeedback: 0, donetasks: 0, urgent: 0 };
  let totalTasks = 0, upcomingDeadline = null;
  for (let [key, folderName] of Object.entries(folders)) {
    const folderSnapshot = await fetchFolderData(userId, folderName);
    if (folderSnapshot.exists()) {
      const { tasks, urgent, deadline } = countUrgentTasks(folderSnapshot.val());
      taskCounts[key] = Object.keys(tasks).length;
      totalTasks += taskCounts[key];
      taskCounts.urgent += urgent;
      upcomingDeadline = deadline || upcomingDeadline;
    }
  }
  return { taskCounts, totalTasks, upcomingDeadline };
}



/**
 * Initializes task counts by retrieving data from the user's task folders.
 * @param {string} userId - The user's ID.
 * @returns {Promise<{taskCounts: Object, totalTasks: number, upcomingDeadline: string | null}>} An object containing task counts, total tasks, and the next upcoming deadline.
 */
async function initializeTaskCounts(userId) {
  const folders = {
    todos: 'todo-folder',
    inprogress: 'inprogress-folder',
    awaitingfeedback: 'awaiting-feedback-folder',
    donetasks: 'done-folder'
  };
  const { taskCounts, totalTasks, upcomingDeadline } = await fetchTaskCountsFromFolders(userId, folders);
  if (taskCounts.urgent > 1 && !upcomingDeadline) {
    upcomingDeadline = urgentTasks[Math.floor(Math.random() * urgentTasks.length)].duedate;
  }
  return { taskCounts, totalTasks, upcomingDeadline };
}

/**
 * Fetches data from a specific folder in the database.
 * @param {string} userId - The user's ID.
 * @param {string} folderName - The name of the folder to retrieve data from.
 * @returns {Promise<Object>} The snapshot of the folder data.
 */
async function fetchFolderData(userId, folderName) {
  const folderRef = ref(realtimeDb, `users/${userId}/tasks/${folderName}`);
  return await get(folderRef);
}

/**
 * Counts urgent tasks and identifies the nearest upcoming deadline from a list of tasks.
 * @param {Object} tasks - The list of tasks to evaluate.
 * @returns {Object} An object containing the count of urgent tasks, tasks, and the nearest deadline.
 */
function countUrgentTasks(tasks) {
  let urgentCount = 0;
  let upcomingDeadline = null;
  for (let task of Object.values(tasks)) {
    if (task.prio === "Urgent") {
      urgentCount++;
      if (!upcomingDeadline || new Date(task.duedate) < new Date(upcomingDeadline)) {
        upcomingDeadline = task.duedate;
      }
    }
  }
  return { tasks, urgent: urgentCount, deadline: upcomingDeadline };
}

/**
 * Updates the UI to display task counts and other related information.
 * @param {Object} taskCounts - An object containing task counts for each folder.
 * @param {number} totalTasks - The total number of tasks.
 * @param {string | null} upcomingDeadline - The nearest deadline date, if available.
 */
function updateTaskCountsDisplay(taskCounts, totalTasks, upcomingDeadline) {
  document.getElementById("todo-task-count").textContent = taskCounts.todos || 0;
  document.getElementById("done-task-count").textContent = taskCounts.donetasks || 0;
  document.getElementById("total-task-count").textContent = totalTasks || 0;
  document.getElementById("inprogress-task-count").textContent = taskCounts.inprogress || 0;
  document.getElementById("review-task-count").textContent = taskCounts.awaitingfeedback || 0;
  document.getElementById("urgent-task-count").textContent = taskCounts.urgent || 0;
  document.getElementById("due-date").textContent = upcomingDeadline || "No Date";
}

/**
 * Predefined user ID for testing purposes.
 * @type {string}
 */
const userId = "1"; 
loadTaskCounts(userId);

/**
 * Array of greeting messages based on the time of day.
 * @type {string[]}
 */
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
