import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const API_URL = "http://localhost:5000/users";
  const navigate = useNavigate();
  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  const onLogin = async () => {
    try {
      const { data } = await axios.post(`${API_URL}/Login`, {
        username,
        password,
      });
      console.log("token::"+data.token);
      if (data.token !== null && data.token !== "") {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        console.log("Token: " + token);
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
        <h2>Login</h2>
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
      <div className={"buttonContainer"}>
        <button
          onClick={onLogin}
          className={"button"}
          disabled={!validateForm()}
        >
          Login
        </button>
        <button
          onClick={() => {
            navigate("/Register");
          }}
          className={"button"}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
