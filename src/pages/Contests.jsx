import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Trophy,
  User,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  CalendarDays,
  History,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import contestService from "../services/contest.Service";

const Contests = () => {
  const [contests, setContests] = useState({
    running: [],
    upcoming: [],
    previous: [],
  });
  const [loading, setLoading] = useState({
    running: true,
    upcoming: true,
    previous: true,
  });

  useEffect(() => {
    fetchAllContests();
  }, []);

  const fetchAllContests = async () => {
    await Promise.all([
      fetchUpcomingContests(),
      fetchOngoingContests(),
      fetchCompletedContests(),
    ]);
  };

  const fetchUpcomingContests = async () => {
    setLoading((prev) => ({ ...prev, upcoming: true }));
    try {
      const response = await contestService.getUpcomingContests();
      if (response.success) {

        const sortedData = (response.data || []).sort((a, b) => {
          return (
            new Date(a.date || a.startDate) - new Date(b.date || b.startDate)
          );
        });
        setContests((prev) => ({
          ...prev,
          upcoming: sortedData || [],
        }));
      } else {
        toast.error(response.message || "Failed to fetch upcoming contests");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load upcoming contests");
      console.error("Fetch upcoming contests error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, upcoming: false }));
    }
  };

  const fetchOngoingContests = async () => {
    setLoading((prev) => ({ ...prev, running: true }));
    try {
      const response = await contestService.getOngoingContests();
      if (response.success) {
                const sortedData = (response.data || []).sort((a, b) => {
                  return (
                    new Date(a.date || a.startDate) -
                    new Date(b.date || b.startDate)
                  );
                });
        
        setContests((prev) => ({
          ...prev,
          running: sortedData || [],
        }));
      } else {
        toast.error(response.message || "Failed to fetch ongoing contests");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load ongoing contests");
      console.error("Fetch ongoing contests error:", error);
    } finally {
      setLoading((prev) => ({ ...prev, running: false }));
    }
  };

  const fetchCompletedContests = async () => {
    setLoading((prev) => ({ ...prev, previous: true }));
    try {
      const response = await contestService.getCompletedContests();
      if (response.success) {
        const sortedData = (response.data || []).sort((a, b) => {
          return (
            new Date(b.date || b.startDate) - new Date(a.date || a.startDate)
          );
        });
        setContests((prev) => ({
          ...prev,
          previous: sortedData || [],
        }));
      } else {
        toast.error(response.message || "Failed to fetch completed contests");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load completed contests");
    } finally {
      setLoading((prev) => ({ ...prev, previous: false }));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
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
    if (!minutes) return "N/A";
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ONGOING: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "ONGOING",
      },
      UPCOMING: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "UPCOMING",
      },
      COMPLETED: {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "COMPLETED",
      },
    };
    return statusMap[status] || statusMap.COMPLETED;
  };

  // Contest Card Component
  const ContestCard = ({ contest, index, statusType }) => {
    const statusInfo = getStatusBadge(contest.status || statusType);

    return (
      <Link
        to={`/contests/${contest.contestId || contest._id}`}
        className="block hover:bg-blue-50/40 transition-colors duration-150 border-b border-gray-100 last:border-0"
      >
        <div className="grid grid-cols-12 gap-2 px-3 py-2.5 md:px-4 md:py-3 items-center text-sm">
          <div className="col-span-1 text-center">
            <span className="text-xs md:text-sm font-medium text-gray-400">
              {index + 1}
            </span>
          </div>

          <div className="col-span-3 md:col-span-3">
            <span className="text-xs md:text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors line-clamp-1">
              {contest.name}
            </span>
          </div>

          <div className="hidden md:flex col-span-2 items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs md:text-sm text-gray-600 truncate">
              {contest.createdBy?.name ||
                contest.createdBy?.username ||
                "Unknown"}
            </span>
          </div>

          <div className="col-span-2 md:col-span-2 flex items-center gap-1">
            <Calendar className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
              {formatDate(contest.date || contest.startDate)}
            </span>
          </div>

          <div className="col-span-2 md:col-span-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
              {formatTime(contest.date || contest.startDate)}
            </span>
          </div>

          <div className="col-span-2 md:col-span-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400 shrink-0" />
            <span className="text-xs md:text-sm text-gray-600 whitespace-nowrap">
              {formatDuration(contest.duration)}
            </span>
          </div>

          <div className="col-span-1 flex items-center justify-end gap-1 md:gap-2">
            <span
              className={`px-1.5 md:px-2.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-medium border flex items-center gap-0.5 md:gap-1 whitespace-nowrap ${statusInfo.color}`}
            >
              {statusInfo.icon}
              <span className="hidden xs:inline">
                {contest.status || statusType || "UPCOMING"}
              </span>
            </span>
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-300 shrink-0" />
          </div>
        </div>
      </Link>
    );
  };

  // Section Component
  const ContestSection = ({
    title,
    icon: Icon,
    contests: contestList,
    badgeColor,
    emptyMessage,
    emptyIcon: EmptyIcon,
    loading: isLoading,
    statusType,
  }) => {
    const hasContests = contestList && contestList.length > 0;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Icon className={`w-5 h-5 ${badgeColor}`} />
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-400">
            ({contestList?.length || 0})
          </span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden">
          {isLoading ? (
            <div className="py-8 md:py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-[#3e4bc4] animate-spin" />
                <p className="text-sm text-gray-500">
                  Loading {title.toLowerCase()}...
                </p>
              </div>
            </div>
          ) : hasContests ? (
            <>
              <div className="grid grid-cols-12 gap-2 px-3 py-2 md:px-4 md:py-2.5 bg-gray-50/90 border-b border-gray-200 text-[10px] md:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-3 md:col-span-3">Contest Name</div>
                <div className="hidden md:block col-span-2">Created By</div>
                <div className="col-span-2 md:col-span-2">Date</div>
                <div className="col-span-2 md:col-span-1.5">Time</div>
                <div className="col-span-2 md:col-span-1.5">Duration</div>
                <div className="col-span-1 text-right">Status</div>
              </div>

              {contestList.map((contest, index) => (
                <ContestCard
                  key={contest.contestId || contest._id}
                  contest={contest}
                  index={index}
                  statusType={statusType}
                />
              ))}
            </>
          ) : (
            /* Empty State */
            <div className="py-8 md:py-12 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  {EmptyIcon ? (
                    <EmptyIcon className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  ) : (
                    <Trophy className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
                  )}
                </div>
                <p className="text-sm md:text-base text-gray-500">
                  {emptyMessage || `No ${title.toLowerCase()} available`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50/80 py-4 md:py-6">
      <div className="max-w-7xl mx-auto px-3 md:px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 md:w-6 md:h-6 text-[#3e4bc4]" />
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Contests
            </h1>
          </div>
        </div>

        <>
          {/* Running Contests */}
          <ContestSection
            title="Running Contests"
            icon={Play}
            contests={contests.running}
            badgeColor="text-green-500"
            emptyMessage="No contests running at the moment"
            emptyIcon={Play}
            loading={loading.running}
            statusType="ONGOING"
          />

          {/* Upcoming Contests */}
          <ContestSection
            title="Upcoming Contests"
            icon={CalendarDays}
            contests={contests.upcoming}
            badgeColor="text-blue-500"
            emptyMessage="No upcoming contests scheduled"
            emptyIcon={CalendarDays}
            loading={loading.upcoming}
            statusType="UPCOMING"
          />

          {/* Previous Contests */}
          <ContestSection
            title="Previous Contests"
            icon={History}
            contests={contests.previous}
            badgeColor="text-gray-500"
            emptyMessage="No previous contests found"
            emptyIcon={History}
            loading={loading.previous}
            statusType="COMPLETED"
          />
        </>
      </div>
    </div>
  );
};

export default Contests;
