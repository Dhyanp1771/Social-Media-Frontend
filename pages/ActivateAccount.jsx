import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ActivateAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activate = async () => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/activate",
          { token },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        console.log(res.data); // fixed typo here
        toast.success(res.data.message || "Account activated successfully");

        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        const errorMsg = err.response?.data?.error || "Activation failed";

        if (errorMsg === "Account is already activated.") {
          toast.info("Account already activated. Please log in.");
          setTimeout(() => navigate("/login"), 2000); // still redirect
        } else {
          toast.error(errorMsg);
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) activate();
  }, [token, navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-lg font-medium">
      {loading ? "Activating your account..." : "Redirecting..."}
    </div>
  );
};

export default ActivateAccount;
