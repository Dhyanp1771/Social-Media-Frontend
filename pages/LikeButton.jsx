import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const LikeButton = ({ postId, initialLiked, onLikeChange }) => {
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${postId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLiked(data.liked);
      if (onLikeChange) onLikeChange(data.liked);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.warning("You must follow the user to like this post");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <button onClick={handleLike} className="text-red-500 text-xl">
      {liked ? <AiFillHeart /> : <AiOutlineHeart />}
    </button>
  );
};

export default LikeButton;
