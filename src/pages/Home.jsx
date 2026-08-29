import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Code2,
  Trophy,
  Users,
  Play,
  Clock,
  CheckCircle,
  ArrowRight,
  Search,
  Mail,
  Zap,
  Shield,
  Globe,
  User,
  Loader2,
  X,
  Calendar,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

import contestService from "../services/contest.Service";
import statsService from "../services/stats.Service";
import{ userURL} from "../api/urlEndPoint";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContests: 0,
    totalProblems: 0,
    totalSubmissions: 0,
  });
  const [recentContests, setRecentContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    setLoading(true);
    try {
      // Fetch stats from backend
      const statsResponse = await statsService.getPlatformStats();
      if (statsResponse.success) {
        setStats({
          totalUsers: statsResponse.data.totalUsers || 0,
          totalContests: statsResponse.data.totalContests || 0,
          totalProblems: statsResponse.data.totalProblems || 0,
          totalSubmissions: statsResponse.data.totalSubmissions || 0,
        });
      }

      // Fetch contests
      const [upcoming, ongoing, completed] = await Promise.all([
        contestService.getUpcomingContests(),
        contestService.getOngoingContests(),
        contestService.getCompletedContests(),
      ]);

      const allContests = [
        ...(ongoing.data || []),
        ...(completed.data || []),
      ];

      // Sort contests by date
      const sorted = allContests.sort(
        (a, b) =>
          new Date(b.date || b.startDate) - new Date(a.date || a.startDate),
      );
      setRecentContests(sorted.slice(0, 6));
    } catch (error) {
      console.error("Error fetching home data:", error);
      toast.error("Failed to load home data");

      // Fallback to demo data if API fails
      setStats({
        totalUsers: 150,
        totalContests: 12,
        totalProblems: 45,
        totalSubmissions: 320,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearching(true);
    setShowResults(true);

    try {
      const response = await axios.get(
        `${userURL}/search?username=${query.trim()}`,
        { withCredentials: true },
      );

      if (response.data.success) {
        setSearchResults(response.data.data || []);
        if (response.data.data.length === 0) {
          setShowResults(false);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Error searching users");
    } finally {
      setSearching(false);
    }
  };

  const handleUserSelect = (userId) => {
    setShowResults(false);
    setSearchQuery("");
    setSearchResults([]);
    navigate(`/profile/${userId}`);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowResults(false);
  };

  const features = [
    {
      icon: <Code2 className="w-8 h-8 text-blue-500" />,
      title: "Practice Problems",
      description:
        "Solve hundreds of coding problems across multiple difficulty levels. Master data structures and algorithms with detailed solutions.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Trophy className="w-8 h-8 text-yellow-500" />,
      title: "Contest Platform",
      description:
        "Participate in live coding contests, compete with developers worldwide, climb the leaderboard, and win recognition.",
      color: "from-yellow-500 to-yellow-600",
    },
    {
      icon: <Zap className="w-8 h-8 text-purple-500" />,
      title: "Real-time Compiler",
      description:
        "Write and execute code instantly with our powerful online compiler. Supports Python, C++, Java, JavaScript, PHP and more.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Secure & Track Progress",
      description:
        "Your code runs in isolated environments. Track your submissions, problem-solving journey, and achievements over time.",
      color: "from-green-500 to-green-600",
    },
  ];

  //  Use real stats from the API
  const statsItems = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      value: stats.totalUsers,
      label: "Active Users",
      suffix: "+",
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
      value: stats.totalContests,
      label: "Contests Held",
      suffix: "+",
    },
    {
      icon: <Code2 className="w-6 h-6 text-purple-500" />,
      value: stats.totalProblems,
      label: "Problems Available",
      suffix: "+",
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      value: stats.totalSubmissions,
      label: "Submissions Made",
      suffix: "+",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar - Below Navbar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-1 bg-[#3e4bc4] rounded-full"></div>
              <p className="text-sm text-gray-600">
                Find and connect with developers
              </p>
            </div>
            <div className="relative w-72">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={handleSearch}
                  onFocus={() =>
                    searchQuery.trim().length >= 2 && setShowResults(true)
                  }
                  className="w-full pl-10 pr-10 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3e4bc4] focus:border-transparent transition-all text-sm text-gray-800 placeholder-gray-500"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {searching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 text-[#3e4bc4] animate-spin" />
                  </div>
                )}
              </div>

              {/* Search Results */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
                  {searchResults.map((result) => (
                    <button
                      key={result._id}
                      onClick={() => handleUserSelect(result._id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-100 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {result.name?.charAt(0) ||
                          result.username?.charAt(0) ||
                          "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {result.name || result.username}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          @{result.username}
                        </p>
                      </div>
                      <User className="w-4 h-4 text-gray-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#3e4bc4] via-[#5a4bd1] to-[#8B5CF6] text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-white/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6 backdrop-blur-sm animate-pulse">
                <Play className="w-4 h-4 text-white" />
                <span className="text-sm font-medium">
                  Live & Active Platform
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Master Coding with
                <span className="text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-pink-400">
                  {" "}
                  CodeBase
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                Your ultimate platform for practicing coding problems,
                participating in live contests, and improving your programming
                skills. Join thousands of developers already leveling up!
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/problems"
                  className="px-8 py-3 bg-white text-[#3e4bc4] font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2"
                >
                  Start Practicing
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/compailer"
                  className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  Try Compiler
                </Link>
              </div>
            </div>

            {/* Right Content - Real Stats */}
            <div className="grid grid-cols-2 gap-4">
              {statsItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex justify-center mb-2">{item.icon}</div>
                  <p className="text-3xl font-bold">
                    {item.value.toLocaleString()}
                    {item.suffix}
                  </p>
                  <p className="text-sm text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose CodeBase?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to become a better developer, all in one
              place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div
                  className={`w-16 h-16 rounded-xl bg-linear-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Contests Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Recent Contests
              </h2>
              <p className="text-gray-600 mt-1">
                Check out the latest contests on the platform
              </p>
            </div>
            <Link
              to="/contests"
              className="text-[#3e4bc4] hover:text-[#5a4bd1] font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-[#3e4bc4] animate-spin" />
            </div>
          ) : recentContests.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
              <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No contests available yet</p>
              <p className="text-sm text-gray-400">
                Check back later for upcoming contests!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentContests.map((contest) => (
                <Link
                  key={contest.contestId}
                  to={`/contests/${contest.contestId}`}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#3e4bc4] transition-colors">
                        {contest.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {contest.createdBy?.name ||
                          contest.createdBy?.username ||
                          "Unknown"}
                      </p>
                    </div>
                    {/* <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        contest.status === "ONGOING"
                          ? "bg-green-100 text-green-700"
                          : contest.status === "UPCOMING"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {contest.status || "UPCOMING"}
                    </span> */}
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(
                        contest.date || contest.startDate,
                      ).toLocaleDateString()}
                    </span>
                    <span>{contest.duration || 0}m</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-linear-to-br from-[#3e4bc4] to-[#8B5CF6] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Coding?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of developers already improving their skills on
            CodeBase. Start your journey today!
          </p>
          <Link
            to="/problems"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#3e4bc4] font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-8 h-8 text-[#8B5CF6]" />
                <span className="text-2xl font-bold">CodeBase</span>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">
                Your ultimate coding platform for practicing problems,
                participating in contests, and mastering programming skills.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/problems"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Problems
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contests"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Contests
                  </Link>
                </li>
                <li>
                  <Link
                    to="/compailer"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Compiler
                  </Link>
                </li>
                <li>
                  <Link
                    to="/profile"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Report Issue
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
                Stay Updated
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Get the latest updates about new problems and contests.
              </p>
              {/* <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] text-sm text-white placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-[#3e4bc4] text-white rounded-r-lg hover:bg-[#5a4bd1] transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div> */}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} CodeBase. All rights reserved.
            </p>
            <div className="flex items-center gap-6 mt-4 sm:mt-0">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;