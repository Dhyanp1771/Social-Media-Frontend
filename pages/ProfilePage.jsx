import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FollowButton from './FollowButton';
import EditProfileModal from './EditProfileModal';
import Search from './Search';
import CreatePostModal from './CreatePostModal';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComments, setShowComments] = useState({}); // Track which posts show comments
  const [commentContent, setCommentContent] = useState({}); // Track comment input per post

  useEffect(() => {
    const userId = localStorage.getItem('userid');
    setLoggedInUserId(userId);
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userid');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Profile API response:', JSON.stringify(data, null, 2));

      const transformedPosts = data.posts?.map(post => {
        const isLiked = post.likes?.some(like => like.userId === userId) || false;
        console.log(`Post ${post.id} isLiked:`, isLiked, 'Likes:', post.likes);
        return {
          ...post,
          isLiked,
          _count: {
            likes: post._count?.likes || post.likes?.length || 0,
            comments: post._count?.comments || post.comments?.length || 0,
          },
          user: {
            id: post.author?.id || post.authorId || data.id,
            username: post.author?.username || data.username || 'Unknown User',
            avatar: post.author?.avatar || data.avatar || '/default-avatar.png',
          },
        };
      }) || [];

      const transformedProfile = {
        ...data,
        posts: transformedPosts,
        followersCount: data.followersCount || data.followers?.length || 0,
        followingCount: data.followingCount || data.following?.length || 0,
        isFollowing: data.isFollowing || false,
      };

      setProfile(transformedProfile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else if (error.response?.status === 404) {
        setProfile(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`http://localhost:5000/api/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId ? { ...post, comments: data } : post
        ),
      }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      toast.error('Failed to load comments');
    }
  };

  const handleCommentToggle = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
    if (!showComments[postId]) {
      fetchComments(postId); // Fetch comments when opening
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

      setProfile(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? {
                ...post,
                comments: [...(post.comments || []), data],
                _count: { ...post._count, comments: (post._count.comments || 0) + 1 },
              }
            : post
        ),
      }));
      setCommentContent(prev => ({ ...prev, [postId]: '' })); // Clear input
      toast.success('Comment added');
    } catch (error) {
      console.error('Comment submit error:', error);
      toast.error('Failed to add comment');
    }
  };

  const fetchFollowers = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`http://localhost:5000/api/user/${id}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(prev => ({
        ...prev,
        followedBy: data,
        followersCount: data.length,
      }));
      setShowFollowers(!showFollowers);
      setShowFollowing(false);
    } catch (error) {
      console.error('Failed to fetch followers:', error);
    }
  };

  const fetchFollowing = async () => {
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.get(`http://localhost:5000/api/user/${id}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const normalizedFollowing = Array.isArray(data)
        ? data.map(item => item.following || item).filter(Boolean)
        : [];
      setProfile(prev => ({
        ...prev,
        following: normalizedFollowing,
        followingCount: normalizedFollowing.length,
      }));
      setShowFollowing(!showFollowing);
      setShowFollowers(false);
    } catch (error) {
      console.error('Failed to fetch following:', error);
    }
  };

  const handleLikeChange = (postId, isLiked, newCount) => {
    console.log('Like change:', { postId, isLiked, newCount });
    setProfile(prev => ({
      ...prev,
      posts: prev.posts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked,
              likes: isLiked
                ? [...(post.likes || []), { userId: loggedInUserId, user: { id: loggedInUserId, username: prev.username, avatar: prev.avatar } }]
                : (post.likes || []).filter(like => like.userId !== loggedInUserId),
              _count: { ...post._count, likes: newCount },
            }
          : post
      ),
    }));
  };

  const handlePostDelete = (deletedPostId) => {
    setProfile(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post.id !== deletedPostId),
    }));
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

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl max-w-md shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
          <p className="text-gray-600 mb-6">The user profile you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const isOwner = loggedInUserId === profile.id;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">My App</h1>
          <Search />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col items-center py-8">
          <div className="relative group mb-4">
            <img
              src={profile.avatar || '/default-avatar.png'}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
            {isOwner && (
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-full"
              >
                Edit
              </button>
            )}
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-1">{profile.username}</h2>
          <p className="text-gray-600 text-sm mb-4 max-w-md text-center">{profile.bio || 'No bio yet'}</p>

          <div className="flex gap-6 mb-6">
            <button onClick={fetchFollowers} className="flex flex-col items-center">
              <span className="font-bold text-gray-800">{profile.followersCount}</span>
              <span className="text-sm text-gray-600">Followers</span>
            </button>
            <button onClick={fetchFollowing} className="flex flex-col items-center">
              <span className="font-bold text-gray-800">{profile.followingCount}</span>
              <span className="text-sm text-gray-600">Following</span>
            </button>
          </div>

          {!isOwner && (
            <FollowButton
              profileUserId={profile.id}
              initialIsFollowing={profile.isFollowing}
              onFollowChange={fetchProfile}
            />
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex justify-center mb-6">
            <h3 className="text-sm font-semibold text-gray-800 border-b-2 border-gray-800 pb-1 px-4">
              POSTS
            </h3>
          </div>

          {isOwner && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <CreatePostModal
                onPostCreated={newPost => {
                  const transformedPost = {
                    ...newPost,
                    isLiked: false,
                    likes: [],
                    comments: [],
                    _count: { likes: 0, comments: 0 },
                    user: {
                      id: profile.id,
                      username: profile.username,
                      avatar: profile.avatar || '/default-avatar.png',
                    },
                  };
                  setProfile(prev => ({
                    ...prev,
                    posts: [transformedPost, ...prev.posts],
                  }));
                }}
              />
            </div>
          )}

          {profile.posts?.length > 0 ? (
            <div className="space-y-4">
              {profile.posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.user.avatar}
                        alt={post.user.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-800">{post.user.username}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {isOwner && (
                      <DeleteButton
                        postId={post.id}
                        onDelete={() => handlePostDelete(post.id)}
                      />
                    )}
                  </div>

                  {post.content && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600">{post.content}</p>
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
              <div className="mx-auto w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
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
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                {isOwner ? 'Share Your First Post' : 'No Posts Yet'}
              </h4>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {isOwner ? 'When you share posts, they\'ll appear on your profile.' : ''}
              </p>
              {isOwner && (
                <button
                  onClick={() => document.getElementById('create-post-modal').click()}
                  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors text-sm"
                >
                  Share Photos
                </button>
              )}
            </div>
          )}
        </div>

        {showFollowers && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h4 className="text-lg font-semibold text-gray-800">Followers</h4>
                <button
                  onClick={() => setShowFollowers(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {profile.followersCount > 0 ? (
                  <div className="divide-y">
                    {profile.followedBy.map(follow => (
                      <div
                        key={follow.follower.id}
                        onClick={() => {
                          navigate(`/profile/${follow.follower.id}`);
                          setShowFollowers(false);
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={follow.follower.avatar || '/default-avatar.png'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{follow.follower.username}</p>
                          <p className="text-sm text-gray-500">
                            @{follow.follower.username.toLowerCase().replace(/\s+/g, '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="text-gray-500">No followers yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showFollowing && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h4 className="text-lg font-semibold text-gray-800">Following</h4>
                <button
                  onClick={() => setShowFollowing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto flex-1">
                {profile.followingCount > 0 ? (
                  <div className="divide-y">
                    {profile.following.map(user => (
                      <div
                        key={user.id}
                        onClick={() => {
                          navigate(`/profile/${user.id}`);
                          setShowFollowing(false);
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={user.avatar || '/default-avatar.png'}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{user.username}</p>
                          <p className="text-sm text-gray-500">
                            @{user.username.toLowerCase().replace(/\s+/g, '')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-300 mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    <p className="text-gray-500">Not following anyone yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showEditModal && (
          <EditProfileModal
            profile={profile}
            onClose={() => setShowEditModal(false)}
            onUpdate={fetchProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;