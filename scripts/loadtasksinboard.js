/**
 * Asynchronously loads tasks for the user and organizes them into different categories.
 * Fetches task data from the server, initializes missing folders, and renders tasks in their respective containers.
 */
async function loadtasks() {
  /** Array to store "to-do" tasks */
  const todos = [];
  /** Array to store "in-progress" tasks */
  const inprogress = [];
  /** Array to store "awaiting feedback" tasks */
  const awaitingfeedback = [];
  /** Array to store "done" tasks */
  const donetasks = [];

  try {
    /** Fetches the task data for the user */
    const response = await fetch(GLOBAL + `users/1/tasks.json`);
    const userData = await response.json();

    /** Ensures the user data exists; initializes default structure if not */
    if (userData === null) {
      const result = await putData("users/1/tasks/todofolder", {
        todofolder: "",
      });
      if (userData === null) {
        return;
      }
    }

    /** List of folder names to check and initialize if missing */
    const folderNames = [
      "todo-folder",
      "inprogress-folder",
      "awaiting-feedback-folder",
      "done-folder",
    ];
    for (let folder of folderNames) {
      /** Initializes folder on the server if it does not exist in user data */
      if (!userData[folder]) {
        await putData(`users/1/tasks/${folder}`, {});
      }
    }

    /** Fetches updated task data after initialization */
    const updatedResponse = await fetch(GLOBAL + `users/1/tasks.json`);
    const updatedUserData = await updatedResponse.json();

    /**
     * Pushes tasks from a folder into a given array.
     * @param {object} folderData - The data of the folder containing tasks.
     * @param {Array} taskArray - The array to store the tasks.
     */
    const pushTasksFromFolder = (folderData, taskArray) => {
      if (folderData && typeof folderData === "object") {
        Object.entries(folderData).forEach(([key, task]) => {
          if (task !== null) {
            task.id = key; // Assigns the task ID
            taskArray.push(task);
          }
        });
      }
    };

    /** Processes tasks from "todo-folder" */
    if (updatedUserData["todo-folder"]) {
      pushTasksFromFolder(updatedUserData["todo-folder"], todos);
    }

    /** Processes tasks from "inprogress-folder" */
    if (updatedUserData["inprogress-folder"]) {
      pushTasksFromFolder(updatedUserData["inprogress-folder"], inprogress);
    }

    /** Processes tasks from "awaiting-feedback-folder" */
    if (updatedUserData["awaiting-feedback-folder"]) {
      pushTasksFromFolder(
        updatedUserData["awaiting-feedback-folder"],
        awaitingfeedback
      );
    }

    /** Processes tasks from "done-folder" */
    if (updatedUserData["done-folder"]) {
      pushTasksFromFolder(updatedUserData["done-folder"], donetasks);
    }

    /** Clears the content of all task containers */
    const folders = [
      "todo-folder",
      "inprogress-folder",
      "awaiting-feedback-folder",
      "done-folder",
    ];
    folders.forEach((folderId) => {
      const folderElement = document.getElementById(folderId);
      if (folderElement) folderElement.innerHTML = "";
    });

    /**
     * Displays a "no tasks" message in a folder if it is empty.
     * @param {string} folderId - The ID of the folder element.
     * @param {string} message - The message to display.
     */
    const displayNoTasksMessage = (folderId, message) => {
      const folderElement = document.getElementById(folderId);
      if (folderElement && folderElement.children.length === 0) {
        folderElement.innerHTML = `<div class='nothing'>${message}</div>`;
      }
    };

    /**
     * Renders tasks in a specified container using templates.
     * @param {Array} tasks - The tasks to render.
     * @param {string} containerId - The ID of the container element.
     */
    const renderTasksWithTemplate = async (tasks, containerId) => {
      const container = document.getElementById(containerId);
      const response2 = await fetch(GLOBAL + "users/1/contacts.json");
      const contacts = await response2.json();

      tasks.forEach(async (task) => {
        if (task && task.category) {
          const taskId = task.id;
          let taskHTML;

          /** Renders technical tasks with a specific template */
          if (task.category === "Technical Task") {
            taskHTML = await Technicaltasktemplate(
              { ...task, id: taskId },
              contacts
            );
          } else {
            /** Renders user story tasks with a specific template */
            taskHTML = await userstorytemplate(
              { ...task, id: taskId },
              contacts
            );
          }

          container.insertAdjacentHTML("beforeend", taskHTML);

          /** Makes the task draggable */
          const taskElement = document.getElementById(taskId);
          if (taskElement) {
            taskElement.setAttribute("draggable", "true");
            taskElement.addEventListener("dragstart", (event) => {
              event.dataTransfer.setData("taskId", taskId);
              event.dataTransfer.setData("parentFolderId", containerId);
            });
          }

          /** Adds a click listener to open task templates */
          document.getElementById(taskId).addEventListener("click", () => {
            if (task.category === "Technical Task") {
              opentechnicaltemplate(task, contacts);
            } else {
              openprofiletemplate(task, contacts);
            }
          });
        }
      });
    };

    /** Renders tasks in their respective containers */
    await renderTasksWithTemplate(todos, "todo-folder");
    await renderTasksWithTemplate(inprogress, "inprogress-folder");
    await renderTasksWithTemplate(awaitingfeedback, "awaiting-feedback-folder");
    await renderTasksWithTemplate(donetasks, "done-folder");

    /** Displays messages for empty task folders */
    displayNoTasksMessage("todo-folder", "No tasks to do");
    displayNoTasksMessage("inprogress-folder", "No tasks in progress");
    displayNoTasksMessage(
      "awaiting-feedback-folder",
      "No tasks awaiting feedback"
    );
    displayNoTasksMessage("done-folder", "No tasks done");
  } catch (error) {
    /** Handles errors silently */
  }
}