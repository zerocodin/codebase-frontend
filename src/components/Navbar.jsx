import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  UserCircle,
  Trophy,
  Code,
  Home,
  FileText,
  Calendar,
  Menu,
  X,
} from "lucide-react";

import { useAuth } from "../components/contexts/AuthContext";
import Logo from "../utils/Logo";
import toast from "react-hot-toast";
import authService from "../services/auth.Service";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const NavLink = ({ to, children, onClick }) => {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="relative cursor-pointer group py-1 text-white/80 hover:text-white transition-colors duration-300 text-sm font-medium"
      >
        <span>{children}</span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-300 group-hover:w-full transition-all duration-500 ease-out"></span>
      </Link>
    );
  };

  const MobileNavLink = ({ to, children, icon: Icon, onClick }) => {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors rounded-lg"
      >
        {Icon && <Icon className="w-5 h-5 text-[#3e4bc4]" />}
        <span className="font-medium">{children}</span>
      </Link>
    );
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      toast.success("Logged out successfully");
      navigate("/");
      setIsMobileMenuOpen(false);
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to logout");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-9">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-8">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/problems">Problems</NavLink>
            <NavLink to="/contests">Contests</NavLink>
            <NavLink to="/compailer">Compiler</NavLink>
          </div>

          {/* Right side - User actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                    {user.profileImage &&
                    user.profileImage !== "default-profile.png" ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircle className="w-6 h-6 text-white" />
                    )}
                  </div>

                  <span className="text-sm font-medium text-white hidden sm:block">
                    {user.name || user.username}
                  </span>

                  <ChevronDown
                    className={`w-4 h-4 text-white/70 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Create Contest
                      </Link>
                    </div>

                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login">
                  <button className="px-6 py-2 font-bold text-white border-none rounded-full hover:bg-white/10 hover:scale-105 transition-all duration-300">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-6 py-2 h-9 font-semibold text-white bg-linear-to-r from- to-[#8debeb] rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md">
                    Sign Up
                  </button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button - Shows dropdown menu on click */}
            <div className="md:hidden relative" ref={mobileMenuRef}>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>

              {/* Mobile Dropdown Menu - Same style as profile dropdown */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  {/* Mobile Navigation Links */}
                  <div className="py-1">
                    <Link
                      to="/"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Home className="w-4 h-4 text-[#3e4bc4]" />
                      Home
                    </Link>
                    <Link
                      to="/problems"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Code className="w-4 h-4 text-[#3e4bc4]" />
                      Problems
                    </Link>
                    <Link
                      to="/contests"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Trophy className="w-4 h-4 text-[#3e4bc4]" />
                      Contests
                    </Link>
                    <Link
                      to="/compailer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#3e4bc4]" />
                      Compiler
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100"></div>

                  {/* Mobile Auth Section */}
                  {isAuthenticated && user ? (
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{user.username}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Create Contest
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="py-3 px-4 space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <button className="w-full py-2 text-sm font-bold text-[#3e4bc4] border-2 border-[#3e4bc4] rounded-full hover:bg-[#3e4bc4] hover:text-white transition-all duration-300">
                          Login
                        </button>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <button className="w-full py-2 text-sm font-semibold text-white bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6] rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 shadow-md">
                          Sign Up
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;