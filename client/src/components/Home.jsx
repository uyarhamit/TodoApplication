import axios from "axios";
import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket-client";

const Home = ({ user }) => {
  const [onlineUser, setOnlineUser] = useState(0);
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const addTodo = async () => {
    if (todo !== "") {
      let json = { subject: todo, users_id: user._id, status: "todo" };
      let response = await axios.post("http://localhost:5000/createTask", json);
      if (response.data.status === 200) {
        getTodos();
      }
    }
  };

  const getTodos = async () => {
    let json = { users_id: user._id };
    let response = await axios.post("http://localhost:5000/todos", json);
    if (response.data) {
      setTodoList(response.data);
    }
  };

  const deleteTodo = async (todoId) => {
    let json = { users_id: user._id, todo_id: todoId };
    let response = await axios.post("http://localhost:5000/deleteTodo", json);
    if (response.data.status === 200) {
      getTodos();
    }
  };

  useEffect(() => {
    getTodos();
  },[todoList]);

  useEffect(() => {
    socket.on("online_users", (data) => {
      setOnlineUser(data);
    });
  }, [socket,onlineUser]);

  return (
    <div className="container m-auto">
      <div className="mt-10 grid grid-cols-1 gap-y-8">
        <p>Online User: {onlineUser}</p>
        <div className="sm:col-span-3">
          <label
            htmlFor="first-name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Todo subject
          </label>
          <div className="mt-2 flex">
            <input
              value={todo}
              onChange={(e) => {
                setTodo(e.target.value);
              }}
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
            />
            <button
              type="button"
              className="rounded-md bg-green-600 px-2 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
              onClick={addTodo}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <ul role="list" className="divide-y divide-gray-100 overflow-auto">
        {todoList.map((todo) => (
          <li key={todo._id} className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <img
                className="h-10 w-10 flex-none rounded-full bg-gray-50"
                src="/images/todo.png"
                alt=""
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {user.email}
                </p>
                <p>{todo.subject}</p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="mt-1 text-xs leading-5 text-gray-500">
                {todo.createdAt}
              </p>
              <button
                type="button"
                className="mt-2 rounded-md bg-red-600 px-2 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ml-2"
                onClick={() => {
                  deleteTodo(todo._id);
                }}
              >
                Done
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
