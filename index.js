const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

let tasks = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("home", { tasks });
});

app.post("/add", (req, res) => {
    const task = req.body.task;
    if (task.trim() !== "") {
        tasks.push(task);
    }
    res.redirect("/");
});

app.listen(port, () => {
    console.log(`To-Do App running at http://localhost:${port}`);
});
