// pages/ActivateAccount.jsx
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

const ActivateAccount = () => {
  const { token } = useParams();

  useEffect(() => {
    const activate = async () => {
      try {
        const res = await axios.post("/api/auth/activate", { token });
        alert(res.data.message);
      } catch (err) {
        alert(err.response.data.error || "Activation failed");
      }
    };
    activate();
  }, [token]);

  return <p>Activating your account...</p>;
};

export default ActivateAccount;
