import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getUserProfile } from "../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // ✅ Refs for detecting outside clicks
  const mobileMenuRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const { data } = await getUserProfile();
          setUser(data);
        } catch (err) {
          console.error("Navbar: Failed to fetch user", err);
        }
      })();
    }
  }, [token]);

  // ✅ Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("button.mobile-menu-btn")
      ) {
        setMobileMenu(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        !event.target.closest("img.profile-avatar")
      ) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMobileMenu(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b shadow-md px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50 w-full">
      
      {/* ✅ Logo */}
      <Link to={token ? "/feed" : "/login"} className="text-blue-700 font-extrabold text-3xl">
        in
      </Link>

      {/* ✅ Search Bar */}
      {token && (
        <div className="relative hidden md:block flex-1 mx-4 max-w-md">
          <span className="material-icons absolute left-3 top-2.5 text-gray-500">search</span>
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
          />
        </div>
      )}

      {/* ✅ Desktop Menu */}
      {token && (
        <div className="hidden md:flex items-center gap-6 text-gray-600">
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
          {user && (
            <div className="relative" ref={profileMenuRef}>
              <img
                src={user?.profileImage || "https://via.placeholder.com/40"}
                alt="Profile"
                className="profile-avatar w-9 h-9 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-500 transition"
                onClick={() => setShowMenu(!showMenu)}
              />
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-2 animate-fadeIn">
                  <Link to="/profile" className="block px-4 py-2 rounded hover:bg-gray-100" onClick={() => setShowMenu(false)}>
                    👤 View Profile
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 rounded text-red-600 hover:bg-gray-100"
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ✅ Mobile Hamburger Menu */}
      {token && (
        <div className="block md:hidden">
          <button
            className="mobile-menu-btn material-icons text-gray-700 text-3xl focus:outline-none"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            menu
          </button>
        </div>
      )}

      {/* ✅ Mobile Slide-out Menu */}
      {mobileMenu && token && (
        <div
          ref={mobileMenuRef}
          className="absolute top-16 left-0 w-full bg-white border-t shadow-md flex flex-col items-start px-6 py-4 space-y-3 md:hidden animate-slideDown"
        >
          {[
            { to: "/feed", label: "Home" },
            { to: "/network", label: "My Network" },
            { to: "/jobs", label: "Jobs" },
            { to: "/messages", label: "Messaging" },
            { to: "/notifications", label: "Notifications" }
          ].map((item, i) => (
            <Link
              key={i}
              to={item.to}
              className="w-full py-2 text-gray-700 hover:text-blue-600 border-b"
              onClick={() => setMobileMenu(false)} // ✅ Auto close
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/profile"
            className="w-full py-2 text-gray-700 hover:text-blue-600 border-b"
            onClick={() => setMobileMenu(false)} // ✅ Auto close
          >
            👤 View Profile
          </Link>
          <button onClick={logout} className="w-full text-left py-2 text-red-600 hover:bg-gray-100">
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
}
