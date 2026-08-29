import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  Medal,
  User,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  Users,
  Award,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";

import leaderboardService from "../../services/leaderboard.Service";

const Leaderboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [id]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await leaderboardService.getContestLeaderboard(id);
      if (response.success) {
        setLeaderboard(response.data);
      } else {
        toast.error(response.message || "Failed to fetch leaderboard");
        navigate(`/contests/${id}`);
      }
    } catch (error) {
      toast.error(error.message || "Failed to load leaderboard");
      navigate(`/contests/${id}`);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    } else if (rank === 2) {
      return <Medal className="w-5 h-5 text-gray-400" />;
    } else if (rank === 3) {
      return <Medal className="w-5 h-5 text-amber-700" />;
    }
    return (
      <span className="w-5 h-5 text-center font-bold text-gray-400">
        #{rank}
      </span>
    );
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "bg-yellow-50 border-yellow-200";
    if (rank === 2) return "bg-gray-50 border-gray-200";
    if (rank === 3) return "bg-amber-50 border-amber-200";
    return "hover:bg-gray-50/50";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!leaderboard) {
    return null;
  }

  const {
    contestName,
    status,
    totalParticipants,
    problemDetails,
    participants,
  } = leaderboard;

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          </div>
        </div>

        {/* Contest Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{contestName}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-sm px-2 py-0.5 rounded-full border ${
                    status === "COMPLETED"
                      ? "bg-gray-100 text-gray-600 border-gray-200"
                      : "bg-green-100 text-green-600 border-green-200"
                  }`}
                >
                  {status}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {totalParticipants} participants
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#3e4bc4]" />
              <span className="text-sm text-gray-500">
                Points: Problem N = N × 10
              </span>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
          {/* Problem Headers */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header Row */}
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50/90 border-b border-gray-200">
                <div className="col-span-1 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Rank
                </div>
                <div className="col-span-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Participant
                </div>
                <div className="col-span-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Solved Problems
                </div>
                <div className="col-span-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Score
                </div>
                <div className="col-span-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Wrong Attempts
                </div>
              </div>

              {/* Problem Labels Row */}
              <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50/50 border-b border-gray-100">
                <div className="col-span-1"></div>
                <div className="col-span-3"></div>
                <div className="col-span-4 flex justify-center gap-3">
                  {problemDetails.map((p) => (
                    <div
                      key={p.order}
                      className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-gray-500 bg-gray-100 rounded-full"
                      title={`Problem ${p.order} (${p.points} pts)`}
                    >
                      {p.order}
                    </div>
                  ))}
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-2"></div>
              </div>

              {/* Participant Rows */}
              {participants.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Users className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">No participants registered</p>
                  </div>
                </div>
              ) : (
                participants.map((participant) => (
                  <div
                    key={participant.user._id}
                    className={`grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${getRankColor(participant.rank)}`}
                  >
                    {/* Rank */}
                    <div className="col-span-1 flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        {getRankIcon(participant.rank)}
                      </div>
                    </div>

                    {/* User */}
                    <div className="col-span-3 flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6] flex items-center justify-center text-white text-sm font-bold shrink-0">
                        {participant.user.name?.charAt(0) ||
                          participant.user.username?.charAt(0) ||
                          "U"}
                      </div>
                      <div className="truncate">
                        {/* username clickable */}
                        <Link
                          to={`/profile/${participant.user._id}`}
                          className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors truncate block"
                        >
                          {participant.user.name || participant.user.username}
                        </Link>
                        <p className="text-xs text-gray-400 truncate">
                          @{participant.user.username}
                        </p>
                      </div>
                    </div>

                    {/* Solved Problems */}
                    <div className="col-span-4 flex items-center justify-center gap-3">
                      {problemDetails.map((p) => (
                        <div
                          key={p.order}
                          className="w-8 h-8 flex items-center justify-center"
                        >
                          {participant.solved.includes(p.order) ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-gray-300" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Score */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-lg font-bold text-[#3e4bc4]">
                        {participant.score}
                      </span>
                    </div>

                    {/* Wrong Attempts */}
                    <div className="col-span-2 flex items-center justify-center">
                      <span
                        className={`text-sm font-medium ${
                          participant.wrongAttempts > 0
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {participant.wrongAttempts || 0}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 text-center text-xs text-gray-400">
          Points awarded: Each problem solved gives order × 10 points. Wrong
          answers deduct 3 points.
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;