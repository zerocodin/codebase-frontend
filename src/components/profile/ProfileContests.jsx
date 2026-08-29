import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy, Calendar, Users, ChevronDown, Plus } from "lucide-react";
import contestService from "../../services/contest.Service";

const ProfileContests = ({ participatedContests = [], userId }) => {
  const [expanded, setExpanded] = useState(false);
  const [createdExpanded, setCreatedExpanded] = useState(false);
  const [createdContests, setCreatedContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchCreatedContests();
    }
  }, [userId]);

  const fetchCreatedContests = async () => {
    try {
      const response = await contestService.getContestByUserId(userId);
      if (response.success) {
        setCreatedContests(response.data || []);
      }
    } catch (error) {
      console.error("Error fetching created contests:", error);
    } finally {
      setLoading(false);
    }
  };

  const sortedParticipated = [...participatedContests].sort((a, b) => {
    const dateA = new Date(a.contest?.startDate || 0);
    const dateB = new Date(b.contest?.startDate || 0);
    return dateB - dateA;
  });

  const visibleCreatedContests = createdExpanded
    ? createdContests
    : createdContests.slice(0, 3);

  const visibleParticipated = expanded
    ? sortedParticipated
    : sortedParticipated.slice(0, 3);

  const getStatusColor = (status) => {
    const colors = {
      ONGOING: "bg-green-100 text-green-700",
      UPCOMING: "bg-blue-100 text-blue-700",
      COMPLETED: "bg-gray-100 text-gray-600",
      CANCELLED: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Created Contests */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#3e4bc4]" />
              <h2 className="text-lg font-bold text-gray-900">
                Created Contests
              </h2>
              <span className="text-sm text-gray-400">
                ({createdContests.length})
              </span>
            </div>
            {createdContests.length > 3 && (
              <button
                onClick={() => setCreatedExpanded(!createdExpanded)}
                className="text-sm text-[#3e4bc4] hover:underline flex items-center gap-1"
              >
                {createdExpanded ? "Show Less" : "View All"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${createdExpanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        ) : createdContests.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {visibleCreatedContests.map((contest) => (
              <Link
                key={contest.contestId}
                to={`/contests/${contest.contestId}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors">
                      {contest.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(contest.status)}`}
                      >
                        {contest.status || "UPCOMING"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(contest.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">
                      {contest.duration || 0} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No contests created yet</p>
            <Link
              to="/create-contest"
              className="inline-flex items-center gap-1 mt-2 text-sm text-[#3e4bc4] hover:underline"
            >
              <Plus className="w-4 h-4" />
              Create your first contest
            </Link>
          </div>
        )}
      </div>

      {/*Participated Contests */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3e4bc4]" />
              <h2 className="text-lg font-bold text-gray-900">
                Participated Contests
              </h2>
              <span className="text-sm text-gray-400">
                ({participatedContests.length})
              </span>
            </div>
            {participatedContests.length > 3 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm text-[#3e4bc4] hover:underline flex items-center gap-1"
              >
                {expanded ? "Show Less" : "View All"}
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                />
              </button>
            )}
          </div>
        </div>

        {participatedContests.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {visibleParticipated.map((item) => (
              <Link
                key={item._id || item.contest._id}
                to={`/contests/${item.contest._id}`}
                className="block px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors">
                      {item.contest.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(item.contest.status)}`}
                      >
                        {item.contest.status || "UPCOMING"}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.contest.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No contests participated yet</p>
            <p className="text-sm text-gray-400">
              Join a contest to start competing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContests;
