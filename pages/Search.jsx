import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const searchUsers = useCallback(
    debounce(async (text) => {
      try {
        const res = await axios.get(`http://localhost:5000/api/user/search?q=${text}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setResults(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      }
    }, 400),
    []
  );

  useEffect(() => {
    if (query.trim()) searchUsers(query);
    else setResults([]);
  }, [query, searchUsers]);

  const currentUserId = localStorage.getItem("userId");

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <div className="mt-2 space-y-2">
        {results.length === 0 && query && (
          <p className="text-sm text-gray-500">No users found.</p>
        )}

        {results.map((user) => (
          <div
            key={user.id}
            className="flex items-center gap-3 border p-2 rounded cursor-pointer hover:bg-gray-100"
          >
            <div
              className="flex items-center gap-3 flex-grow"
              onClick={() => navigate(`/profile/${user.id}`)}
            >
              <img
                src={user.avatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <span>{user.username}</span>
            </div>
            {user.id !== currentUserId && <FollowButton profileUserId={user.id} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
