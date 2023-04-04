
// models/todo.js
'use strict';
const {  Model } = require('sequelize');
const { Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      // FILL IN HERE
      const OverdueItems=await Todo.overdue();
      const todolistItems=OverdueItems.map(todos => todos.displayableString()).join("\n");
      console.log(todolistItems);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const DueItemsToday=await Todo.dueToday();
      const todolistItems1=DueItemsToday.map(todos=> todos.displayableString()).join("\n");
      console.log(todolistItems1);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const DueItemsLater=await Todo.dueLater();
      const todolistItems2=DueItemsLater.map(todos=> todos.displayableString()).join("\n");
      console.log(todolistItems2);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS
      const today=new Date();
      return Todo.findAll({
        where:{
          dueDate:{
          [Op.lt]: today,
          },
         // completed : false
        },
        order:[
          ['id','ASC']
        ],
      });

    }

    static async dueToday() {
      const today=new Date();
      return Todo.findAll({
        where:{
          dueDate:{
            [Op.eq]:today,
          },
        },
        order:[
          ['id','ASC']
        ],
      });
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
    }

    static async dueLater() {
      const today=new Date();
      return Todo.findAll({
        where:{
          dueDate:{
            [Op.gt]:today,
          },
        },
        order:[
          ['id','ASC']
        ],
      });
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return Todo.update({completed: true },{
        where:{
          id:id,
        },
      });

    }

    displayableString() {
      const today=new Date().toLocaleDateString("en-CA");
      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${this.dueDate ==today ? '' : this.dueDate}`.trim();
  }
}
  Todo.init({
    title: DataTypes.STRING,
    dueDate: DataTypes.DATEONLY,
    completed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Todo',
  });
  return Todo;
};