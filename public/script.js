const form = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskList = document.getElementById("taskList");
const themeSwitcher = document.getElementById("themeSwitcher");

let taskFilter = localStorage.getItem("taskFilter") || "all";

function setFilter(type) {
    taskFilter = type;
    localStorage.setItem("taskFilter", type); // Save it
    document.querySelectorAll(".filter-buttons button").forEach(btn => {
      btn.classList.remove("active");
    });
    document.querySelector(`.filter-buttons button[onclick="setFilter('${type}')"]`).classList.add("active");
    loadTasks();
  }
  

//let taskFilter = "all"; // "all", "completed", "pending"

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  const date = taskDate.value;

  if (!text || !date) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, date })
  });

  taskInput.value = "";
  taskDate.value = "";
  loadTasks();
});

function setFilter(type) {
  taskFilter = type;
  document.querySelectorAll(".filter-buttons button").forEach(btn => {
    btn.classList.remove("active");
  });
  document.querySelector(`.filter-buttons button[onclick="setFilter('${type}')"]`).classList.add("active");
  loadTasks();
}

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const tasks = await res.json();
  taskList.innerHTML = "";

  const grouped = {};
  tasks.forEach((task, i) => {
    if (!grouped[task.date]) grouped[task.date] = [];
    grouped[task.date].push({ ...task, index: i });
  });

  const sortedDates = Object.keys(grouped).sort();

  sortedDates.forEach(date => {
    const section = document.createElement("div");
    section.classList.add("date-section");

    const heading = document.createElement("h3");
    heading.textContent = new Date(date).toDateString();
    section.appendChild(heading);

    grouped[date].forEach(task => {
      if (
        taskFilter === "completed" && !task.completed ||
        taskFilter === "pending" && task.completed
      ) return;

      const div = document.createElement("div");
      div.className = "task fade-in";
      if (task.completed) div.style.opacity = "0.6";

      div.innerHTML = `
        <span>${task.text}</span>
        <div>
          <button onclick="toggle(${task.index})">✔</button>
          <button onclick="del(${task.index})">🗑️</button>
        </div>
      `;

      section.appendChild(div);

      setTimeout(() => div.classList.add("fade-in"), 10); // Animate
    });

    taskList.appendChild(section);
  });
}

async function toggle(index) {
  await fetch(`/api/tasks/${index}/toggle`, { method: "PUT" });
  loadTasks();
}

async function del(index) {
  await fetch(`/api/tasks/${index}`, { method: "DELETE" });
  loadTasks();
}

loadTasks();

// Theme Load/Save
themeSwitcher.addEventListener("change", () => {
    document.body.classList.toggle("dark", themeSwitcher.checked);
    localStorage.setItem("darkMode", themeSwitcher.checked);
  });
  
  window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", savedTheme);
    themeSwitcher.checked = savedTheme;
  
    setFilter(taskFilter); // Load filter state
  });
  
