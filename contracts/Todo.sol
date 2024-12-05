// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IErrors.sol";

contract ToDoEngine {
  address public owner;

  struct Todo {
    string title;
    string description;
    bool completed;
    //uint256 timestampCreated;
    //uint256 timestampDeadline;
  }

  Todo[] todos;

  modifier onlyOwner() {
    require(owner == msg.sender, IErrors.NotAnOwner());
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function addTodo(string calldata _title, string calldata _description) external onlyOwner {
    todos.push(Todo({title: _title, description: _description, completed: false}));
  }

  function changeTodoTitle(string calldata _newTitle, uint256 index) external onlyOwner {
    todos[index].title = _newTitle;
  }

  function getTodo(uint256 index) external view onlyOwner returns(string memory, string memory, bool) {
    Todo storage myTodo = todos[index];
    return (myTodo.title, myTodo.description, myTodo.completed);
  }

  function changeTodoStatus(uint256 index) external onlyOwner {
    todos[index].completed = !todos[index].completed;
  }
}