import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Trophy,
  ArrowLeft,
  Play,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";

import contestService from "../../services/contest.Service";
import UpcomingContest from "./UpcomingContest";
import RunningContest from "./RunningContest";
import CompletedContest from "./CompletedContest";

const ContestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchContestDetails();
  }, [id]);

  const fetchContestDetails = async () => {
    setLoading(true);
    try {
      const response = await contestService.getContestById(id);
      if (response.success) {
        setContest(response.data);

        await fetchContestStats()
      } else {
        toast.error(response.message || "Failed to fetch contest");
        navigate("/contests");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load contest");
      navigate("/contests");
    } finally {
      setLoading(false);
    }
  };

  const fetchContestStats = async () => {
    setLoadingStats(true);
    try {
      const response = await contestService.getContestStats(id);
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch contest stats:", error);
    } finally {
      setLoadingStats(false);
    }
  };


  const handleRegistrationChange = () => {
    fetchContestDetails();
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
          <p className="text-gray-500">Loading contest...</p>
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
          <Link
            to="/contests"
            className="text-[#3e4bc4] hover:underline mt-2 inline-block"
          >
            Back to Contests
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(contest.status);
  const isRunning = contest.status === "ONGOING";
  const isCompleted = contest.status === "COMPLETED";
  const isUpcoming = contest.status === "UPCOMING";

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {isUpcoming && (
          <UpcomingContest
            contest={contest}
            statusInfo={statusInfo}
            onRegistrationChange={handleRegistrationChange}
          />
        )}

        {isRunning && (
          <RunningContest
            contest={contest}
            statusInfo={statusInfo}
            stats={stats}
          />
        )}

        {isCompleted && (
          <CompletedContest
            contest={contest}
            statusInfo={statusInfo}
            stats={stats}
          />
        )}
      </div>
    </div>
  );
};

export default ContestDetails;
