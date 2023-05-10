/* eslint-disable no-undef */
const express = require("express");
const app = express(); // importing express vv
var csrf = require("csurf");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const path = require("path"); // importing path value
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs"); //rendering your file to application
app.use(express.static(path.join(__dirname, "public"))); //to use particual location to render all static values
app.use(cookieParser("shh! some secret string "));
app.use(csrf({ cookie: true }));
const { Todo } = require("./models");

app.get("/", async function (request, response) {
  const allTodos = await Todo.getTodos();
  const overdue = await Todo.overdue();
  const dueToday = await Todo.dueToday();
  const dueLater = await Todo.dueLater();
  const completedItems = await Todo.completedItems();
  if (request.accepts("html")) {
    response.render("index", {
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completedItems,
      csrfToken: request.csrfToken(),
    });
  } else {
    response.json({
      allTodos,
      overdue,
      dueToday,
      dueLater,
      completedItems,
    });
  }
});

app.get("/todos", async function (_request, response) {
  console.log("Processing list of all Todos ...");
  // FILL IN YOUR CODE HERE
  try {
    const todo = await Todo.findAll();
    return response.send(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  // First, we have to query our PostgerSQL database using Sequelize to get list of all Todos.
  // Then, we have to respond with all Todos, like:
  // response.send(todos)
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  console.log("creating a todo", request.body);
  try {
    // eslint-disable-next-line no-unused-vars
    const todo = await Todo.addTodo({
      title: request.body.title,
      dueDate: request.body.dueDate,
    });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id); // to get the parameter that is passed through the url
  try {
    const updatedTodo = await todo.setCompletionStatus(request.body.completed);
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  console.log("We have to delete a Todo with ID: ", request.params.id);
  // FILL IN YOUR CODE HERE
  try {
    const st = await Todo.remove(request.params.id);
    return response.json(st > 0);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});

module.exports = app;
