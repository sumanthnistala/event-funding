import {useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/esm/Button";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventGoal, setEventGoal] = useState("");
  const API_URL = "http://localhost:5000/users";
  let username = localStorage.getItem("username");
  let token = localStorage.getItem("token");

  const today = new Date();
  const tommorrow = today.setDate(today.getDate()+1);
  const minDate = new Date(tommorrow).toISOString().split("T")[0];
  const [eventDeadline, setEventDeadline] = useState(minDate);
  console.log(minDate);

  const validateForm =() =>
  {
    return eventName.length > 0 && eventDescription.length > 0 && eventGoal.length > 0 & eventGoal >0;
  }
  const onCreateEvent = async () => {
    username = "Sumanth";
    if(username === null && username === "")
    {
      alert("Username is null");
    }
    const {result}  = await axios.post(`${API_URL}/createEvent`, {eventName, eventDescription, eventGoal, eventDeadline, username},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    alert("Inserted successfully");
  };
  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <h2> Create Event</h2>
      </div>

      <div className={"divContainer"}>
        <label className={"labelContainer"}>Event Name:</label>
        <input className={"inputContainer"} 
          type="text"
          value={eventName}
          onChange={(e) => {
            setEventName(e.target.value);
          }}
        />
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>Event Description:</label>
        <textarea style={{
                    width: '290px',
                    height: '180px',
                    padding: '10px',
                }}
          value={eventDescription}
          onChange={(e) => {
            setEventDescription(e.target.value);
          }}
        />
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>Funding Goal:</label>
        <input className={"inputContainer"} 
          type="number"
          value={eventGoal}
          onChange={(e) => {
            setEventGoal(e.target.value);
          }}
        />
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>Funding Deadline:</label>
        <input className={"inputContainer"} 
          type="date"
          min={minDate}
          value={eventDeadline}
          onChange={(e) => {
            setEventDeadline(e.target.value);
          }}
        />
      </div>
      <div className={"divContainer"}>
        <button
          className={"button"}
          onClick={onCreateEvent}
        >
          Create Event
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
