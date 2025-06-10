import { useEffect, useState } from 'react';
import axios from 'axios';

const FollowButton = ({ profileUserId, onFollowChange, initialIsFollowing }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing || false);
  const [loading, setLoading] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  useEffect(() => {
    // Get logged in user ID once on component mount
    const userId = localStorage.getItem("userId");
    setLoggedInUserId(userId);
  }, []);

  // Update internal state if initialIsFollowing prop changes
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  if (profileUserId === loggedInUserId) return null;

  const toggleFollow = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const url = isFollowing
        ? `http://localhost:5000/api/user/${profileUserId}/unfollow`
        : `http://localhost:5000/api/user/${profileUserId}/follow`;

      await axios.post(url, {}, config);

      setIsFollowing(!isFollowing);
      if (onFollowChange) {
        await onFollowChange(); // Wait for profile refresh
      }
    } catch (error) {
      console.error('Follow/unfollow error:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleFollow}
      className={`ml-auto px-4 py-2 rounded-md font-medium transition-colors ${
        isFollowing 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-green-500 hover:bg-green-600'
      } text-white disabled:opacity-50`}
      disabled={loading}
    >
      {loading ? (
        <span className="inline-flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : isFollowing ? (
        'Unfollow'
      ) : (
        'Follow'
      )}
    </button>
  );
};

export default FollowButton;