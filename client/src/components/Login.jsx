import React, { useEffect, useState } from "react";
import validator from "validator";
import { socket } from "../socket/socket-client";
import ErrorModal from "./ErrorModal";
import axios from "axios";

const Login = ({ setUser, setLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [register, setRegister] = useState(false);

  const login = async () => {
    let check = validator.isEmail(email);
    if (check) {
      if (password.length < 5) {
        setErrorTitle("Error");
        setErrorMessage("Password should be at least 5 length!");
        setShowError(true);
      } else {
        let json = { email, password };
        socket.emit("login", json);
      }
    } else {
      setErrorTitle("Error");
      setErrorMessage("E-Mail is not correct!");
      setShowError(true);
    }
  };

  const createUser = async () => {
    let check = validator.isEmail(email);
    if (check) {
      if (password.length < 5) {
        setErrorTitle("Error");
        setErrorMessage("Password should be at least 5 length!");
        setShowError(true);
      } else {
        let data = { email, password };
        let result = await axios.post("http://localhost:5000/createUser", data);
        let response = result.data;
        if (response.status == 200) {
          setErrorTitle(`Success`);
          setErrorMessage(`${response.message}`);
          setShowError(true);
          setEmail('');
          setPassword('');
          setRegister(false);
        } else {
          setErrorTitle(`Error ${response.status}`);
          setErrorMessage(`${response.message}`);
          setShowError(true);
        }
      }
    } else {
      setErrorTitle("Error");
      setErrorMessage("E-Mail is not correct!");
      setShowError(true);
    }
  };

  useEffect(() => {
    socket.on("userLogedIn", (data) => {
      if (data.status === "error") {
        setErrorTitle("Error");
        setErrorMessage(data.message);
        setShowError(true);
      } else {
        setUser(data);
        setLogin(true);
      }
    });
  }, [socket]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {register ? (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-50 w-auto"
              src="images/login.png"
              alt="Login"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign Up
            </h2>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={createUser}
                >
                  Register
                </button>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
                  onClick={() => setRegister(false)}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-50 w-auto"
              src="images/login.png"
              alt="Login"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  onClick={login}
                >
                  Login
                </button>
                <button
                  type="button"
                  className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-2"
                  onClick={() => {
                    setRegister(true);
                  }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {showError && (
        <ErrorModal
          title={errorTitle}
          message={errorMessage}
          show={showError}
          setShowError={setShowError}
        />
      )}
    </div>
  );
};

export default Login;
