// /* eslint-disable no-undef */
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
    // eslint-disable-next-line no-unused-vars
    static associate(models) {
      // define association here
      Todo.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }

    static addTodo({ title, dueDate, userId }) {
      if (!title) {
        throw new Error("Title is required.");
      }

      if (!dueDate) {
        throw new Error("Due date is required.");
      }

      return this.create({
        title: title,
        dueDate: dueDate,
        completed: false,
        userId,
      });
    }
    static getTodos() {
      return this.findAll();
    }

    static async overdue(userId) {
      return this.findAll({
        where: {
          completed: false,
          userId,
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0], //
          },
        },
      });
    }
    static async dueToday(userId) {
      return this.findAll({
        where: {
          completed: false,
          userId,
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }
    static async dueLater(userId) {
      return this.findAll({
        where: {
          completed: false,
          userId,
          dueDate: {
            [Op.gt]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }
    static async remove(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    setCompletionStatus(completed) {
      return this.update({ completed: completed });
    }
    static async completedItems(userId) {
      return this.findAll({
        where: {
          completed: true,
        },
        userId,
        order: [["id", "ASC"]],
      });
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
