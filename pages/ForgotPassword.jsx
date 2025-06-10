import { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    //   const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`, { email });
        const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });  
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Send Reset Link</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
