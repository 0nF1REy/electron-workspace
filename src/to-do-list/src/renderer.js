import "./index.css";

const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

const handleAddTask = async () => {
  const title = taskInput.value.trim();
  await window.api.addTask(title);
};

addTaskBtn.addEventListener("click", handleAddTask);
