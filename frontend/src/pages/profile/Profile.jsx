import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Tweet } from "../../components/tweet";
import { FollowItem } from "../../components/followItems";
import api from "../../services/api";

export function Profile({ userId, onBack }) {
  const { user } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const [profileRes, postsRes, followingRes, followersRes] = await Promise.all([
        api.getProfile(userId),
        api.getUserPosts(userId),
        api.getFollowing(userId),
        api.getFollowers(userId)
      ]);

      setProfileUser(profileRes);
      setUserPosts(postsRes);
      setFollowing(followingRes);
      setFollowers(followersRes);

      // Check if current user is following this profile
      if (user && user.id !== userId) {
        const followingIds = followingRes.map(f => f.id);
        setIsFollowing(followingIds.includes(user.id));
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.unfollow(userId);
        setIsFollowing(false);
        // Update followers count
        setFollowers(prev => prev.filter(f => f.id !== user.id));
      } else {
        await api.follow(userId);
        setIsFollowing(true);
        // Add current user to followers
        setFollowers(prev => [...prev, user]);
      }
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando perfil...</div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Usuário não encontrado</div>
      </div>
    );
  }

  return (
    <div className="flex mx-auto max-w-7xl">
      {/* Sidebar */}
      <div className="w-20 xl:w-64 sticky top-0 px-2 h-screen">
        <button
          onClick={onBack}
          className="mt-4 bg-blue-400 text-white rounded-full font-bold px-4 py-2 hover:bg-blue-600 transition duration-200"
        >
          Voltar
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 border-l border-r border-gray-700 max-w-xl overflow-y-auto">
        {/* Profile Header */}
        <div className="border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{profileUser.nome}</h1>
              <p className="text-gray-500">@{profileUser.email?.split('@')[0]}</p>
              {profileUser.bio && (
                <p className="text-white mt-2">{profileUser.bio}</p>
              )}
              <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                <span>{followers.length} seguidores</span>
                <span>{following.length} seguindo</span>
              </div>
            </div>
            {user && user.id !== userId && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded-full font-bold transition duration-200 ${
                  isFollowing
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-blue-400 text-white hover:bg-blue-600"
                }`}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>
        </div>

        {/* Posts */}
        <div>
          <h2 className="px-4 py-3 text-xl font-bold border-b border-gray-800">Posts</h2>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Tweet key={post.id} tweet={post} />
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              Nenhum post ainda.
            </div>
          )}
        </div>
      </main>

      {/* Sidebar Right */}
      <aside className="hidden xl:block w-80 px-4">
        <div className="sticky top-0 pt-2">
          {/* Seguindo */}
          <div className="bg-gray-800 rounded-xl mt-4 p-4">
            <h2 className="font-bold text-xl mb-4">Seguindo</h2>
            {following.length > 0 ? (
              following.slice(0, 5).map((followedUser) => (
                <FollowItem
                  key={followedUser.id}
                  name={followedUser.nome}
                  username={followedUser.email?.split('@')[0]}
                  avatar="/default-avatar.png"
                />
              ))
            ) : (
              <p className="text-gray-500">Não está seguindo ninguém ainda.</p>
            )}
          </div>

          {/* Seguidores */}
          <div className="bg-gray-800 rounded-xl mt-4 p-4">
            <h2 className="font-bold text-xl mb-4">Seguidores</h2>
            {followers.length > 0 ? (
              followers.slice(0, 5).map((follower) => (
                <FollowItem
                  key={follower.id}
                  name={follower.nome}
                  username={follower.email?.split('@')[0]}
                  avatar="/default-avatar.png"
                />
              ))
            ) : (
              <p className="text-gray-500">Nenhum seguidor ainda.</p>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}
