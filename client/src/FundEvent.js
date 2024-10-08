import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const FundEvent = () => {
  const [amount, setAmount] = useState(0);
  const API_URL = "http://localhost:5000/blockchain";
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const location = useLocation();
  const { id } = location.state;
  const [balance, setBalance] = useState("No tokens minted in your accout. Please use Mint Token functionality.");

  useEffect(() => {
    getBalance();
  }, []);

  const getBalance = async () => {
    const balance = await axios.get(`${API_URL}/balance?username=${username}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setBalance("My Token Balance:"+balance.data);
  };

  const onFundEvent = async () => {
    let eventId = id;
    getBalance();
    if (amount > balance) {
      alert("Amount should be lesser than available balance");
      return;
    }
    const mint = await axios.post(
      `${API_URL}/transfer`,
      { username, amount, eventId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Transferred tokens with transaction hash: "+ mint.data.hash);
    getBalance();
    setAmount(0);
  };
  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
 
        <h2>Fund Event</h2>
        <h5>{balance}</h5>
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>
          Tokens:
        </label>
        <input
          className={"inputContainer"}
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
        />
      </div>
      <div className={"divContainer"}>
        <button className={"button"} onClick={onFundEvent}>
          Fund Event
        </button>
      </div>
    </div>
  );
};
export default FundEvent;
