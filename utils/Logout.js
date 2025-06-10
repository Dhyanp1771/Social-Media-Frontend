import axios from 'axios';

export const logout = async () => {
  await axios.post('/api/auth/logout', {}, { withCredentials: true });
};
