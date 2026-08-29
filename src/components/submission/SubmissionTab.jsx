import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Code, CheckCircle, XCircle, Loader2, Eye } from "lucide-react";
import toast from "react-hot-toast";

import submissionService from "../../services/submission.Service";

const SubmissionsTab = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const [filters, setFilters] = useState({
    status: "",
    problemId: "",
  });

  useEffect(() => {
    fetchSubmissions();
  }, [pagination.page, filters]);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const response = await submissionService.getUserSubmissions({
        page: pagination.page,
        limit: pagination.limit,
        status: filters.status || undefined,
        problemId: filters.problemId || undefined,
      });

      if (response.success) {
        setSubmissions(response.data.submissions || []);
        setPagination(response.data.pagination);
      } else {
        toast.error(response.message || "Failed to fetch submissions");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ACCEPTED: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-3 h-3" />,
        label: "Accepted",
      },
      WRONG_ANSWER: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Wrong Answer",
      },
      RUNTIME_ERROR: {
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Runtime Error",
      },
      TIME_LIMIT_EXCEEDED: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "TLE",
      },
      COMPILATION_ERROR: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <XCircle className="w-3 h-3" />,
        label: "Compilation Error",
      },
      PENDING: {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
        label: "Pending",
      },
      RUNNING: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Loader2 className="w-3 h-3 animate-spin" />,
        label: "Running",
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <select
          value={filters.status}
          onChange={(e) => {
            setFilters({ ...filters, status: e.target.value });
            setPagination({ ...pagination, page: 1 });
          }}
          className="px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:ring-1 focus:ring-[#3e4bc4] focus:border-[#3e4bc4] outline-none bg-white"
        >
          <option value="">All Status</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="WRONG_ANSWER">Wrong Answer</option>
          <option value="RUNTIME_ERROR">Runtime Error</option>
          <option value="TIME_LIMIT_EXCEEDED">TLE</option>
          <option value="COMPILATION_ERROR">Compilation Error</option>
          <option value="PENDING">Pending</option>
        </select>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#3e4bc4] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading submissions...</p>
          </div>
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200/80">
          <div className="flex flex-col items-center gap-3">
            <Code className="w-14 h-14 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-700">
              No submissions yet
            </h3>
            <p className="text-sm text-gray-500">
              Start solving problems to see your submissions here
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50/90 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-1 text-center">#</div>
              <div className="col-span-3">Problem</div>
              <div className="col-span-2 text-center">Language</div>
              <div className="col-span-2 text-center">Status</div>
              <div className="col-span-2 text-center">Time</div>
              <div className="col-span-1 text-center">Code</div>
            </div>

            {submissions.map((submission, index) => {
              const statusInfo = getStatusBadge(submission.status);

              return (
                <div
                  key={submission._id}
                  className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-gray-100 hover:bg-gray-50/50 transition-colors items-center"
                >
                  <div className="col-span-1 text-center text-sm text-gray-400">
                    {(pagination.page - 1) * pagination.limit + index + 1}
                  </div>

                  <div className="col-span-3">
                    <Link
                      to={`/problems/${submission.problem._id}`}
                      className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors"
                    >
                      {submission.problem.title}
                    </Link>
                    {submission.contest && (
                      <span className="text-xs text-gray-400 ml-2">
                        (Contest)
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 text-center text-sm text-gray-600">
                    {submission.language}
                  </div>

                  <div className="col-span-2 flex items-center justify-center">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-medium border flex items-center gap-1 ${statusInfo.color}`}
                    >
                      {statusInfo.icon}
                      {statusInfo.label}
                    </span>
                  </div>

                  <div className="col-span-2 text-center text-sm text-gray-600">
                    {submission.executionTime
                      ? `${submission.executionTime}ms`
                      : "-"}
                  </div>

                  <div className="col-span-1 flex items-center justify-center">
                    <Link
                      to={`/submissions/${submission._id}`}
                      state={{ from: "/problems?tab=submissions" }}
                      className="p-1.5 text-gray-400 hover:text-[#3e4bc4] hover:bg-blue-50 rounded transition-colors"
                      title="View Code"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4">
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
        </>
      )}
    </div>
  );
};

export default SubmissionsTab;