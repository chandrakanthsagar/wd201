/* eslint-disable no-undef */
const express = require("express");
const app = express(); // importing express value

const bodyParser = require("body-parser");
const path = require("path"); // importing path value
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

app.set("view engine", "ejs"); //rendering your file to application
app.use(express.static(path.join(__dirname, "public"))); //to use particual location to render all static values

const { Todo } = require("./models");

app.get("/", async (request, response) => {
   const overdue = await Todo.overdue();
   const dueToday = await Todo.dueToday();
   const dueLater = await Todo.dueLater();
   response.render("index",{
    title : "Todo application",
    overdue,
    dueToday,
    dueLater,
   });

   
    
   
   
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
  try {
    
    
    const todo = await Todo.addTodo({
      title:request.body.title,
      dueDate:request.body.dueDate,
    });
    
    

    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  const todo = await Todo.findByPk(request.params.id);
  try {
    const updatedTodo = await todo.markAsCompleted();
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
    const cd = await Todo.destroy({
      where: {
        id: request.params.id,
      },
    });
    response.send(cd > 0);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
  // First, we have to query our database to delete a Todo by ID.
  // Then, we have to respond back with true/false based on whether the Todo was deleted or not.
  // response.send(true)
});
app.get("/todos", async (request, response) => {
  const todoItems = await Todo.gettodo();
  response.json(todoItems);
});
module.exports = app;
