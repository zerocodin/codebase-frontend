import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  BookOpen,
  Star,
  Award,
  List,
  Code,
  Trophy,
} from "lucide-react";
import toast from "react-hot-toast";
import problemService from "../services/problem.Service";
import { useUserProgress } from "../hooks/useUserProgress";
import SubmissionsTab from "../components/submission/SubmissionTab";

import ChallengeCard from "../components/challenges/ChallengeCard";
import ChallengesTab from "../components/challenges/ChallengesTab";

const Problems = () => {
  const [searchParams, setSearchParams] = useSearchParams(); //Get URL params

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "problems";
  });

  // Problems state
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 30,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    difficulty: "",
    search: "",
  });

  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const { getProblemStatus } = useUserProgress();

  useEffect(() => {
    if (activeTab === "problems") {
      fetchProblems();
    }
  }, [filters, pagination.page, sortBy, sortOrder, activeTab]);

  // fetching all problem
  const fetchProblems = async () => {
    setLoading(true);
    try {
      const response = await problemService.getAllProblems({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
        sortBy,
        sortOrder,
      });

      if (response.success) {
        setProblems(response.data.problems || []);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message || "Failed to fetch problems");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setFilters({ ...filters, search: e.target.value });
    setPagination({ ...pagination, page: 1 });
  };

  // Update URL when tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleDifficultyChange = (difficulty) => {
    setFilters({ ...filters, difficulty });
    setPagination({ ...pagination, page: 1 });
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPagination({ ...pagination, page: 1 });
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      EASY: "bg-green-100 text-green-700 border-green-200",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
      HARD: "bg-red-100 text-red-700 border-red-200",
      EXPERT: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };

  const getDifficultyIcon = (difficulty) => {
    const icons = {
      EASY: "🟢",
      MEDIUM: "🟡",
      HARD: "🔴",
      EXPERT: "🟣",
    };
    return icons[difficulty] || "⚪";
  };

  const getRatingColor = (rating) => {
    if (!rating || rating === 0) return "text-gray-400";
    if (rating >= 2000) return "text-red-600";
    if (rating >= 1600) return "text-orange-500";
    if (rating >= 1200) return "text-yellow-600";
    if (rating >= 800) return "text-blue-500";
    return "text-green-500";
  };

  const getStarRating = (rating) => {
    if (!rating || rating === 0) return 0;
    if (rating >= 2000) return 5;
    if (rating >= 1600) return 4;
    if (rating >= 1200) return 3;
    if (rating >= 800) return 2;
    return 1;
  };

  const getRatingLabel = (rating) => {
    if (!rating || rating === 0) return "Unrated";
    if (rating >= 2000) return "Expert";
    if (rating >= 1600) return "Advanced";
    if (rating >= 1200) return "Intermediate";
    if (rating >= 800) return "Beginner";
    return "Novice";
  };

  const tabs = [
    { id: "problems", label: "Problems", icon: <List className="w-4 h-4" /> },
    {
      id: "submissions",
      label: "Submissions",
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: <Trophy className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#3e4bc4]" />
            <h1 className="text-2xl font-bold text-gray-800">Problems</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white rounded-lg shadow-sm border border-gray-200/80 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#3e4bc4] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "problems" && (
          <>
            {/* Filters Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 p-2.5 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex-1 min-w-50 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={filters.search}
                    onChange={handleSearch}
                    className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-[#3e4bc4] focus:border-[#3e4bc4] outline-none transition-all bg-gray-50/50"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {["ALL", "EASY", "MEDIUM", "HARD", "EXPERT"].map((diff) => (
                    <button
                      key={diff}
                      onClick={() =>
                        handleDifficultyChange(diff === "ALL" ? "" : diff)
                      }
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                        filters.difficulty === diff ||
                        (diff === "ALL" && !filters.difficulty)
                          ? "bg-[#3e4bc4] text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#3e4bc4] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 text-sm">Loading...</p>
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && problems.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200/80">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-7 h-7 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700">
                    No problems found
                  </h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or filters
                  </p>
                </div>
              </div>
            )}

            {/* Problems Table */}
            {!loading && problems.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50/90 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <div className="col-span-1 text-center">#</div>
                  <div
                    className="col-span-5 cursor-pointer hover:text-[#3e4bc4] flex items-center gap-1"
                    onClick={() => handleSort("title")}
                  >
                    Problem
                    {sortBy === "title" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                  <div
                    className="col-span-2 cursor-pointer hover:text-[#3e4bc4] flex items-center justify-center gap-1"
                    onClick={() => handleSort("difficulty")}
                  >
                    Difficulty
                    {sortBy === "difficulty" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                  <div
                    className="col-span-2 cursor-pointer hover:text-[#3e4bc4] flex items-center justify-center gap-1"
                    onClick={() => handleSort("rating")}
                  >
                    Rating
                    {sortBy === "rating" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                  <div
                    className="col-span-1.5 cursor-pointer hover:text-[#3e4bc4] flex items-center gap-1 justify-end"
                    onClick={() => handleSort("solvedCount")}
                  >
                    Solved
                    {sortBy === "solvedCount" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="w-3 h-3" />
                      ) : (
                        <ChevronDown className="w-3 h-3" />
                      ))}
                  </div>
                  <div className="col-span-0.5"></div>
                </div>

                {/* Problem Rows */}
                {problems.map((problem, index) => {
                  const rating = problem.rating || 0;
                  const starCount = getStarRating(rating);
                  const ratingLabel = getRatingLabel(rating);
                  const ratingColor = getRatingColor(rating);
                  const status = getProblemStatus(problem._id);

                  return (
                    <Link
                      key={problem._id}
                      to={`/problems/${problem._id}`}
                      className={`block transition-colors duration-150 border-b border-gray-100 last:border-0 ${
                        status === "SOLVED"
                          ? "bg-green-200 hover:bg-green-300"
                          : status === "ATTEMPTED"
                            ? "bg-red-100 hover:bg-red-200"
                            : "hover:bg-blue-50/40"
                      }`}
                    >
                      <div className="grid grid-cols-12 gap-2 px-4 py-2 items-center">
                        <div className="col-span-1 text-center">
                          <span className="text-sm text-gray-400">
                            {(pagination.page - 1) * pagination.limit +
                              index +
                              1}
                          </span>
                        </div>

                        <div className="col-span-5">
                          <div className="flex flex-col gap-0.5">
                            <span className={"text-sm font-medium"}>
                              {problem.title}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {problem.tags &&
                                problem.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100/50"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              {problem.tags && problem.tags.length > 3 && (
                                <span className="text-[10px] text-gray-400">
                                  +{problem.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getDifficultyColor(problem.difficulty)}`}
                          >
                            {getDifficultyIcon(problem.difficulty)}{" "}
                            {problem.difficulty}
                          </span>
                        </div>

                        <div className="col-span-2 flex items-center justify-center">
                          {rating > 0 ? (
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1">
                                <Award
                                  className={`w-3.5 h-3.5 ${ratingColor}`}
                                />
                                <span
                                  className={`text-sm font-bold ${ratingColor}`}
                                >
                                  {rating}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-2.5 h-2.5 ${
                                      i < starCount
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-200 text-gray-200"
                                    }`}
                                  />
                                ))}
                                <span className="text-[9px] text-gray-400 ml-1">
                                  {ratingLabel}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">
                              Unrated
                            </span>
                          )}
                        </div>

                        <div className="col-span-1.5 flex items-center justify-end gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {problem.solvedCount || 0}
                          </span>
                        </div>

                        <div className="col-span-0.5"></div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {!loading && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-5">
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page - 1 })
                  }
                  disabled={pagination.page === 1}
                  className="px-3.5 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(pagination.pages, 5) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() =>
                            setPagination({ ...pagination, page: pageNum })
                          }
                          className={`w-8 h-8 text-sm rounded-md transition-all duration-200 ${
                            pagination.page === pageNum
                              ? "bg-[#3e4bc4] text-white shadow-sm"
                              : "hover:bg-gray-100 text-gray-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                </div>

                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: pagination.page + 1 })
                  }
                  disabled={pagination.page === pagination.pages}
                  className="px-3.5 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}

            {/* Stats Footer */}
            {!loading && problems.length > 0 && (
              <div className="mt-3 text-center text-xs text-gray-400">
                Showing {(pagination.page - 1) * pagination.limit + 1} -{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </div>
            )}
          </>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && <SubmissionsTab />}

        {/* Challenges Tab */}
        {activeTab === "challenges" && <ChallengesTab/>}
      </div>

    </div>
  );
};

export default Problems;
