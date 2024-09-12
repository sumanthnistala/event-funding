import axios from "axios";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const API_URL = "http://localhost:5000/users";
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  let token = localStorage.getItem("token");
  useEffect(() => {
    const getEventdata = async () => {
      setLoading(true);
      const eventData = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (eventData?.data) {
        setData(eventData.data);
      }
      setLoading(true);
    };
    getEventdata();
  }, []);

  return (
    <div className="mainContainer">
      <div className={"titleContainer"}>
        <h2>Event Dashboard</h2>
      </div>
      {data !== null && data.length >= 1 && loading && (
        <>
          <div className={"divContainer"}>
            <label className={"labelHeaderContainer"}>Title</label>
            <label className={"labelHeaderContainer"}>Description</label>
            <label className={"labelHeaderContainer"}>Funds Raised</label>
          </div>
          {data?.map((elem) => (
            <>
              <div className={"divContainer"}>
                <label className={"labelContainer"}>{elem.event_title}</label>
                <label className={"labelContainer"}>
                  {elem.event_description}
                </label>
                <label className={"labelContainer"}>{elem.funds_raised}</label>
              </div>
            </>
          ))}
        </>
      )}
    </div>
  );
};

export default Dashboard;
