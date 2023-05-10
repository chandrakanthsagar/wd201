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
    }

    static addTodo({ title, dueDate }) {
      return this.create({ title: title, dueDate: dueDate, completed: false });
    }
    static getTodos() {
      return this.findAll();
    }

    static async overdue() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.lt]: new Date().toISOString().split("T")[0], //
          },
        },
      });
    }
    static async dueToday() {
      return this.findAll({
        where: {
          completed: false,
          dueDate: {
            [Op.eq]: new Date().toISOString().split("T")[0],
          },
        },
      });
    }
    static async dueLater() {
      return this.findAll({
        where: {
          completed: false,
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

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }
    static async completedItems() {
      return this.findAll({
        where: {
          completed: true,
        },
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
