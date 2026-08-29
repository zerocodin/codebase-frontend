import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  User,
  FileText,
  CheckCircle,
  Lock,
  Trophy,
} from "lucide-react";

import { useUserProgress } from "../../hooks/useUserProgress";

const CompletedContest = ({ contest, statusInfo ,stats}) => {
  const { getProblemStatus } = useUserProgress();

  const problemStatsMap = {};
  if (stats?.problemStats) {
    stats.problemStats.forEach((p) => {
      problemStatsMap[p.problemId] = p;
    });
  }

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

  return (
    <div>
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-blue-600 to-gray-700 p-6 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
              >
                {statusInfo.icon} {statusInfo.label}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {contest.name}
            </h1>
            <p className="text-white/80 max-w-2xl">{contest.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 text-center text-white">
              <div className="text-2xl font-bold">
                {contest.problems?.length || 0}
              </div>
              <div className="text-xs text-white/70">Problems</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div></div>
        <Link
          to={`/contests/${contest.id}/leaderboard`}
          className="flex items-center gap-2 px-4 py-2 bg-[#3e4bc4] text-white rounded-lg hover:bg-[#5a4bd1] transition-colors"
        >
          <Trophy className="w-4 h-4" />
          View Leaderboard
        </Link>
      </div>

      {/* Contest Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Calendar className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Date</span>
          </div>
          <p className="text-xs md:text-sm text-gray-800 font-medium truncate">
            {formatDate(contest.startDate)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Time</span>
          </div>
          <p className="text-xs md:text-sm text-gray-800 font-medium">
            {formatTime(contest.startDate)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <Clock className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Duration</span>
          </div>
          <p className="text-xs md:text-sm text-gray-800 font-medium">
            {formatDuration(contest.duration)}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-3 md:p-4">
          <div className="flex items-center gap-2 text-gray-500 mb-1">
            <User className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-[10px] md:text-sm font-medium">Ended</span>
          </div>
          <p className="text-xs md:text-sm text-gray-800 font-medium truncate">
            {formatTime(contest.endDate)}
          </p>
        </div>
      </div>

      {/* Problems Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
        <div className="px-4 py-3 bg-linear-to-r from-[#808bec] to-[#8B5CF6] border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3e4bc4]" />
            Problems ({contest.problems?.length || 0})
          </h3>
        </div>

        {contest.problems && contest.problems.length > 0 ? (
          <>
            <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-[#B3BFF5] border-b border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-5">Problem Name</div>
              <div className="col-span-2 text-center">Solved</div>
              <div className="col-span-2 text-center">Submissions</div>
              <div className="col-span-2 text-center">Accuracy</div>
            </div>

            {contest.problems.map((problem, index) => {
              const status = getProblemStatus(problem.id);
              const problemStats = problemStatsMap[problem.id] || {};

              return (
                <Link
                  key={problem.id}
                  to={`/problems/${problem.id}`}
                  className={`block transition-colors duration-150 border-b border-gray-100 last:border-0 ${
                    status === "SOLVED"
                      ? "bg-green-200 hover:bg-green-300"
                      : status === "ATTEMPTED"
                        ? "bg-red-100 hover:bg-red-200"
                        : "hover:bg-blue-50/40"
                  }`}
                >
                  <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
                    <div className="col-span-1 text-center text-sm font-medium text-gray-400">
                      {problem.order || index + 1}
                    </div>
                    <div className={"col-span-5 text-sm font-medium"}>
                      {problem.name}
                    </div>
                    <div className="col-span-2 text-center text-sm text-gray-600">
                      {problemStats.solvedCount || 0}
                    </div>
                    <div className="col-span-2 text-center text-sm text-gray-600">
                      {problemStats.submissions || 0}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="text-sm text-gray-600">
                        {problemStats.accuracy || "0%"}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-8 h-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                No problems available for this contest
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Created By Footer */}
      <div className="text-center bg-[#B3BFF5] text-sm text-black h-7 items-center justify-center pt-1 mt-4 rounded-b-md">
        Created by <span className="font-medium">{contest.createdBy}</span>
      </div>
    </div>
  );
};

export default CompletedContest;
