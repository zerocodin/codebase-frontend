import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, User, Code, Trophy } from "lucide-react";
import toast from "react-hot-toast";

import profileService from "../services/profile.Service";
import {
  ProfileHeader,
  ProfileStats,
  ProfileEdit,
  ProfileProblems,
  ProfileContests,
  ProfileActions,
} from "../components/profile";
import userProgressService from "../services/userProgress.Service";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userProgress, setUserProgress] = useState({
    solvedProblems: [],
    attemptedProblems: [],
    participatedContests: [],
    createdContests: [],
  });

  // Stats
  const [stats, setStats] = useState({
    problemsSolved: 0,
    contestsWon: 0,
    contestsParticipated: 0,
    accuracy: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchUserProgress();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await profileService.getProfile();
      if (response.success) {
        setUser(response.user);
      } else {
        toast.error(response.message || "Failed to fetch profile");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await userProgressService.getUserProgress();
      if (response.success) {
        const data = response.data;

        setUserProgress({
          solvedProblems: data.solvedProblems || [],
          attemptedProblems: data.attemptedProblems || [],
          participatedContests: data.participatedContests || [],
          createdContests: data.createdContests || [],
        });

        const solvedCount = data.solvedProblems?.length || 0;
        const attemptedCount = data.attemptedProblems?.length || 0;
        const totalAttempts = solvedCount + attemptedCount;
        const accuracy =
          totalAttempts > 0 ? (solvedCount / totalAttempts) * 100 : 0;

        setStats({
          problemsSolved: solvedCount,
          contestsWon: 0,
          contestsParticipated: data.participatedContests?.length || 0,
          totalAttempted: attemptedCount, // Pass attempted count
          accuracy: Math.round(accuracy),
        });
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const onUpdate = () => {
    fetchProfile();
    fetchUserProgress();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Profile not found
          </h2>
          <button
            onClick={() => navigate("/login")}
            className="text-[#3e4bc4] hover:underline mt-2"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ProfileHeader
          user={user}
          onUpdate={fetchProfile}
          onEdit={() => setShowEditModal(true)}
        />

        {/* Stats */}
        <div className="mt-6">
          <ProfileStats stats={stats} />
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Problems & Contests */}
          <div className="lg:col-span-2 space-y-6">
            <ProfileProblems solvedProblems={userProgress.solvedProblems} />

            <ProfileContests
              participatedContests={userProgress.participatedContests}
              createdContests={userProgress.createdContests}
              userId={user._id}
            />
          </div>

          {/* Right Column - Account Settings */}
          <div className="lg:col-span-1">
            <ProfileActions user={user} onUpdate={fetchProfile} />
          </div>
        </div>

        {showEditModal && (
          <ProfileEdit
            user={user}
            onClose={() => setShowEditModal(false)}
            onUpdate={fetchProfile}
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
