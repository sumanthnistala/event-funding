import logo from "./logo.svg";
import "./App.css";
import Login from "./Login";
import Home from "./Register";
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import EventDescription from "./EventDescription";
import Register from "./Register";
import FundEvent from "./FundEvent";
import DeleteEvent from './DeleteEvent';
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUserName] = useState("");
  let isLogged = localStorage.getItem("username");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Login setLoggedIn={setLoggedIn} setUserName={setUserName} />
            }
          />
          <Route path="/Register" element={<Register />} />
          </Routes>
          {isLogged !== null && isLogged !== "" && (
            <>
            <Navbar/>
            <Routes>
              <Route path="/Events" element={<Events />} />
              <Route
                path="/CreateEvent"
                element={
                  <CreateEvent
                    setLoggedIn={setLoggedIn}
                    setUserName={setUserName}
                  />
                }
              />
              <Route path="/FundEvent" element={<FundEvent />}/>
              <Route path="/EventDescription" element={<EventDescription />} />
              <Route path="/DeleteEvent" element={<DeleteEvent />} />
              <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
        </>
          )}

      </BrowserRouter>
    </div>
  );
}

export default App;
