// models/todo.js
"use strict";
const { Model } = require("sequelize");
const { Op } = require("sequelize");

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
      const OverdueItems = await Todo.overdue();
      const todolistItems = OverdueItems.map((todos) =>
        todos.displayableString()
      ).join("\n");
      console.log(todolistItems);
      console.log("\n");

      console.log("Due Today");
      // FILL IN HERE
      const DueItemsToday = await Todo.dueToday();
      const todolistItems1 = DueItemsToday.map((todos) =>
        todos.displayableString()
      ).join("\n");
      console.log(todolistItems1);
      console.log("\n");

      console.log("Due Later");
      // FILL IN HERE
      const DueItemsLater = await Todo.dueLater();
      const todolistItems2 = DueItemsLater.map((todos) =>
        todos.displayableString()
      ).join("\n");
      console.log(todolistItems2);
    }

    static async overdue() {
      // FILL IN HERE TO RETURN OVERDUE ITEMS

      return Todo.findAll({
        where: {
          dueDate: {
            [Op.lt]: new Date(),
          },
          // completed : false
        },
        order: [["id", "ASC"]],
      });
    }

    static async dueToday() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.eq]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
      // FILL IN HERE TO RETURN ITEMS DUE tODAY
    }

    static async dueLater() {
      return Todo.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
        },
        order: [["id", "ASC"]],
      });
      // FILL IN HERE TO RETURN ITEMS DUE LATER
    }

    static async markAsComplete(id) {
      // FILL IN HERE TO MARK AN ITEM AS COMPLETE
      return Todo.update(
        { completed: true },
        {
          where: {
            id: id,
          },
        }
      );
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let displayDate =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : this.dueDate;
      return `${this.id}. ${checkbox} ${this.title} ${displayDate}`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
