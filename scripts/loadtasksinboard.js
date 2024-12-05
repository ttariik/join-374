async function loadtasks() {
  const todos = [];
  const inprogress = [];
  const awaitingfeedback = [];
  const donetasks = [];

  try {
    const response = await fetch(GLOBAL + `users/1/tasks.json`);
    const userData = await response.json();

    if (userData === null) {
      const result = await putData("users/1/tasks/todofolder", {
        todofolder: "",
      });
      if (userData === null) {
        return;
      }
    }
    const folderNames = [
      "todo-folder",
      "inprogress-folder",
      "awaiting-feedback-folder",
      "done-folder",
    ];
    for (let folder of folderNames) {
      if (!userData[folder]) {
        await putData(`users/1/tasks/${folder}`, {});
      }
    }
    const updatedResponse = await fetch(GLOBAL + `users/1/tasks.json`);
    const updatedUserData = await updatedResponse.json();
    const pushTasksFromFolder = (folderData, taskArray) => {
      if (folderData && typeof folderData === "object") {
        Object.entries(folderData).forEach(([key, task]) => {
          if (task !== null) {
            task.id = key;
            taskArray.push(task);
          }
        });
      }
    };

    if (updatedUserData["todo-folder"]) {
      pushTasksFromFolder(updatedUserData["todo-folder"], todos);
    }

    if (updatedUserData["inprogress-folder"]) {
      pushTasksFromFolder(updatedUserData["inprogress-folder"], inprogress);
    }

    if (updatedUserData["awaiting-feedback-folder"]) {
      pushTasksFromFolder(
        updatedUserData["awaiting-feedback-folder"],
        awaitingfeedback
      );
    }

    if (updatedUserData["done-folder"]) {
      pushTasksFromFolder(updatedUserData["done-folder"], donetasks);
    }

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

    const displayNoTasksMessage = (folderId, message) => {
      const folderElement = document.getElementById(folderId);
      if (folderElement && folderElement.children.length === 0) {
        folderElement.innerHTML = `<div class='nothing'>${message}</div>`;
      }
    };

    const renderTasksWithTemplate = async (tasks, containerId) => {
      const container = document.getElementById(containerId);
      const response2 = await fetch(GLOBAL + "users/1/contacts.json");
      const contacts = await response2.json();
      tasks.forEach(async (task) => {
        if (task && task.category) {
          const taskId = task.id;
          let taskHTML;

          if (task.category === "Technical Task") {
            taskHTML = await Technicaltasktemplate(
              { ...task, id: taskId },
              contacts
            );
          } else {
            taskHTML = await userstorytemplate(
              { ...task, id: taskId },
              contacts
            );
          }

          container.insertAdjacentHTML("beforeend", taskHTML);

          const taskElement = document.getElementById(taskId);
          if (taskElement) {
            taskElement.setAttribute("draggable", "true");
            taskElement.addEventListener("dragstart", (event) => {
              event.dataTransfer.setData("taskId", taskId);
              event.dataTransfer.setData("parentFolderId", containerId);
            });
          }

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

    await renderTasksWithTemplate(todos, "todo-folder");
    await renderTasksWithTemplate(inprogress, "inprogress-folder");
    await renderTasksWithTemplate(awaitingfeedback, "awaiting-feedback-folder");
    await renderTasksWithTemplate(donetasks, "done-folder");

    displayNoTasksMessage("todo-folder", "No tasks to do");
    displayNoTasksMessage("inprogress-folder", "No tasks in progress");
    displayNoTasksMessage(
      "awaiting-feedback-folder",
      "No tasks awaiting feedback"
    );
    displayNoTasksMessage("done-folder", "No tasks done");
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}
