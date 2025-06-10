import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [authError, setAuthError] = useState("");
  const navigate = useNavigate();

 const onSubmit = async (data) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
      data
    );

    const { accessToken, message, user } = res.data; // make sure user is returned from API
    const username = user.username; // get username from response
    
    // Store JWT
    localStorage.setItem("token", accessToken);
    localStorage.setItem("username",username);
    localStorage.setItem("userid",user.id);

    toast.success(message || "Login successful");

    setAuthError("");
    navigate(`/profile/${user.id}`); // navigate dynamically to the logged-in user's profile
  } catch (err) {
    const msg = err.response?.data?.error || "Login failed";
    setAuthError(msg);
    toast.error(msg);
  }
};


  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto mt-10 p-6 border rounded shadow"
    >
      {authError && <p className="text-red-500 text-sm">{authError}</p>}

      <input
        type="text"
        placeholder="Username or Email"
        {...register("identifier", {
          required: "Username or Email is required",
        })}
        className="w-full p-2 border rounded"
      />
      {errors.identifier && (
        <p className="text-red-500 text-sm">{errors.identifier.message}</p>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
        })}
        className="w-full p-2 border rounded"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <div className="text-right">
        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline text-sm"
        >
          Forgot Password?
        </Link>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  );
};

export default Login;
