import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  User,
  Calendar,
  Code,
  Trophy,
  Users,
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Award,
} from "lucide-react";
import toast from "react-hot-toast";

import profileService from "../../services/profile.Service";
import userProgressService from "../../services/userProgress.Service";

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Fetch user details
      const userResponse = await profileService.getUserById(userId);
      if (userResponse.success) {
        setUser(userResponse.data.user);
      } else {
        toast.error(userResponse.message || "Failed to fetch user");
        navigate("/problems");
        return;
      }

      // Fetch user stats
      try {
        const statsResponse =
          await userProgressService.getPublicUserStats(userId);
        if (statsResponse.success) {
          setUserStats(statsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user stats:", error);
        setUserStats({
          solvedCount: 0,
          attemptedCount: 0,
          participatedCount: 0,
          accuracy: 0,
          solvedProblems: [],
          participatedContests: [],
        });
      }
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
      navigate("/problems");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      ONGOING: "bg-green-100 text-green-700",
      UPCOMING: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-gray-100 text-gray-600",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
          <Link
            to="/problems"
            className="text-[#3e4bc4] hover:underline mt-2 inline-block"
          >
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  const stats = userStats || {
    solvedCount: 0,
    attemptedCount: 0,
    participatedCount: 0,
    accuracy: 0,
    solvedProblems: [],
    participatedContests: [],
  };

  const statItems = [
    {
      icon: <Code className="w-5 h-5 text-blue-500" />,
      label: "Problems Solved",
      value: stats.solvedCount || 0,
      color: "bg-blue-50 border-blue-100",
    },
    {
      icon: <Award className="w-5 h-5 text-purple-500" />,
      label: "Accuracy",
      value: `${stats.accuracy || 0}%`,
      color: "bg-purple-50 border-purple-100",
    },
    {
      icon: <Trophy className="w-5 h-5 text-yellow-500" />,
      label: "Contests Participated",
      value: stats.participatedCount || 0,
      color: "bg-yellow-50 border-yellow-100",
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
      label: "Member Since",
      value: formatDate(user.createdAt),
      color: "bg-green-50 border-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#3e4bc4] transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Cover */}
          <div className="h-32 bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6]"></div>

          <div className="relative px-6 pb-6">
            {/* Profile Image */}
            <div className="absolute -top-12 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                {user.profileImage &&
                user.profileImage !== "default-profile.png" ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6]">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="ml-28 pt-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <span className="text-sm text-gray-400">@{user.username}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {user.bio || "No bio yet"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <span className="capitalize">
                  Status: {user.emailStatus?.toLowerCase() || "active"}
                </span>
                <span>•</span>
                <span>Joined {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((item, index) => (
              <div
                key={index}
                className={`${item.color} border rounded-xl p-4 text-center transition-all hover:shadow-md`}
              >
                <div className="flex justify-center mb-2">{item.icon}</div>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Solved Problems */}
        {stats.solvedProblems && stats.solvedProblems.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-[#3e4bc4]" />
                <h2 className="text-lg font-bold text-gray-900">
                  Recently Solved
                </h2>
                <span className="text-sm text-gray-400">
                  ({stats.solvedProblems.length})
                </span>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {stats.solvedProblems.slice(0, 5).map((item) => (
                <Link
                  key={item.problem._id}
                  to={`/problems/${item.problem._id}`}
                  className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors">
                      {item.problem.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-400">
                        Solved: {formatDate(item.solvedAt)}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-400">
                        Language: {item.language || "unknown"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    #{item.problem.difficulty || "MEDIUM"}
                  </span>
                </Link>
              ))}
              {stats.solvedProblems.length > 5 && (
                <div className="px-6 py-3 text-center">
                  <Link
                    to={`/profile/${userId}/solved`}
                    className="text-sm text-[#3e4bc4] hover:underline"
                  >
                    View all {stats.solvedProblems.length} solved problems →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Participated Contests */}
        {stats.participatedContests &&
          stats.participatedContests.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-[#3e4bc4]" />
                  <h2 className="text-lg font-bold text-gray-900">
                    Participated Contests
                  </h2>
                  <span className="text-sm text-gray-400">
                    ({stats.participatedContests.length})
                  </span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {stats.participatedContests.slice(0, 5).map((item) => (
                  <Link
                    key={item.contest._id}
                    to={`/contests/${item.contest._id}`}
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors">
                        {item.contest.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.contest.status)}`}
                        >
                          {item.contest.status || "UPCOMING"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(item.contest.startDate)}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">
                      {item.score || 0} pts
                    </span>
                  </Link>
                ))}
                {stats.participatedContests.length > 5 && (
                  <div className="px-6 py-3 text-center">
                    <Link
                      to={`/profile/${userId}/contests`}
                      className="text-sm text-[#3e4bc4] hover:underline"
                    >
                      View all {stats.participatedContests.length} contests →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Additional Info */}
        {user.age && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Age: {user.age}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;