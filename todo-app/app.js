const {request,response}=require('express')
const express = require('express');
const app = express();
const bodyparser=require('body-parser')
app.use(bodyparser.json())
const{Todo}=require("./models")
app.get('/todos', (request, response) =>{
   console.log("Todo list")
  })
  app.post('/todos',async (request, response)=> {
    console.log("Creating a todo",request.body)
    try {
      const todo = await Todo.create({
        title:request.body.title,dueDate:request.body.dueDate,complted :false})
      
        return response.json(todo)
    
    } catch (error) {
      return response.status(422).json(error)
    }
   })
  app.listen(3000)
