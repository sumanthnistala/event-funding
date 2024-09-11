import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
const EventDescription = (props) => {
  const API_URL = "http://localhost:5000/users";
  const [data, setdata] = useState({});
  const location = useLocation();
  let username = localStorage.getItem("username");
  let token = localStorage.getItem("token");
  const {id }= location.state;
  useEffect(() => {
    console.log(id);
    const getEventdata = async () => {
      const eventdata = await axios.get(`${API_URL}/eventDescription?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setdata(eventdata.data);
      console.log(eventdata.data);
    };
    getEventdata();
  }, []);
  const onDeleteEvent = async () =>
  {
    const result = await axios.get(`${API_URL}/deleteEvent?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setdata(result.data);
  }
  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <h2> Event Details</h2>
      </div>
      {data.length > 0 && (
        <>
          <div className={"divContainer"}>
            <label className={"labelContainer"}>Event Name:</label>
            <input className={"inputContainer"} type="text" value={data[0].event_title} readOnly={true} />
          </div>
          <div className={"divContainer"}>
            <label className={"labelContainer"}>Event Description:</label>
            <textarea style={{
                    width: '290px',
                    height: '180px',
                    padding: '10px',
                }}value={data[0].event_description} readOnly={true} />
          </div>
          <div className={"divContainer"}>
            <label className={"labelContainer"}>Funding Goal:</label>
            <input className={"inputContainer"} type="text" value={data[0].funding_goal} readOnly={true} />
          </div>
          <div className={"divContainer"}>
            <label className={"labelContainer"}>Funding Deadline:</label>
            <input className={"inputContainer"} type="text" value={data[0].event_deadline} readOnly={true} />
          </div>
          <div className={"divContainer"}>
            <label className={"labelContainer"}>Event Creator:</label>
            <input className={"inputContainer"} type="text" value={data[0].creatorId} readOnly={true} />
          </div>
          <div className={"divContainer"}>
            <label className={"labelContainer"}>Funds Raised:</label>
            <input className={"inputContainer"} type="text" value={data[0].funds_raised} readOnly={true} />
          </div>

          <div className="{divContainer}">
          <button className={"button"} onClick={onDeleteEvent} >
            Delete Event
          </button>
          </div>
        </>
      )}
    </div>
  );
};
export default EventDescription;
