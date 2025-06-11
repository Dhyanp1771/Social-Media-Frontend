// CommentSection.jsx
import { useState } from "react";

const CommentSection = ({ postId }) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newComment = {
      text: comment,
      postId,
      userId: "loggedInUserId", // get from auth context
      createdAt: new Date(),
    };

    // POST comment to backend
    const res = await fetch(`/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });

    const saved = await res.json();

    setComments([...comments, saved]);
    setComment("");
  };

  return (
    <div className="p-4 border-t mt-4">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
        >
          Post
        </button>
      </form>

      <div className="mt-4">
        {comments.map((c, i) => (
          <div key={i} className="border-b py-2">
            <p>{c.text}</p>
            <small className="text-gray-500">{new Date(c.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
