import React from "react";
import {
  BookOpen,
  FileText,
  AlertTriangle,
  CheckCircle,
  Terminal,
  Code2,
  LayoutList,
  MousePointer,
} from "lucide-react";

const ProblemInfo = ({ problem, onLoadSample }) => {
  const getDifficultyColor = (difficulty) => {
    const colors = {
      EASY: "bg-green-100 text-green-700 border-green-200",
      MEDIUM: "bg-yellow-100 text-yellow-700 border-yellow-200",
      HARD: "bg-red-100 text-red-700 border-red-200",
      EXPERT: "bg-purple-100 text-purple-700 border-purple-200",
    };
    return colors[difficulty] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Title Section */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{problem.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(problem.difficulty)}`}
          >
            {problem.difficulty || "MEDIUM"}
          </span>
        </div>
        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {problem.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded-full border border-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <BookOpen className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Description</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {problem.description}
        </p>
      </div>

      {/* Input Format */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <Terminal className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Input Format</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {problem.inputFormat}
        </p>
      </div>

      {/* Output Format */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <FileText className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Output Format</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {problem.outputFormat}
        </p>
      </div>

      {/* Constraints */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center gap-2 text-gray-700 mb-2">
          <AlertTriangle className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Constraints</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
          {problem.constraints}
        </p>
      </div>

      {/* Sample Cases */}
      {problem.sampleCases && problem.sampleCases.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Sample Test Cases
          </h3>
          {problem.sampleCases.map((sample, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 text-sm font-medium text-gray-700 mb-2">
                <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                  Case {index + 1}
                </span>
                {onLoadSample && sample.input && (
                  <button
                    onClick={() => onLoadSample(sample.input)}
                    className="flex items-center gap-1 px-2 py-0.5 text-xs text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                  >
                    <MousePointer className="w-3 h-3" />
                    Load Input
                  </button>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-semibold text-gray-500">
                    Input:
                  </span>
                  <pre className="mt-1 p-2 bg-gray-900 text-green-400 text-xs rounded-md overflow-x-auto">
                    {sample.input || "(No input)"}
                  </pre>
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500">
                    Output:
                  </span>
                  <pre className="mt-1 p-2 bg-gray-900 text-blue-400 text-xs rounded-md overflow-x-auto">
                    {sample.output || "(No output)"}
                  </pre>
                </div>
                {sample.explanation && (
                  <div>
                    <span className="text-xs font-semibold text-gray-500">
                      Explanation:
                    </span>
                    <p className="mt-1 text-sm text-gray-600">
                      {sample.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemInfo;