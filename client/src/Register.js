import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState("");
  const API_URL = "http://localhost:5000/users";
  const navigate = useNavigate();
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const onRegister = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/register`, {
        username,
        password,
        amount
      });
      
      if (data.token !== null && data.token !== "")
      {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        localStorage.setItem("username", username);
        navigate("/Events");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className={"mainContainer"}>
      <div className={"titleContainer"}>
        <h2>Register</h2>
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>UserName</label>

        <input
          className="{inputContainer}"
          autoFocus
          type="text"
          value={username}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>Password</label>

        <input
          className={"inputContainer"}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className={"divContainer"}>
        <label className={"labelContainer"}>Amount in Tokens</label>

        <input
          className={"inputContainer"}
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <button
          className={"button"}
          onClick={onRegister}
          disabled={!validateForm()}
        >
          Register
        </button>
      </div>
    </div>
  );
};

export default Register;
