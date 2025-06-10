import { useState } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();


  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-password/${token}`,{ password });

      setMessage(res.data.message);
       navigate('/login');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Reset Password</h2>
      <form onSubmit={handleReset} className="mt-4 space-y-3">
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded">Reset Password</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
