import "./App.css";
import Login from "./Login";
import Events from "./Events";
import CreateEvent from "./CreateEvent";
import EventDescription from "./EventDescription";
import Register from "./Register";
import FundEvent from "./FundEvent";
import DeleteEvent from "./DeleteEvent";
import Dashboard from "./Dashboard";
import MintToken from "./MintToken";
import Navbar from "./Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
function App() {
  let isLogged = localStorage.getItem("username");

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
        {isLogged !== null && isLogged !== "" && (
          <>
            <Navbar />
            <Routes>
              <Route path="/Events" element={<Events />} />
              <Route path="/CreateEvent" element={<CreateEvent />} />
              <Route path="/FundEvent" element={<FundEvent />} />
              <Route path="/EventDescription" element={<EventDescription />} />
              <Route path="/DeleteEvent" element={<DeleteEvent />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/MintToken" element={<MintToken />} />
            </Routes>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
