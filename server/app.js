const createError = require("http-errors");
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.listen(5000, () => console.log("Running on port 5000"));

const connection = mysql.createConnection({
  host: "localhost",
  port: "3357",
  user: "test",
  password: "abcd1234",
  database: "taskmanager",
});

connection.connect(function (error) {
  if (error) {
    console.error("There was a problem connecting: " + error.stack);
    throw error;
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

/* CREATE DB */
app.get("/createdatabase", function (_req, res) {
  let sql = "CREATE DATABASE taskmanager";
  connection.query(sql, (err, _result) => {
    if (err) throw err;
    res.send("Database Connected...");
  });
});

/* CREATE TABLE */
app.get("/createtable", function (_req, res) {
  let sql =
    "CREATE TABLE tasks(id int AUTO_INCREMENT, task_id int, name VARCHAR(255), status VARCHAR(255), parentId int, children VARCHAR(255), PRIMARY KEY (id))";
  connection.query(sql, (err, _result) => {
    if (err) throw err;
    res.send("Table Created...");
  });
});

/* DELTE TABLE */
app.get("/del", function (_req, res) {
  let sql =
    "DELETE FROM tasks";
  connection.query(sql, (err, _result) => {
    if (err) throw err;
    res.send("Table Deleted...");
  });
});

/* ADD TASK */
app.post("/addtask", function (req, res) {
  const task = req.body;
  const sql = `INSERT INTO tasks (task_id, name, status, parentId, children) VALUES (${task.task_id}, '${task.name}', '${task.status}', ${task.parentId}, '${JSON.stringify(task.children)}')`;
  connection.query(sql, (err, result) => {
    console.log("err", err);
    if (err) throw err;
    res.send(result);
  });
});

/* UPDATE TASK */
app.put("/updatetask/:id", function (req, res) {
  let task = req.body;

  let sql = `UPDATE tasks 
            SET name = '${req.body.name}', status= '${req.body.status}', parentId= ${req.body.parentId}, children = '${JSON.stringify(req.body.children)}' 
            WHERE task_id = ${req.params.id}`;
  connection.query(sql, task, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send("Task Updated...");
  });
});

/* FETCH TASKS */
app.get("/gettasks", function (_req, res) {
  let sql = "SELECT * FROM tasks";
  connection.query(sql, (err, result) => {
    if (err) throw err;
    console.log(result);
    res.send(result);
  });
});

// catch 404 and forward to error handler
app.use(function (_req, _res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, _next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ err });
});

module.exports = app;
