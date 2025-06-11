import { useState,useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';

const LikeButton = ({ postId, initialLiked, initialCount, onLikeChange }) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialCount || 0);

useEffect(() => {
    setLiked(initialLiked);
    setLikeCount(initialCount || 0);
  }, [initialLiked, initialCount]);

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
      
      const newLiked = data.liked;
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1);

      
      setLiked(newLiked);
      setLikeCount(newCount);
      
      // Update parent component with postId, liked status, and count
      if (onLikeChange) {
        onLikeChange(postId, newLiked, newCount);
      }
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
    <div className="flex items-center gap-1">
      <button onClick={handleLike} className="text-red-500 text-xl hover:scale-110 transition-transform">
        {liked ? <AiFillHeart /> : <AiOutlineHeart />}
      </button>
      <span className="text-sm text-gray-600 font-medium">{likeCount}</span>
    </div>
  );
};

export default LikeButton;
