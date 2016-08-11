var uuid = require('uuid');
// Our list of todos
var todos = [];

function findIndex(list, fn) {
  for (var i = 0, len = list.length; i < len; i++) {
    if (fn(list[i])) {
      return i;
    }
  }
  return -1;
}

function cloneTodo(todo) {
  return {
    id: todo.id,
    text: todo.text,
    completed: todo.completed,
    createdOn: todo.createdOn
  }
}

// Create, retrieve, update, and delete todos.
var Fns = {
  create: function (text) {
    var item = {
      id: uuid(),
      text: text,
      completed: false,
      createdOn: new Date()
    }
    todos.push(item);
    return item.id;
  },
  getById: function (id) {
    var idx = findIndex(todos, function (v) {
      return v.id === id;
    });
    if (idx > -1) {
      return cloneTodo(todos[idx]);
    }
    return null;
  },
  getAll: function () {
    // Shortcut to clone an array.
    return todos.slice(0);
  },
  updateCompleted: function (id, completed) {
    var idx = findIndex(todos, function (v) {
      return v.id === id;
    });
    if (idx > -1) {
      todos[idx].completed = completed;
      return 1;
    }
    return 0;
  },
  destroy: function (id) {
    todos = todos.filter(function (v) {
      return v.id !== id;
    });
    return null;
  }
};

module.exports = Fns;
