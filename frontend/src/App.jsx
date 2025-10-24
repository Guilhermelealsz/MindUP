import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import { Profile } from "./pages/profile/Profile";
import { Sidebar } from "./components/sidebar";
import { Tweet } from "./components/tweet";
import { TwitterForm } from "./components/twitterForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FollowItem } from "./components/followItems";
import api from "./services/api";

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState("login"); // "login", "register", "feed", "profile"
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [profileUserId, setProfileUserId] = useState(null);

  useEffect(() => {
    if (user) {
      setCurrentView("feed");
      loadPosts();
      loadCategories();
    } else {
      setCurrentView("login");
    }
  }, [user]);

  const loadPosts = async (categoryId = null) => {
    try {
      const response = categoryId ? await api.getPostsByCategory(categoryId) : await api.getPosts();
      setPosts(response);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await api.getCategories();
      setCategories(response);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleNewPost = async (content, categoryId, image = null) => {
    try {
      const postData = {
        titulo: content.substring(0, 100), // Primeiro 100 caracteres como título
        conteudo: content,
        categoria_id: categoryId || 1, // Categoria padrão
        imagem: image,
      };
      await api.createPost(postData);
      loadPosts(selectedCategory); // Recarregar posts com filtro atual
    } catch (error) {
      console.error("Erro ao criar post:", error);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    loadPosts(categoryId);
  };

  const handleViewProfile = (userId) => {
    setProfileUserId(userId);
    setCurrentView("profile");
  };

  const handleNavigation = (navData) => {
    if (typeof navData === 'object' && navData.view === "profile") {
      setProfileUserId(navData.userId);
      setCurrentView("profile");
    } else {
      setCurrentView(navData);
    }
  };

  const handleBackToFeed = () => {
    setCurrentView("feed");
    setProfileUserId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return currentView === "login" ? (
      <Login onSwitchToRegister={() => setCurrentView("register")} />
    ) : (
      <Register onSwitchToLogin={() => setCurrentView("login")} />
    );
  }

  if (currentView === "profile") {
    return <Profile userId={profileUserId} onBack={handleBackToFeed} />;
  }

  return (
    <div className="flex mx-auto max-w-7xl">
      <Sidebar onNavigate={handleNavigation} />
      <main className="flex-1 border-l border-r border-gray-700 max-w-xl overflow-y-auto">
        <header className="sticky top-0 z-10 bg-twitter-background bg-opacity-80 backdrop-blur-sm">
          <h2 className="px-4 py-3 text-xl font-bold">Xestudos</h2>
        </header>
        <TwitterForm onTweet={handleNewPost} categories={categories} />
        <div>
          {posts.map((post) => (
            <Tweet key={post.id} tweet={post} onViewProfile={handleViewProfile} />
          ))}
        </div>
      </main>
      <aside className="hidden xl:block w-80 px-4">
        <div className="sticky top-0 pt-2">
          <div className="relative">
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute top-3 left-3 text-gray-500"
            />
            <input
              placeholder="Buscar no Xestudos"
              className="w-full bg-gray-800 text-white rounded-full outline-none py-2 pl-10 pr-4"
            />
          </div>

          <div className="bg-gray-800 rounded-xl mt-4 p-4">
            <h2 className="font-bold text-xl mb-4">Categorias</h2>
            <div className="space-y-2">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition ${
                  selectedCategory === null ? 'bg-blue-600' : ''
                }`}
              >
                Todos os posts
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition ${
                    selectedCategory === category.id ? 'bg-blue-600' : ''
                  }`}
                >
                  {category.nome}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

export default App;
