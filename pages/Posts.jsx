import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LikeButton from './LikeButton';
import Search from './Search';
import { toast } from 'react-toastify';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [commentContent, setCommentContent] = useState({});

  useEffect(() => {
    const userId = localStorage.getItem('userid');
    setLoggedInUserId(userId);
    fetchPosts();
  }, []);

  const fetchPostLikes = async (postId, token) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/posts/${postId}/likes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return {
        likes: data.likes || [],
        count: data.count || 0,
      };
    } catch (error) {
      console.error(`Failed to fetch likes for post ${postId}:`, error);
      return { likes: [], count: 0 };
    }
  };

  const fetchPostComments = async (postId, token) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data || [];
    } catch (error) {
      console.error(`Failed to fetch comments for post ${postId}:`, error);
      toast.error('Failed to load comments');
      return [];
    }
  };

  const fetchPosts = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userid') || '';
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API response:', data);

      if (!Array.isArray(data)) {
        console.error('API response is not an array:', data);
        setPosts([]);
        return;
      }

      const filteredPosts = await Promise.all(
        data
          .filter(post => post && post.authorId && post.authorId !== userId)
          .map(async post => {
            const likeData = await fetchPostLikes(post.id, token);
            return {
              ...post,
              isLiked: likeData.likes.some(like => like && like.userId === userId) || false,
              _count: {
                likes: likeData.count,
                comments: post._count?.comments || 0,
              },
              user: {
                id: post.author?.id || post.authorId,
                username: post.author?.username || 'Unknown User',
                avatar: post.author?.avatar || '/default-avatar.png',
              },
              comments: [], // Initialize empty comments (fetched on-demand)
            };
          })
      );

      setPosts(filteredPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLikeChange = (postId, isLiked, newCount) => {
    console.log('Like change:', { postId, isLiked, newCount });
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked,
              _count: { ...post._count, likes: newCount },
            }
          : post
      )
    );
  };

  const handleCommentToggle = async (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    if (!showComments[postId]) {
      const token = localStorage.getItem('token');
      const comments = await fetchPostComments(postId, token);
      setPosts(prev =>
        prev.map(post =>
          post.id === postId ? { ...post, comments } : post
        )
      );
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentContent(prev => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const token = localStorage.getItem('token');
    const content = commentContent[postId]?.trim();
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

      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), data],
                _count: { ...post._count, comments: (post._count.comments || 0) + 1 },
              }
            : post
        )
      );
      setCommentContent(prev => ({ ...prev, [postId]: '' }));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-24 w-24 rounded-full bg-gray-200 mb-4"></div>
          <div className="h-6 w-48 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My App</h1>
          <Search />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-center mb-6">
            <h3 className="text-sm font-semibold text-gray-800 border-b-2 border-gray-800 pb-1 px-4">
              OTHER POSTS
            </h3>
          </div>

          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => navigate(`/profile/${post.user.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={post.user.avatar}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{post.user.username}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {post.content && (
                    <div className="px-4 pb-3">
                      <p className="text-gray-800">{post.content}</p>
                    </div>
                  )}

                  {post.image?.length > 0 && (
                    <div className="w-full">
                      <img
                        src={post.image[0]}
                        alt="post"
                        className="w-full h-auto max-h-96 object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <LikeButton
                          postId={post.id}
                          initialLiked={post.isLiked}
                          initialCount={post._count?.likes || 0}
                          onLikeChange={handleLikeChange}
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCommentToggle(post.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </button>
                          <span className="text-sm text-gray-600">{post._count?.comments || 0}</span>
                        </div>
                      </div>
                      <button className="text-gray-500 hover:text-gray-700">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                          />
                        </svg>
                      </button>
                    </div>

                    {showComments[post.id] && (
                      <div className="p-4 border-t border-gray-100">
                        <div className="mb-4">
                          <textarea
                            value={commentContent[post.id] || ''}
                            onChange={e => handleCommentChange(post.id, e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full p-2 border rounded-md text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            rows={2}
                          />
                          <button
                            onClick={() => handleCommentSubmit(post.id)}
                            className="mt-2 px-4 py-1 bg-gray-800 text-white rounded-md hover:bg-gray-700 text-sm"
                          >
                            Post Comment
                          </button>
                        </div>
                        {post.comments?.length > 0 ? (
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {post.comments.map(comment => (
                              <div key={comment.id} className="flex items-start gap-2">
                                <img
                                  src={comment.author.avatar || '/default-avatar.png'}
                                  alt={comment.author.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <div>
                                  <p className="text-sm font-semibold text-gray-800">
                                    {comment.author.username}
                                  </p>
                                  <p className="text-sm text-gray-600">{comment.content}</p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No comments yet</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">No Posts Available</h4>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                There are no posts from other users to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;