import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faUser,
  faRightFromBracket
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { useAuth } from '../../context/AuthContext';

const NavItem = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center p-3 rounded-full cursor-pointer hover:bg-gray-600 transition duration-200 w-full text-left"
  >
    <FontAwesomeIcon icon={icon} className="text-2xl mr-4" />
    <span className="text-xl hidden xl:inline">{text}</span>
  </button>
);

export function Sidebar({ onNavigate }) {
  const { logout, user } = useAuth();

  const handleNavigation = (view) => {
    if (view === "profile" && user) {
      onNavigate({ view: "profile", userId: user.id });
    } else if (onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <div className="w-20 xl:w-64 sticky top-0 px-2 h-screen">
      <FontAwesomeIcon icon={faTwitter} className="text-blue-400 text-3xl m-4" />
      <nav>
        <NavItem icon={faHome} text="Home" onClick={() => handleNavigation("feed")} />
        <NavItem icon={faUser} text="Profile" onClick={() => handleNavigation("profile")} />
      </nav>
      <button
        onClick={logout}
        className="bg-blue-400 text-white rounded-full font-bold px-4 py-3 mt-4 w-full cursor-pointer"
      >
        <FontAwesomeIcon icon={faRightFromBracket} className="text-white inline xl:hidden mr-2" />
        <span className="hidden xl:inline">Logout</span>
      </button>
    </div>
  );
}
