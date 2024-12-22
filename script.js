// Select DOM elements
const taskInputElement = document.getElementById("task-input");
const dueDateInputElement = document.getElementById("due-date-input");
const addTaskButton = document.getElementById("add-task-btn");
const taskListElement = document.getElementById("todo-list");
const taskCountElement = document.getElementById("task-count");

function formatDueDate(date) {
  const dateOptions = { day: "numeric", month: "long", year: "numeric" };
  return new Date(date).toLocaleDateString(undefined, dateOptions);
}

function calculateTimeRemaining(dueDate) {
  const currentDate = new Date();
  const dueDateObj = new Date(dueDate);
  const timeDifference = dueDateObj - currentDate;

  if (timeDifference < 0) {
    return "Past Due";
  }

  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

  return `${daysRemaining} day${daysRemaining === 1 ? "" : "s"} remaining`;
}

function updateTaskCount() {
  const incompleteTasks = document.querySelectorAll(
    "#todo-list li:not(.completed)"
  );
  const remainingTasksCount = incompleteTasks.length;
  taskCountElement.textContent = `${remainingTasksCount} task${
    remainingTasksCount === 1 ? "" : "s"
  } remaining`;
}

function loadTasksFromStorage() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    const taskListItem = createTaskListItem(
      task.title,
      task.dueDate,
      task.isCompleted
    );
    taskListElement.appendChild(taskListItem);
  });
  updateTaskCount();
}

function createTaskListItem(taskTitle, taskDueDate, isTaskCompleted = false) {
  const taskListItem = document.createElement("li");
  if (isTaskCompleted) {
    taskListItem.classList.add("completed");
  }

  const taskContent = document.createElement("div");
  taskContent.classList.add("task-content");

  const taskTitleElement = document.createElement("span");
  taskTitleElement.textContent = taskTitle;

  const taskDueDateElement = document.createElement("span");
  taskDueDateElement.classList.add("task-due-date");
  taskDueDateElement.textContent = `Due: ${formatDueDate(taskDueDate)}`;

  const remainingTimeElement = document.createElement("span");
  remainingTimeElement.classList.add("remaining-time");
  remainingTimeElement.textContent = calculateTimeRemaining(taskDueDate);

  taskContent.appendChild(taskTitleElement);
  taskContent.appendChild(taskDueDateElement);
  taskContent.appendChild(remainingTimeElement);

  const markAsCompleteButton = document.createElement("button");
  markAsCompleteButton.textContent = "Complete";
  markAsCompleteButton.classList.add("complete");
  markAsCompleteButton.addEventListener("click", () => {
    taskListItem.classList.toggle("completed");
    updateTaskCount();
    saveTasksToStorage();
  });

  const deleteTaskButton = document.createElement("button");
  deleteTaskButton.textContent = "Delete";
  deleteTaskButton.classList.add("delete");
  deleteTaskButton.addEventListener("click", () => {
    taskListElement.removeChild(taskListItem);
    updateTaskCount();
    saveTasksToStorage();
  });

  taskListItem.appendChild(taskContent);
  taskListItem.appendChild(markAsCompleteButton);
  taskListItem.appendChild(deleteTaskButton);

  return taskListItem;
}



function saveTasksToStorage() {
  const tasks = [];
  const taskListItems = document.querySelectorAll("#todo-list li");

  taskListItems.forEach((taskListItem) => {
    const taskTitle =
      taskListItem.querySelector(".task-content span").textContent;
    const taskDueDate = taskListItem
      .querySelector(".task-due-date")
      .textContent.replace("Due: ", "");
    const isTaskCompleted = taskListItem.classList.contains("completed");

    tasks.push({
      title: taskTitle,
      dueDate: taskDueDate,
      isCompleted: isTaskCompleted,
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addNewTask() {
  const taskTitle = taskInputElement.value.trim();
  const taskDueDate = dueDateInputElement.value;

  if (taskTitle === "") {
    alert("Task cannot be empty!");
    return;
  }

  if (taskDueDate === "") {
    alert("Please add a due date!");
    return;
  }

  const taskListItem = createTaskListItem(taskTitle, taskDueDate);
  taskListElement.appendChild(taskListItem);

  taskInputElement.value = "";
  dueDateInputElement.value = "";

  saveTasksToStorage();

  updateTaskCount();
}

addTaskButton.addEventListener("click", addNewTask);

taskInputElement.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    addNewTask();
  }
});

window.onload = loadTasksFromStorage;
