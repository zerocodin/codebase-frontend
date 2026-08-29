import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Code,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

import submissionService from "../services/submission.Service";
import { useAuth } from "../components/contexts/AuthContext";

const SubmissionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    setLoading(true);
    try {
      const response = await submissionService.getSubmissionById(id);
      if (response.success) {
        setSubmission(response.data.submission);
      } else {
        toast.error(response.message || "Failed to fetch submission");
        navigate("/problems?tab=submissions");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load submission");
      navigate("/problems?tab=submissions");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (location.state?.from) {
      navigate(location.state.from);
    } else {
      navigate("/problems?tab=submissions");
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      ACCEPTED: {
        color: "bg-green-100 text-green-700 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
        label: "Accepted",
      },
      WRONG_ANSWER: {
        color: "bg-red-100 text-red-700 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Wrong Answer",
      },
      RUNTIME_ERROR: {
        color: "bg-orange-100 text-orange-700 border-orange-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Runtime Error",
      },
      TIME_LIMIT_EXCEEDED: {
        color: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Time Limit Exceeded",
      },
      COMPILATION_ERROR: {
        color: "bg-purple-100 text-purple-700 border-purple-200",
        icon: <XCircle className="w-4 h-4" />,
        label: "Compilation Error",
      },
      PENDING: {
        color: "bg-gray-100 text-gray-600 border-gray-200",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        label: "Pending",
      },
      RUNNING: {
        color: "bg-blue-100 text-blue-700 border-blue-200",
        icon: <Loader2 className="w-4 h-4 animate-spin" />,
        label: "Running",
      },
    };
    return statusMap[status] || statusMap.PENDING;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading submission...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">
            Submission not found
          </h2>
          <Link
            to="/problems"
            className="text-[#3e4bc4] hover:underline mt-2 inline-block"
          >
            Back to Problems
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusBadge(submission.status);

  return (
    <div className="min-h-screen bg-gray-50/80 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-[#3e4bc4] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <span className="text-sm text-gray-400">
            Submission #{submission._id.slice(-6)}
          </span>
        </div>

        {/* Submission Info */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Problem
              </p>
              <Link
                to={`/problems/${submission.problem._id}`}
                className="text-sm font-medium text-[#3e4bc4] hover:underline"
              >
                {submission.problem.title}
              </Link>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Language
              </p>
              <p className="text-sm font-medium text-gray-800">
                {submission.language}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Status
              </p>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium border inline-flex items-center gap-2 ${statusInfo.color}`}
              >
                {statusInfo.icon}
                {statusInfo.label}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Submitted At
              </p>
              <p className="text-sm text-gray-800">
                {new Date(submission.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Execution Time
              </p>
              <p className="text-sm text-gray-800">
                {submission.executionTime}ms
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                Memory Used
              </p>
              <p className="text-sm text-gray-800">{submission.memoryUsed}MB</p>
            </div>
          </div>
        </div>

        {/* Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Code</span>
            </div>
            <span className="text-xs text-gray-400">{submission.language}</span>
          </div>

          <div className="p-4 bg-gray-900 overflow-auto max-h-125">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap">
              {submission.code}
            </pre>
          </div>
        </div>

        {/* Test Results (if any) */}
        {submission.testResults && submission.testResults.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 overflow-hidden mt-6">
            <div className="px-4 py-3 bg-gray-50/90 border-b border-gray-200">
              <span className="text-sm font-medium text-gray-700">
                Test Results ({submission.testResults.length})
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {submission.testResults.map((result, index) => (
                <div key={index} className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Test Case #{index + 1}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        result.status === "PASSED"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Input:</span>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-800 whitespace-pre-wrap">
                        {result.input || "(No input)"}
                      </pre>
                    </div>
                    <div>
                      <span className="text-gray-500">Expected Output:</span>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-800 whitespace-pre-wrap">
                        {result.expectedOutput || "(No output)"}
                      </pre>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-500">Your Output:</span>
                      <pre className="mt-1 p-2 bg-gray-100 rounded text-gray-800 whitespace-pre-wrap">
                        {result.actualOutput || "(No output)"}
                      </pre>
                    </div>
                    {result.errorMessage && (
                      <div className="md:col-span-2">
                        <span className="text-red-500">Error:</span>
                        <pre className="mt-1 p-2 bg-red-50 rounded text-red-600 whitespace-pre-wrap">
                          {result.errorMessage}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionDetails;
