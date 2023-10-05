import { useState } from 'react';
import './App.css';
import Login from "./components/Login";
import Home from './components/Home';
function App() {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState({});
  return (
    <div className='container-lg'>
      {(login)
        ?
        <Home user={user} />
        :
        <Login setUser={setUser} setLogin={setLogin} />
      }
    </div>
  );
}

export default App;
