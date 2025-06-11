import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const CommentSection = ({ postId, comments, setComments, incrementCommentCount }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const content = comment.trim();

    if (!token) {
      toast.error('Please log in to comment');
      return;
    }
    if (!content) {
      toast.warning('Comment cannot be empty');
      return;
    }

    try {
      const { data } = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([...comments, data]);
      setComment('');
      incrementCommentCount(postId); // Update count in parent
      toast.success('Comment added');
    } catch (error) {
      console.error('Comment submit error:', error);
      if (error.response?.status === 403) {
        toast.warning('You must follow the user to comment');
      } else {
        toast.error('Failed to add comment');
      }
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 mt-4">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
          rows={2}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm"
        >
          Post Comment
        </button>
      </form>

      <div className="mt-4 space-y-2 max-h-48 overflow-y-auto">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2 border-b py-2">
              <img
                src={c.author.avatar || '/default-avatar.png'}
                alt={c.author.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-gray-800">{c.author.username}</p>
                <p className="text-sm text-gray-600">{c.content}</p>
                <p className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No comments yet</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection;