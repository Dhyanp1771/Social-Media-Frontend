// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import FollowButton from "./FollowButton";
// import EditProfileModal from './EditProfileModal';
// import Search from './Search';

// const ProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);
//   // const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     setLoggedInUserId(userId);
//     fetchProfile();
//   }, [id]);

//   const fetchProfile = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       // setLoading(true);
//       const { data } = await axios.get(`http://localhost:5000/api/user/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       // Transform the profile data to match our needs
//       const transformedProfile = {
//         ...data,
//         followersCount: data.followedBy?.length || 0,
//         followingCount: data.following?.length || 0,
//         isFollowing: data.followedBy?.some(f => f.follower.id === loggedInUserId) || false
//       };
      
//       setProfile(transformedProfile);
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//     } finally {
//       // setLoading(false);
//     }
//   };

//   const fetchFollowers = async () => {
//     if (showFollowers) {
//       setShowFollowers(false);
//       return;
//     }
    
//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`http://localhost:5000/api/user/${id}/followers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setShowFollowers(true);
//       setShowFollowing(false);
//     } catch (error) {
//       console.error("Failed to fetch followers:", error);
//     }
//   };
  
//   const fetchFollowing = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(
//         `http://localhost:5000/api/user/${id}/following`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       // Normalize the data structure
//       const normalizedFollowing = Array.isArray(data) 
//         ? data.map(item => item.following || item).filter(Boolean)
//         : [];
      
//       console.log("Normalized following data:", normalizedFollowing);
//       setFollowing(normalizedFollowing);
//       setShowFollowing(prev => !prev);
//       setShowFollowers(false);
//     } catch (error) {
//       console.error("Failed to fetch following:", error);
//         ([]);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) fetchProfile();
//   }, [id]);

//   if (!profile || !loggedInUserId) return <div>Loading...</div>;

//   const isOwner = loggedInUserId.toLowerCase() === profile.username.toLowerCase();

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <Search />

//       <div className="flex items-center space-x-4">
//         <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full" />
//         <div>
//           <h2 className="text-xl font-bold">{profile.username}</h2>
//           <p>{profile.bio}</p>
//           <div className="flex gap-4 mt-2">
//             <button onClick={fetchFollowers}>
//               Followers: {profile.followedBy?.length || 0}
//             </button>
//             <button onClick={fetchFollowing}>
//               Following: {profile.following?.length || 0}
//             </button>
//           </div>
//         </div>

//         {isOwner ? (
//           <button
//             onClick={() => setShowEditModal(true)}
//             className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
//           >
//             Edit Profile
//           </button>
//         ) : (
//           profile.id && <FollowButton profileUserId={profile.id} onFollowChange={fetchProfile} />
//         )}
//       </div>

//       {/* Followers List */}
//       {showFollowers && (
//         <div className="mt-4 border rounded p-3 bg-white shadow">
//           <h4 className="font-semibold mb-2">Followers</h4>
//           {followers.length === 0 ? (
//             <p>No followers yet.</p>
//           ) : (
//             followers.map(user => (
//               <div
//                 key={user.id}
//                 className="flex items-center gap-2 border-b py-1 cursor-pointer"
//                 onClick={() => navigate(`/profile/${user.id}`)}
//               >
//                 <img src={user.avatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
//                 <div>
//                   <div className="font-medium text-blue-600 hover:underline">{user.username}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Following List - Simplified */}
//       {showFollowing && (
//         <div className="mt-4 border rounded p-3 bg-white shadow">
//           <h4 className="font-semibold mb-2">Following</h4>
//           {following.length === 0 ? (
//             <p>Not following anyone yet.</p>
//           ) : (
//             following.map(user => (
//               <div
//                 key={user.id}
//                 className="flex items-center gap-2 border-b py-1 cursor-pointer"
//                 onClick={() => navigate(`/profile/${user.id}`)}
//               >
//                 <img 
//                   src={user.avatar || '/default-avatar.png'} 
//                   className="w-8 h-8 rounded-full" 
//                   alt={user.username}
//                 />
//                 <div>
//                   <div className="font-medium text-blue-600 hover:underline">
//                     {user.username}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* User Posts */}
//       <div className="mt-6">
//         <h3 className="text-lg font-bold mb-2">Posts</h3>
//         {profile.posts?.map(post => (
//           <div key={post.id} className="border p-2 rounded mb-2">{post.content}</div>
//         ))}
//       </div>

//       {showEditModal && (
//         <EditProfileModal profile={profile} onClose={() => setShowEditModal(false)} />
//       )}
//     </div>
//   );
// };

// export default ProfilePage;



import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import FollowButton from "./FollowButton";
import EditProfileModal from './EditProfileModal';
import Search from './Search';
import CreatePostModal from './CreatePostModal';

const ProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [Following,setFollowing]=useState(false);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Transform the profile data to match our needs
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
    if (showFollowers) {
      setShowFollowers(false);
      return;
    }
    
    const token = localStorage.getItem("token");
    try {
      const { data } = await axios.get(`http://localhost:5000/api/user/${id}/followers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      const { data } = await axios.get(
        `http://localhost:5000/api/user/${id}/following`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Normalize the data structure
      const normalizedFollowing = Array.isArray(data) 
        ? data.map(item => item.following || item).filter(Boolean)
        : [];
      
      console.log("Normalized following data:", normalizedFollowing);
      setFollowing(normalizedFollowing);
      setShowFollowing(prev => !prev);
      setShowFollowers(false);
    } catch (error) {
      console.error("Failed to fetch following:", error);
        ([]);
    }
  };

  if (loading) return <div className="flex justify-center p-4">Loading profile...</div>;
  if (!profile) return <div className="flex justify-center p-4">Profile not found</div>;

  console.log("loogedin",loggedInUserId);
  const isOwner = loggedInUserId === profile.id;

  console.log("loggedInUserId", loggedInUserId);
console.log("profile.id", profile?.id);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Search />

      <div className="flex items-center space-x-4 mb-6">
        <img 
          src={profile.avatar || '/default-avatar.png'} 
          alt="avatar" 
          className="w-20 h-20 rounded-full object-cover border" 
        />
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">{profile.username}</h2>
            {isOwner ? (
              <button
                onClick={() => setShowEditModal(true)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
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
          
          <p className="my-2 text-gray-700">{profile.bio || "No bio yet"}</p>
          
          <div className="flex gap-4">
            <button 
              onClick={fetchFollowers}
              className="hover:underline"
            >
              <span className="font-semibold">{profile.followersCount}</span> Followers
            </button>
            <button 
              onClick={fetchFollowing}
              className="hover:underline"
            >
              <span className="font-semibold">{profile.followingCount}</span> Following
            </button>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="mt-4 border rounded-lg p-4 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-lg">Followers</h4>
            <button 
              onClick={() => setShowFollowers(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
            {profile.followedBy?.length > 0 ? (
              profile.followedBy.map(follow => (
                <div
                  key={follow.follower.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                  onClick={() => navigate(`/profile/${follow.follower.id}`)}
                >
                  <img 
                    src={follow.follower.avatar || '/default-avatar.png'} 
                    className="w-10 h-10 rounded-full object-cover" 
                    alt={follow.follower.username}
                  />
                  <div>
                    <div className="font-medium">{follow.follower.username}</div>
                  </div>
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
        <div className="mt-4 border rounded-lg p-4 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-lg">Following</h4>
            <button 
              onClick={() => setShowFollowing(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              
            </button>
          </div>
          <div className="max-h-60 overflow-y-auto">
{profile.following?.length > 0 ? (
  profile.following.map(user => (
    <div
      key={user.id}
      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
      onClick={() => navigate(`/profile/${user.id}`)}
    >
      <img 
        src={user.avatar || '/default-avatar.png'} 
        className="w-10 h-10 rounded-full object-cover" 
        alt={user.username}
      />
      <div>
        <div className="font-medium">{user.username}</div>
      </div>
    </div>
  ))
) : (
  <p className="text-gray-500">Not following anyone yet.</p>
)}

          </div>
        </div>
      )}
       {/* Owner-only CreatePostModal */}
          {isOwner && (
            <div className="mb-4">
              <CreatePostModal
            onPostCreated={newPost => setProfile(prev => ({
              ...prev,
              posts: [newPost, ...prev.posts]
            }))}
          />
        </div>
      )}
        
      {/* User Posts */}
      <div className="mt-8">
        <h3 className="text-lg font-bold mb-4">Posts</h3>
        {profile.posts?.length > 0 ? (
          <div className="space-y-4">
            {profile.posts.map(post => (
              <div key={post.id} className="border rounded-lg p-4 bg-white shadow">
                <p>{post.content}</p>
                {post.image?.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {post.image.map((img, i) => (
                      <img key={i} src={img} alt="post" className="w-full h-auto rounded" />
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




// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import FollowButton from "./FollowButton";
// import EditProfileModal from './EditProfileModal';
// import Search from './Search';

// const ProfilePage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [profile, setProfile] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [loggedInUserId, setLoggedInUserId] = useState(null);
//   const [followers, setFollowers] = useState([]);
//   const [following, setFollowing] = useState([]);
//   const [showFollowers, setShowFollowers] = useState(false);
//   const [showFollowing, setShowFollowing] = useState(false);

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     setLoggedInUserId(userId);
//      fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`http://localhost:5000/api/user/${id}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
      
//       // Add isFollowing check to profile data
//       const isFollowing = data.followedBy?.some(f => f.follower.id === loggedInUserId) || false;
//       setProfile({...data, isFollowing});
//     } catch (error) {
//       console.error("Failed to fetch profile:", error);
//     }
//   };

//   const fetchFollowers = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(`http://localhost:5000/api/user/${id}/followers`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setFollowers(data);
//       setShowFollowers(prev => !prev);
//       setShowFollowing(false);
//     } catch (error) {
//       console.error("Failed to fetch followers:", error);
//     }
//   };

//   const fetchFollowing = async () => {
//     const token = localStorage.getItem("token");
//     try {
//       const { data } = await axios.get(
//         `http://localhost:5000/api/user/${id}/following`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
      
//       // Normalize the data structure
//       const normalizedFollowing = Array.isArray(data) 
//         ? data.map(item => item.following || item).filter(Boolean)
//         : [];
      
//       console.log("Normalized following data:", normalizedFollowing);
//       setFollowing(normalizedFollowing);
//       setShowFollowing(prev => !prev);
//       setShowFollowers(false);
//     } catch (error) {
//       console.error("Failed to fetch following:", error);
//       setFollowing([]);
//     }
//   };

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) fetchProfile();
//   }, [id]);

//   if (!profile || !loggedInUserId) return <div>Loading...</div>;

//   const isOwner = loggedInUserId === profile.id;

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <Search />

//       <div className="flex items-center space-x-4">
//         <img src={profile.avatar} alt="avatar" className="w-20 h-20 rounded-full" />
//         <div>
//           <h2 className="text-xl font-bold">{profile.username}</h2>
//           <p>{profile.bio}</p>
//           <div className="flex gap-4 mt-2">
//             <button onClick={fetchFollowers}>
//               Followers: {profile.followedBy?.length || 0}
//             </button>
//             <button onClick={fetchFollowing}>
//               Following: {profile.following?.length || 0}
//             </button>
//           </div>
//         </div>

//         {isOwner ? (
//           <button
//             onClick={() => setShowEditModal(true)}
//             className="ml-auto bg-blue-500 text-white px-3 py-1 rounded"
//           >
//             Edit Profile
//           </button>
//         ) : (
//           profile.id && (
//             <FollowButton 
//               profileUserId={profile.id} 
//               initialIsFollowing={profile.isFollowing} 
//               onFollowChange={fetchProfile} 
//             />
//           )
//         )}
//       </div>

//       {/* Followers List */}
//       {showFollowers && (
//         <div className="mt-4 border rounded p-3 bg-white shadow">
//           <h4 className="font-semibold mb-2">Followers</h4>
//           {followers.length === 0 ? (
//             <p>No followers yet.</p>
//           ) : (
//             followers.map(user => (
//               <div
//                 key={user.id}
//                 className="flex items-center gap-2 border-b py-1 cursor-pointer"
//                 onClick={() => navigate(`/profile/${user.id}`)}
//               >
//                 <img src={user.avatar || '/default-avatar.png'} className="w-8 h-8 rounded-full" />
//                 <div>
//                   <div className="font-medium text-blue-600 hover:underline">{user.username}</div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* Following List - Simplified */}
//       {showFollowing && (
//         <div className="mt-4 border rounded p-3 bg-white shadow">
//           <h4 className="font-semibold mb-2">Following</h4>
//           {following.length === 0 ? (
//             <p>Not following anyone yet.</p>
//           ) : (
//             following.map(user => (
//               <div
//                 key={user.id}
//                 className="flex items-center gap-2 border-b py-1 cursor-pointer"
//                 onClick={() => navigate(`/profile/${user.id}`)}
//               >
//                 <img 
//                   src={user.avatar || '/default-avatar.png'} 
//                   className="w-8 h-8 rounded-full" 
//                   alt={user.username}
//                 />
//                 <div>
//                   <div className="font-medium text-blue-600 hover:underline">
//                     {user.username}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* User Posts */}
//       <div className="mt-6">
//         <h3 className="text-lg font-bold mb-2">Posts</h3>
//         {profile.posts?.map(post => (
//           <div key={post.id} className="border p-2 rounded mb-2">{post.content}</div>
//         ))}
//       </div>

//       {showEditModal && (
//         <EditProfileModal profile={profile} onClose={() => setShowEditModal(false)} />
//       )}
//     </div>
//   );
// };

// export default ProfilePage;