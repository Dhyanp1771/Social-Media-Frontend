// pages/Register.jsx
import { useForm } from "react-hook-form";
import axios from "axios";

const Register = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
    const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, data);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-md mx-auto mt-10 p-6 border rounded shadow"
    >
      <input
        type="text"
        placeholder="Username"
        {...register("username", {
          required: "Username is required",
          pattern: {
            value: /^[a-zA-Z0-9]+$/,
            message: "Username must be alphanumeric",
          },
        })}
        className="w-full p-2 border rounded"
      />
      {errors.username && (
        <p className="text-red-500 text-sm">{errors.username.message}</p>
      )}

      <input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Invalid email format",
          },
        })}
        className="w-full p-2 border rounded"
      />
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <input
        type="password"
        placeholder="Password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/,
            message:
              "Password must include uppercase, lowercase, number, and symbol",
          },
        })}
        className="w-full p-2 border rounded"
      />
      {errors.password && (
        <p className="text-red-500 text-sm">{errors.password.message}</p>
      )}

      <input
        type="password"
        placeholder="Confirm Password"
        {...register("confirmPassword", {
          required: "Confirm Password is required",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
        className="w-full p-2 border rounded"
      />
      {errors.confirmPassword && (
        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>
    </form>
  );
};

export default Register;
