import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trophy,
  Calendar,
  Users,
  ChevronRight,
  Loader2,
  Eye,
  Edit,
  Trash2,
  Archive,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../components/contexts/AuthContext";
import contestService from "../services/contest.Service";

const Settings = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contests, setContests] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (user && user._id) {
      fetchContests();
    }
  }, [user]);

  const fetchContests = async () => {
    setLoading(true);
    try {
      if (!user || !user._id) {
        toast.error("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await contestService.getContestByUserId(user._id);

      if (response.success) {
        setContests(response.data || []);
      } else {
        toast.error(response.message || "Failed to fetch contests");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load contests");
      console.error("Fetch contests error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContest = async (contestId, contestName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${contestName}" permanently? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(contestId);
    try {
      const response = await contestService.deleteContest(contestId);

      if (response.success) {
        toast.success(response.message || "Contest deleted successfully");
        fetchContests();
      } else {
        toast.error(response.message || "Failed to delete contest");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete contest");
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      UPCOMING: "bg-blue-100 text-blue-700",
      ONGOING: "bg-green-100 text-green-700",
      COMPLETED: "bg-gray-100 text-gray-600",
      CANCELLED: "bg-red-100 text-red-700",
      ARCHIVED: "bg-gray-200 text-gray-500",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">
            {authLoading ? "Authenticating..." : "Loading your contests..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500">
                Manage your contests and account settings
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/create-contest")}
            className="px-4 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Contest
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#3e4bc4]" />
              <h2 className="text-lg font-bold text-gray-900">
                Created Contests
              </h2>
              <span className="text-sm text-gray-400">({contests.length})</span>
            </div>
          </div>

          {contests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {contests.map((contest) => (
                <div
                  key={contest.contestId}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-sm font-semibold text-gray-800">
                          {contest.name}
                        </h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(contest.status)}`}
                        >
                          {contest.status || "UPCOMING"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(contest.startDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {contest.participants?.length || 0} participants
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            Duration: {formatDuration(contest.duration)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/contests-data/${contest.contestId}`}
                        className="p-2 text-gray-400 hover:text-[#3e4bc4] transition-colors"
                        title="View Contest"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteContest(contest.contestId, contest.name)
                        }
                        disabled={deletingId === contest.contestId}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete Contest"
                      >
                        {deletingId === contest.contestId ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">
                  No contests created yet
                </h3>
                <p className="text-sm text-gray-500">
                  Create your first contest to get started
                </p>
                <button
                  onClick={() => navigate("/create-contest")}
                  className="mt-2 px-4 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Contest
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;