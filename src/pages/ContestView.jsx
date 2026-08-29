import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Trophy,
  Users,
  FileText,
  Code,
  Award,
  Loader2,
  CheckCircle,
  XCircle,
  Play,
  Plus,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import contestService from "../services/contest.Service";
import problemService from "../services/problem.Service";

const ContestView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingProblemId, setDeletingProblemId] = useState(null);

  useEffect(() => {
    fetchContestDetails();
  }, [id]);

  const fetchContestDetails = async () => {
    setLoading(true);
    try {
      const response = await contestService.getContestById(id);
      if (response.success) {
        setContest(response.data);
      } else {
        toast.error(response.message || "Failed to fetch contest");
        navigate("/settings");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load contest");
      navigate("/settings");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProblem = async (problemId, problemName, id) => {
    if (contest.problems.length <= 1) {
      toast.error("You must need to set at least one problem");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete "${problemName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingProblemId(problemId);
    try {
      const response = await problemService.deleteProblem(problemId);

      if (response.success) {
        toast.success(response.message || "Problem deleted successfully!");
        fetchContestDetails();
      } else {
        toast.error(response.message || "Failed to delete problem");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete problem");
      console.error("Delete problem error:", error);
    } finally {
      setDeletingProblemId(null);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ONGOING: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <Play className="w-4 h-4" />,
        label: "Live Now",
      },
      UPCOMING: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Clock className="w-4 h-4" />,
        label: "Upcoming",
      },
      COMPLETED: {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Completed",
      },
      CANCELLED: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Cancelled",
      },
    };
    return statusMap[status] || statusMap.COMPLETED;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading contest details...</p>
        </div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Contest not found
          </h2>
          <button
            onClick={() => navigate("/settings")}
            className="mt-4 text-[#3e4bc4] hover:underline"
          >
            Back to Settings
          </button>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(contest.status);
  const isCompleted = contest.status === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#3e4bc4] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Settings</span>
          </button>
          <div className="flex items-center gap-3">
            <span
              className={`px-4 py-1.5 rounded-full text-sm font-medium border flex items-center gap-2 ${statusInfo.color}`}
            >
              {statusInfo.icon}
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Contest Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6] p-8 mb-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {contest.name}
            </h1>
            <p className="text-white/80 text-lg max-w-2xl">
              {contest.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-white/70 text-sm">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                Created by {contest.createdBy}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                {contest.contestType || "PRIVATE"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Date</span>
            </div>
            <p className="text-gray-800 font-medium">
              {formatDate(contest.startDate)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Start Time</span>
            </div>
            <p className="text-gray-800 font-medium">
              {formatTime(contest.startDate)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <p className="text-gray-800 font-medium">
              {formatDuration(contest.duration)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-4">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Problems</span>
            </div>
            <p className="text-gray-800 font-medium">
              {contest.problems?.length || 0} problems
            </p>
          </div>
        </div>

        {/* Problems List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-[#3e4bc4]" />
              <h2 className="text-lg font-bold text-gray-900">Problems</h2>
              <span className="text-sm text-gray-400">
                ({contest.problems?.length || 0})
              </span>
            </div>
          </div>

          {contest.problems && contest.problems.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {contest.problems.map((problem, index) => (
                <div
                  key={problem.id}
                  className="px-6 py-4 hover:bg-gray-50  transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-400 w-8">
                      {problem.order || index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {problem.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {!isCompleted && (
                      <div className="flex gap-4">
                        <Link to={`/problems/${problem.id}/edit`}>
                          <Edit className="w-4 h-4 hover:text-blue-600" />
                        </Link>
                        <button onClick={() => handleDeleteProblem(problem.id, problem.name)}>
                          <Trash2
                            className="w-4 h-4 hover:text-red-500
                          "
                          />
                        </button>
                      </div>
                    )}
                    <Link
                      to={`/problems/${problem.id}`}
                      className="text-sm text-[#3e4bc4] hover:underline"
                    >
                      View Problem →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Code className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">
                  No problems added yet
                </h3>
                <p className="text-sm text-gray-500">
                  Add problems to this contest to get started
                </p>
              </div>
            </div>
          )}
        </div>

        {!isCompleted && (
          <div className="mt-6 flex gap-3">
            <Link
              to={`/contests/${id}/edit`}
              className="px-6 py-2.5 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Edit Contest
            </Link>
            <Link
              to={`/contests/${id}/create-problem`}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Problem
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestView;
