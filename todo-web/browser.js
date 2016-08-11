var todos = require('todo-api');
var mainEl = document.getElementById('main');

// Setup some data
var milkId = todos.data.create('Pickup milk.');
var eggsId = todos.data.create('Pickup eggs.');
var mowId = todos.data.create('Mow the lawn.');
var worldId = todos.data.create('Try and take over the world.');

// Mark a todo as completed
todos.data.updateCompleted(mowId, true);

function renderTodos(state) {
  var todoHtml = '<ul>';
  if (state.todos && state.todos.length) {
    state.todos.forEach(function (item) {
      var color = item.completed ? 'green' : 'red';
      todoHtml += '<li style="color: ' + color + '">' + item.text + '</li>';
    });
  }
  todoHtml += '</ul>';
  mainEl.innerHTML = todoHtml;
}

renderTodos({
  todos: todos.data.getAll() 
});
