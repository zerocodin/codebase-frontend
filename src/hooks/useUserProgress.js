import { useState, useEffect } from "react";
import userProgressService from "../services/userProgress.Service";

export const useUserProgress = () => {
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [attemptedProblems, setAttemptedProblems] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProgress();
  }, []);

  const fetchUserProgress = async () => {
    try {
      const response = await userProgressService.getUserProgress();
      if (response.success) {
        const data = response.data;
        const solved = new Set(
          data.solvedProblems?.map((p) => p.problem?._id || p.problem) || [],
        );
        const attempted = new Set(
          data.attemptedProblems?.map((p) => p.problem?._id || p.problem) || [],
        );
        setSolvedProblems(solved);
        setAttemptedProblems(attempted);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProblemStatus = (problemId) => {
    if (solvedProblems.has(problemId)) {
      return "SOLVED";
    }
    if (attemptedProblems.has(problemId)) {
      return "ATTEMPTED";
    }
    return "UNTOUCHED";
  };

  return {
    solvedProblems,
    attemptedProblems,
    loading,
    getProblemStatus,
    refresh: fetchUserProgress,
  };
};
