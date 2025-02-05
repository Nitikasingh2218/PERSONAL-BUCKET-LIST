const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

// Load tasks from localStorage when the page is loaded
document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
  const task = inputBox.value.trim();
  if (!task) {
    alert("Please write down a task");
    return;
  }

  // Create the new task object
  const taskObj = {
    text: task,
    completed: false
  };

  // Create the list item (li) and append it
  const li = createTaskElement(taskObj);
  listContainer.appendChild(li);
  inputBox.value = ""; // Clear the input box

  // Add the new task to localStorage
  saveTasksToLocalStorage();
}

// Function to create the task element and return it
function createTaskElement(taskObj) {
  const li = document.createElement("li");

  // Create the HTML structure for the task
  li.innerHTML = `
    <label>
      <input type="checkbox" ${taskObj.completed ? "checked" : ""}>
      <span>${taskObj.text}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
  `;



  const checkbox = li.querySelector("input");
  const editBtn = li.querySelector(".edit-btn");
  const taskSpan = li.querySelector("span");
  const deleteBtn = li.querySelector(".delete-btn");

  // If the task is completed, add the 'completed' class
  if (taskObj.completed) {
    li.classList.add("completed");
  }

  // Toggle completed class when checkbox is clicked
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    taskObj.completed = checkbox.checked;
    updateCounters();
    saveTasksToLocalStorage(); // Save to localStorage when state changes
  });

  // Edit task functionality
  editBtn.addEventListener("click", function () {
    const update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskObj.text = update;
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
      saveTasksToLocalStorage(); // Save to localStorage after editing
    }
  });

  // Delete task functionality
  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      removeTaskFromLocalStorage(taskObj); // Remove from localStorage after deletion
      updateCounters();
    }
  });

  return li;
}

// Update task counters
function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
  const tasks = [];
  document.querySelectorAll("li").forEach((li) => {
    const checkbox = li.querySelector("input");
    const taskText = li.querySelector("span").textContent;
    tasks.push({
      text: taskText,
      completed: checkbox.checked
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskObj) => {
    const li = createTaskElement(taskObj);
    listContainer.appendChild(li);
  });
  updateCounters();
}

// Remove task from localStorage
function removeTaskFromLocalStorage(taskObj) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const updatedTasks = tasks.filter(
    (task) => task.text !== taskObj.text || task.completed !== taskObj.completed
  );
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}
