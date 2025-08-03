import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserProfile } from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error("Navbar: Failed to fetch user", err);
      }
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-md px-6 py-2 flex items-center justify-between sticky top-0 z-50">
      
      {/* ✅ Logo */}
      <Link to="/feed" className="text-blue-700 font-extrabold text-3xl">in</Link>

      {/* ✅ Search Bar */}
      <div className="relative hidden sm:block flex-1 mx-6 max-w-md">
        <span className="material-icons absolute left-3 top-2.5 text-gray-500">search</span>
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      </div>

      {/* ✅ Navigation Icons */}
      <div className="flex items-center gap-6 text-gray-600">
        {[
          { to: "/feed", icon: "home", label: "Home" },
          { to: "/network", icon: "people", label: "My Network" },
          { to: "/jobs", icon: "work", label: "Jobs" },
          { to: "/messages", icon: "chat", label: "Messaging" },
          { to: "/notifications", icon: "notifications", label: "Notifications" }
        ].map((item, i) => (
          <Link key={i} to={item.to} className="flex flex-col items-center hover:text-blue-700 transition">
            <span className="material-icons">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}

        {/* ✅ Profile Avatar Dropdown */}
        <div className="relative">
          <img
            src={user?.profileImage || "https://via.placeholder.com/40"}
            alt="Profile"
            className="w-9 h-9 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-500 transition"
            onClick={() => setShowMenu(!showMenu)}
          />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 animate-fadeIn">
              <Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-100">👤 View Profile</Link>
              <hr className="my-1"/>
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 rounded text-red-600 hover:bg-gray-100"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
