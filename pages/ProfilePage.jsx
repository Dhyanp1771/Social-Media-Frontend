import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FollowButton from "./FollowButton";
import EditProfileModal from './EditProfileModal';
import Search from './Search';
import CreatePostModal from './CreatePostModal';
import LikeButton from './LikeButton';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Following, setFollowing] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userid");
    setLoggedInUserId(userId);
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:5000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const transformedProfile = {
        ...data,
        followersCount: data.followedBy?.length || 0,
        followingCount: data.following?.length || 0,
        isFollowing: data.followedBy?.some(f => f.follower.id === loggedInUserId) || false
      };

      setProfile(transformedProfile);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowers = async () => {
    if (showFollowers) return setShowFollowers(false);
    const token = localStorage.getItem("token");
    try {
      await axios.get(`http://localhost:5000/api/user/${id}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowFollowers(true);
      setShowFollowing(false);
    } catch (error) {
      console.error("Failed to fetch followers:", error);
    }
  };

  const fetchFollowing = async () => {
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(`http://localhost:5000/api/user/${id}/following`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const normalizedFollowing = Array.isArray(data)
        ? data.map(item => item.following || item).filter(Boolean)
        : [];
      setFollowing(normalizedFollowing);
      setShowFollowing(prev => !prev);
      setShowFollowers(false);
    } catch (error) {
      console.error("Failed to fetch following:", error);
    }
  };

  if (loading) return <div className="flex justify-center p-6 text-lg font-medium">Loading profile...</div>;
  if (!profile) return <div className="flex justify-center p-6 text-lg text-red-500">Profile not found</div>;

  const isOwner = loggedInUserId === profile.id;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Search />

      {/* Profile Header */}
      <div className="flex items-start gap-6 p-6 bg-white rounded-xl shadow-md">
        <img src={profile.avatar || '/default-avatar.png'} alt="avatar" className="w-24 h-24 rounded-full object-cover border" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-800">{profile.username}</h2>
            {isOwner ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-4 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm"
              >
                Edit Profile
              </button>
            ) : (
              <FollowButton
                profileUserId={profile.id}
                initialIsFollowing={profile.isFollowing}
                onFollowChange={fetchProfile}
              />
            )}
          </div>
          <p className="text-gray-600">{profile.bio || "No bio yet"}</p>
          <div className="flex gap-6 text-sm text-gray-700">
            <button onClick={fetchFollowers} className="hover:underline">
              <strong>{profile.followersCount}</strong> Followers
            </button>
            <button onClick={fetchFollowing} className="hover:underline">
              <strong>{profile.followingCount}</strong> Following
            </button>
          </div>
        </div>
      </div>

      {/* Create Post */}
      {isOwner && (
        <div className="bg-white p-4 rounded-xl shadow-md">
          <CreatePostModal
            onPostCreated={newPost => setProfile(prev => ({
              ...prev,
              posts: [newPost, ...prev.posts]
            }))}
          />
        </div>
      )}

      {/* Followers Modal */}
      {showFollowers && (
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between mb-2">
            <h4 className="text-lg font-semibold">Followers</h4>
            <button onClick={() => setShowFollowers(false)} className="text-gray-500 text-xl">×</button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {profile.followedBy?.length > 0 ? (
              profile.followedBy.map(follow => (
                <div key={follow.follower.id} onClick={() => navigate(`/profile/${follow.follower.id}`)} className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <img src={follow.follower.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" />
                  <span>{follow.follower.username}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No followers yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowing && (
        <div className="p-4 bg-white rounded-xl shadow-lg">
          <div className="flex justify-between mb-2">
            <h4 className="text-lg font-semibold">Following</h4>
            <button onClick={() => setShowFollowing(false)} className="text-gray-500 text-xl">×</button>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {profile.following?.length > 0 ? (
              profile.following.map(user => (
                <div key={user.id} onClick={() => navigate(`/profile/${user.id}`)} className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <img src={user.avatar || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" />
                  <span>{user.username}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Not following anyone yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div>
        <h3 className="text-xl font-bold mb-4">Posts</h3>
        {profile.posts?.length > 0 ? (
          <div className="space-y-6">
            {profile.posts.map(post => (
              <div key={post.id} className="bg-white p-4 rounded-xl shadow-md space-y-2">
                <p className="text-gray-800">{post.content}</p>
                {post.image?.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {post.image.map((img, i) => (
                      <img key={i} src={img} alt="post" className="w-full rounded" />
                    ))}
                  </div>
                )}

                {/* Like button and like count */}
                <div className="mt-2 flex items-center gap-3">
                  <LikeButton
                    postId={post.id}
                    initialLiked={post.likes?.some(l => l.user?.id === loggedInUserId)}
                    onLikeChange={fetchProfile}
                  />
                  <span className="text-sm text-gray-600">
                    {post._count?.likes || 0} Likes
                  </span>
                </div>

                {/* Liked by users */}
                {post.likes?.length > 0 && (
                  <div className="flex flex-wrap mt-1 gap-2 text-xs text-gray-500">
                    Liked by:
                    {post.likes.map((like, i) => (
                      <span key={i}>{like.user?.username}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onUpdate={fetchProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
