const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const DATA_PATH = path.join(__dirname, "data", "tasks.json");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

function loadTasks() {
  try {
    const data = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(tasks, null, 2));
}

app.get("/api/tasks", (req, res) => {
  res.json(loadTasks());
});

app.post("/api/tasks", (req, res) => {
  const { text, date } = req.body;
  if (!text || !date) return res.status(400).json({ error: "Task and date required" });

  const tasks = loadTasks();
  tasks.push({ text, date, completed: false });
  saveTasks(tasks);
  res.json({ success: true });
});

app.put("/api/tasks/:index/toggle", (req, res) => {
  const tasks = loadTasks();
  const index = parseInt(req.params.index);
  if (!tasks[index]) return res.status(404).json({ error: "Not found" });

  tasks[index].completed = !tasks[index].completed;
  saveTasks(tasks);
  res.json({ success: true });
});

app.delete("/api/tasks/:index", (req, res) => {
  const tasks = loadTasks();
  const index = parseInt(req.params.index);
  if (!tasks[index]) return res.status(404).json({ error: "Not found" });

  tasks.splice(index, 1);
  saveTasks(tasks);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
