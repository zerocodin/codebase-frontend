import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Code, CheckCircle, XCircle, ChevronDown } from "lucide-react";

const ProfileProblems = ({ solvedProblems = [] }) => {
  const [expanded, setExpanded] = useState(false);

  const sortedProblems = [...solvedProblems].sort((a, b) => {
    const dateA = new Date(a.solvedAt);
    const dateB = new Date(b.solvedAt);
    return dateB - dateA; 
  });

  const visibleProblems = expanded
    ? sortedProblems
    : sortedProblems.slice(0, 5);

  if (!solvedProblems || solvedProblems.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code className="w-5 h-5 text-[#3e4bc4]" />
          <h2 className="text-lg font-bold text-gray-900">Problems Solved</h2>
          <span className="text-sm text-gray-400">(0)</span>
        </div>
        <div className="text-center py-8">
          <Code className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No problems solved yet</p>
          <p className="text-sm text-gray-400">
            Start solving problems to build your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="w-5 h-5 text-[#3e4bc4]" />
            <h2 className="text-lg font-bold text-gray-900">Problems Solved</h2>
            <span className="text-sm text-gray-400">
              ({solvedProblems.length})
            </span>
          </div>
          {solvedProblems.length > 5 && (
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

      <div className="divide-y divide-gray-100">
        {visibleProblems.map((item) => (
          <Link
            key={item.problem._id}
            to={`/problems/${item.problem._id}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-800 hover:text-[#3e4bc4] transition-colors">
                  {item.problem.title}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Solved: {new Date(item.solvedAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">
                    Language: {item.language || "unknown"}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">
                #{item.problem.difficulty || "MEDIUM"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProfileProblems;