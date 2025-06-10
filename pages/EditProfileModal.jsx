import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProfileModal = ({ profile, onClose }) => {
  const [formData, setFormData] = useState({ username: profile.username, bio: profile.bio });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(profile.avatar);
  const [loading, setLoading] = useState(false);
  

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('username', formData.username);
    data.append('bio', formData.bio);
    if (avatar) data.append('avatar', avatar);


    try {
      await axios.put(`http://localhost:5000/api/user/profile`, data, {
        headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                  },
});

      alert('Profile updated!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md space-y-4">
        <h2 className="text-xl font-bold">Edit Profile</h2>
        <input name="username" value={formData.username} onChange={handleChange} className="border p-2 w-full" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} className="border p-2 w-full" />
        <input type="file" onChange={handleAvatarChange} />
        {preview && <img src={preview} className="w-20 h-20 rounded-full mt-2" />}
        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="bg-blue-500 text-white px-4 py-1 rounded">
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button onClick={onClose} type="button" className="bg-gray-300 px-4 py-1 rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileModal;
