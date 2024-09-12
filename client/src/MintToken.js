import axios from "axios";
import { useState, useEffect } from "react";

const MintToken = () => {
  const [amount, setAmount] = useState(0);
  const API_URL = "http://localhost:5000/blockchain";
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const [balance, setBalance] = useState();
  useEffect(() => {
    getBalance();
  }, []);
  const getBalance = async () => {
    const balance = await axios.get(`${API_URL}/balance?username=${username}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setBalance("My Token balance is: "+balance.data);
  };

  const onMint = async () => {
    const mint = await axios.post(
      `${API_URL}/mint`,
      { username, amount },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Minted tokens with transaction hash: " + mint.data.hash);

    getBalance();
  };
  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <h2>Mint Token</h2>
        <h5>{balance}</h5>
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>Amount in Tokens</label>

        <input
          className={"inputContainer"}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className={"button"}
          onClick={onMint}
        >
          Mint
        </button>
      </div>
    </div>
  );
};

export default MintToken;
