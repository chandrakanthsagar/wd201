/* eslint-disable no-undef */
const todoList = () => {
  all = [];
  const add = (todoItem) => {
    all.push(todoItem);
  };
  const markAsComplete = (index) => {
    all[index].completed = true;
  };

  const overdue = () => {
    return all.filter(
      (todo1) => todo1.dueDate < new Date().toLocaleDateString("en-CA")
    );
  };

  const dueToday = () => {
    return all.filter(
      (todo1) => new Date().toLocaleDateString("en-CA") == todo1.dueDate
    );
  };

  const dueLater = () => {
    return all.filter(
      (todo1) => new Date().toLocaleDateString("en-CA") < todo1.dueDate
    );
  };

  const toDisplayableList = (list) => {
    return list
      .map(
        (todo1) =>
          `${todo1.completed ? `[x]` : `[ ]`} ${todo1.title} ${
            todo1.dueDate != today ? todo1.dueDate : " "
          }`
      )
      .join("\n");
  };

  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater,
    toDisplayableList,
  };
};

module.exports = todoList;
