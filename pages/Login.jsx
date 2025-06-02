// pages/Login.jsx
import { useState } from "react";
import axios from "axios";

const Login = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", credentials, { withCredentials: true });
      setUser(res.data.user); // set global user state
      alert("Login successful");
    } catch (err) {
      alert(err.response.data.error || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Input fields for email and password */}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
