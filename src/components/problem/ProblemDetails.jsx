import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Sun,
  Moon,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import toast from "react-hot-toast";

import problemService from "../../services/problem.Service";
import { executeCode } from "../../services/execution.Service";
import { useAuth } from "../contexts/AuthContext"; 
import submissionService from "../../services/submission.Service"; 
import CodeEditor from "./CodeEditor";
import ProblemInfo from "./ProblemInfo";

const ProblemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); 

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [theme, setTheme] = useState("vs-dark");
  const [isEditorVisible, setIsEditorVisible] = useState(true);
  const [contest, setContest] = useState(null);
  const contestId = location.state?.contestId || null;

    
  const languages = [
    { id: "python", label: "Python", extension: "py" },
    { id: "javascript", label: "JavaScript", extension: "js" },
    { id: "php", label: "PHP", extension: "php" },
    { id: "cpp", label: "C++", extension: "cpp" },
    { id: "c", label: "C", extension: "c" },
    { id: "java", label: "Java", extension: "java" },
  ];

  useEffect(() => {
    fetchProblem();
  }, [id]);

  const fetchProblem = async () => {
    setLoading(true);
    try {
      const response = await problemService.getProblemById(id);

      if (response.success) {
        setProblem(response.data.problem);
        setCode(getDefaultCode(response.data.problem, language));

        if (
          response.data.problem.sampleCases &&
          response.data.problem.sampleCases.length > 0
        ) {
          setInput(response.data.problem.sampleCases[0].input || "");
        }
      } else {
        toast.error(response.message || "Failed to fetch problem");
        navigate("/problems");
      }
    } catch (error) {
      toast.error(error.message || "Failed to load problem");
      navigate("/problems");
    } finally {
      setLoading(false);
    }
  };

  const getDefaultCode = (problem, lang) => {
    const templates = {
      python: `# ${problem.title}\n# ${problem.description}\n\ndef solve():\n    # Write your solution here\n    pass\n\nif __name__ == "__main__":\n    solve()`,
      javascript: `// ${problem.title}\n// ${problem.description}\n\nfunction solve() {\n    // Write your solution here\n    \n}\n\nsolve();`,
      php: `<?php\n// ${problem.title}\n// ${problem.description}\n\nfunction solve() {\n    // Write your solution here\n    \n}\n\nsolve();\n?>`,
      java: `// ${problem.title}\n// ${problem.description}\n\npublic class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
      cpp: `// ${problem.title}\n// ${problem.description}\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
      c: `// ${problem.title}\n// ${problem.description}\n\n#include <stdio.h>\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
    };
    return templates[lang] || templates.python;
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (problem) {
      setCode(getDefaultCode(problem, lang));
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput("");

    try {
      const result = await executeCode(code, language, input);

      if (result.success) {
        const data = result.data;
        if (data.error && data.error.trim()) {
          setOutput(`Error:\n${data.error}`);
          toast.error("Execution failed");
        } else {
          setOutput(data.output || "No output");
          toast.success("Code executed successfully!");
        }
      } else {
        setOutput(`Error:\n${result.message || "Execution failed"}`);
        toast.error(result.message || "Execution failed");
      }
    } catch (error) {
      setOutput(`Error:\n${error.message || "Failed to connect to server"}`);
      toast.error("Execution failed");
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Please login to submit your solution");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    setOutput("");

    try {

      const result = await submissionService.submitSolution({
        problemId: id,
        code: code,
        language: language,
        contestId: contestId, 
      });

      if (result.success) {
        const data = result.data.submission;

        let outputMessage = "";

        if (data.isCorrect) {
          outputMessage = `✅ All test cases passed!\n\n`;
          outputMessage += `Status: ${data.status}\n`;
          outputMessage += `Passed: ${data.passedSamples}/${data.totalSamples} sample tests\n`;
          outputMessage += `Execution Time: ${data.executionTime}ms\n`;
          outputMessage += `Memory Used: ${data.memoryUsed}MB\n`;
          outputMessage += `Submitted: ${new Date(data.submittedAt).toLocaleString()}`;
          toast.success("Solution accepted! 🎉");
        } else {
          outputMessage = `❌ Wrong Answer\n\n`;
          outputMessage += `Status: ${data.status}\n`;
          outputMessage += `Passed: ${data.passedSamples}/${data.totalSamples} sample tests\n`;

          if (data.failedTestCase) {
            outputMessage += `\n--- Failed Test Case ---\n`;
            outputMessage += `Input:\n${data.failedTestCase.input || "(No input)"}\n\n`;
            outputMessage += `Expected Output:\n${data.failedTestCase.expectedOutput}\n\n`;
            outputMessage += `Your Output:\n${data.failedTestCase.actualOutput || "(No output)"}\n`;

            if (data.failedTestCase.errorMessage) {
              outputMessage += `\nError:\n${data.failedTestCase.errorMessage}`;
            }
          }

          if (data.errorMessage) {
            outputMessage += `\n\nError:\n${data.errorMessage}`;
          }

          toast.error("Wrong answer - Try again!");
        }

        setOutput(outputMessage);
      } else {
        setOutput(`Error:\n${result.message || "Submission failed"}`);
        toast.error(result.message || "Submission failed");
      }
    } catch (error) {
      setOutput(`Error:\n${error.message || "Failed to submit"}`);
      toast.error(error.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
  };

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  const loadSampleInput = (sampleInput) => {
    setInput(sampleInput);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 text-[#3e4bc4] animate-spin" />
          <p className="text-gray-500">Loading problem...</p>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Problem not found
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

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Problem Details */}
        <div
          className={`${isEditorVisible ? "w-1/2" : "w-full"} overflow-y-auto border-r border-gray-200 bg-white`}
        >
          <ProblemInfo problem={problem} onLoadSample={loadSampleInput} />
        </div>

        {/* Right Panel - Code Editor */}
        <div
          className={`${isEditorVisible ? "w-1/2" : "w-auto"} flex flex-col bg-gray-900 relative`}
        >
          {isEditorVisible && (
            <button
              onClick={toggleTheme}
              className="absolute top-2 right-14 z-10 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-colors border border-gray-700 shadow-lg"
              title={
                theme === "vs-dark"
                  ? "Switch to Light Mode"
                  : "Switch to Dark Mode"
              }
            >
              {theme === "vs-dark" ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-300" />
              )}
            </button>
          )}

          <button
            onClick={toggleEditor}
            className="absolute top-2 right-4 z-20 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-colors border border-gray-700 shadow-lg"
            title={isEditorVisible ? "Hide Editor" : "Show Editor"}
          >
            {isEditorVisible ? (
              <PanelRightClose className="w-5 h-5 text-gray-300" />
            ) : (
              <PanelRightOpen className="w-5 h-5 text-gray-300" />
            )}
          </button>

          {isEditorVisible && (
            <CodeEditor
              problem={problem}
              code={code}
              setCode={setCode}
              language={language}
              setLanguage={handleLanguageChange}
              languages={languages}
              input={input}
              setInput={setInput}
              output={output}
              setOutput={setOutput}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
              onRun={handleRun}
              onSubmit={handleSubmit}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetails;
