import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Award,
  ArrowLeft,
  AlertCircle,
  Lock,
  Shield,
  Code,
  CheckCircle,
  Loader2,
  XCircle,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";
import contestService from "../../services/contest.Service";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const UpcomingContest = ({ contest, statusInfo, onRegistrationChange }) => {
  const { user } = useAuth();
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [unregistering, setUnregistering] = useState(false);
  const [participantsCount, setParticipantsCount] = useState(0);

  useEffect(() => {
    if (user && contest?.participants) {
      const registered = contest.participants.some(
        (p) =>
          p.user?._id?.toString() === user._id?.toString() ||
          p.user?.toString() === user._id?.toString(),
      );
      setIsRegistered(registered);

      setParticipantsCount(contest.participants.length);
    } else {
      setIsRegistered(false);
      if (contest?.participants) {
        setParticipantsCount(contest.participants.length);
      } else {
        setParticipantsCount(0);
      }
    }
  }, [user, contest]);

  const handleRegister = async () => {
    if (!user) {
      toast.error("Please login to register for this contest");
      return;
    }

    setRegistering(true);
    try {
      const response = await contestService.registerForContest(contest.id);
      toast.success(response.message || "Successfully registered!");

      setIsRegistered(true);
      setParticipantsCount((prev) => prev + 1);

      if (onRegistrationChange) {
        await onRegistrationChange();
      }
    } catch (error) {
      toast.error(error.message || "Failed to register");
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {

    setUnregistering(true);
    try {
      const response = await contestService.unregisterFromContest(contest.id);
      toast.success(response.message || "Successfully unregistered!");

      setIsRegistered(false);
      setParticipantsCount((prev) => prev - 1);

      if (onRegistrationChange) {
        await onRegistrationChange();
      }
    } catch (error) {
      toast.error(error.message || "Failed to unregister");
    } finally {
      setUnregistering(false);
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

  return (
    <div>
      <Link
        to={"/contests"}
        className="flex items-center gap-2 text-gray-600 hover:text-[#3e4bc4] transition-colors mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </Link>

      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-[#3e4bc4] to-[#8B5CF6] p-8 mb-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
            >
              {statusInfo.icon} {statusInfo.label}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
              <Users className="w-3 h-3 inline mr-1" />
              {participantsCount} registered
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {contest.name}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl">
            {contest.description}
          </p>

          {/* ✅ Toggle Register/Unregister Button */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {isRegistered ? (
              <button
                onClick={handleUnregister}
                disabled={unregistering}
                className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {unregistering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Unregistering...
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Unregister
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={registering}
                className="px-8 py-3 bg-white text-[#3e4bc4] font-semibold rounded-lg hover:scale-[1.02] hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {registering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <Users className="w-5 h-5" />
                    Register Now
                  </>
                )}
              </button>
            )}

            <span className="text-white/70 text-sm">
              {isRegistered ? (
                <span className="flex items-center gap-1 text-green-300">
                  <CheckCircle className="w-4 h-4" />
                  You are registered ✓
                </span>
              ) : (
                <span>🏆 Open for registration</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Contest Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
            <span className="text-sm font-medium">Time</span>
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
            <Award className="w-4 h-4" />
            <span className="text-sm font-medium">Type</span>
          </div>
          <p className="text-gray-800 font-medium">
            {contest.contestType || "PRIVATE"}
          </p>
        </div>
      </div>

      {/* Rules Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#3e4bc4]" />
          Contest Rules
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              No cheating or plagiarism will be tolerated
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              Copy-pasting code from external sources is strictly prohibited
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Users className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              Each participant must solve problems individually
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              Submissions after the contest ends will not be considered
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Code className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              All code must be original and written during the contest
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              For Successfully submitted points = problem * 10
            </span>
          </li>
          <li className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-blue-500 mt-0.5" />
            <span className="text-gray-600">
              For every wrong submission points = points - 3
            </span>
          </li>
        </ul>
      </div>

      <div className="text-center bg-[#B3BFF5] text-sm text-black h-7 items-center justify-center pt-1 mt-4 rounded-b-md">
        Created by <span className="font-medium">{contest.createdBy}</span>
      </div>
    </div>
  );
};

export default UpcomingContest;