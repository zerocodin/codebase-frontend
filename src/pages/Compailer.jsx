import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Moon,
  Sun,
  Terminal,
  FileCode,
  CheckCircle,
  AlertCircle,
  Loader2,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  Code2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { executeCode } from "../services/execution.Service";

const Compiler = () => {
  // State
  const [code, setCode] = useState(`// Welcome to CodeBase Compiler
// Write your code here

function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Developer"));`);
  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [fontSize, setFontSize] = useState(14);

  // UI State
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef(null);

  // Language options
  const languages = [
    { id: "python", label: "Python", extension: "py" },
    { id: "javascript", label: "JavaScript", extension: "js" },
    { id: "php", label: "PHP", extension: "php" },
    { id: "cpp", label: "C++", extension: "cpp" },
    { id: "c", label: "C", extension: "c" },
    { id: "java", label: "Java", extension: "java" },
  ];

  // Get language label
  const getLanguageLabel = (id) => {
    const lang = languages.find((l) => l.id === id);
    return lang ? lang.label : id;
  };

  // Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Toggle right panel
  const toggleRightPanel = () => {
    setIsRightPanelVisible(!isRightPanelVisible);
  };

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
  }, []);

  const runCode = async () => {
    setIsRunning(true);
    setError("");
    setOutput("");

    try {
      const result = await executeCode(code, language, input || "");

      if (result.success) {
        const data = result.data;
        if (data.error && data.error.trim()) {
          setError(data.error);
          setOutput("");
        } else {
          setOutput(data.output || "No output");
          setError("");
        }
      } else {
        setError(result.message || "Execution failed");
        setOutput("");
      }
    } catch (err) {
      console.error("Execution error:", err);
      setError(err.message || "Failed to connect to server");
      setOutput("");
    } finally {
      setIsRunning(false);
    }
  };

  // Keyboard shortcut: Ctrl+Enter to run
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runCode();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [code, language, input]);

  // Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "vs-dark" ? "light" : "vs-dark");
  };

  // Update code template when language changes
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);

    const templates = {
      python: `# Welcome to CodeBase Compiler\n# Write your code here\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("Developer"))`,
      javascript: `// Welcome to CodeBase Compiler\n// Write your code here\n\nfunction greet(name) {\n  return "Hello, " + name + "!";\n}\n\nconsole.log(greet("Developer"));`,
      php: `<?php\n// Welcome to CodeBase Compiler\n// Write your code here\n\nfunction greet($name) {\n    return "Hello, " . $name . "!";\n}\n\necho greet("Developer");\n?>`,
      java: `// Welcome to CodeBase Compiler\n// Write your code here\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Developer!");\n    }\n}`,
      cpp: `// Welcome to CodeBase Compiler\n// Write your code here\n\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, Developer!" << endl;\n    return 0;\n}`,
      c: `// Welcome to CodeBase Compiler\n// Write your code here\n\n#include <stdio.h>\n\nint main() {\n    printf("Hello, Developer!\\n");\n    return 0;\n}`,
    };

    setCode(templates[newLanguage] || templates.python);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <Code2 className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-medium text-white">
            CodeBase Compiler
          </span>
          <span className="text-xs text-gray-500">|</span>
          <div className="relative">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="px-3 py-1 text-sm bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title="Toggle Theme"
          >
            {theme === "vs-dark" ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleFullScreen}
            className="p-1.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title="Full Screen"
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={toggleRightPanel}
            className="p-1.5 rounded-md hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            title={
              isRightPanelVisible ? "Hide Output Panel" : "Show Output Panel"
            }
          >
            {isRightPanelVisible ? (
              <PanelRightClose className="w-4 h-4" />
            ) : (
              <PanelRightOpen className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Code Editor */}
        <div className={`relative ${isRightPanelVisible ? "w-2/3" : "w-full"}`}>
          <Editor
            height="100%"
            language={
              language === "cpp" ? "cpp" : language === "c" ? "c" : language
            }
            value={code}
            onChange={setCode}
            theme={theme}
            onMount={handleEditorDidMount}
            options={{
              fontSize: fontSize,
              minimap: { enabled: false },
              scrollbar: {
                vertical: "visible",
                horizontal: "visible",
              },
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              wordWrap: "on",
              lineNumbers: "on",
              renderWhitespace: "selection",
              bracketPairColorization: { enabled: true },
              tabSize: 2,
            }}
          />
        </div>

        {/* Right Panel - Input/Output */}
        {isRightPanelVisible && (
          <div className="w-1/3 bg-gray-800 flex flex-col min-w-0 border-l border-gray-700">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-750 border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-300">Execution</span>
              </div>
              <button
                onClick={runCode}
                disabled={isRunning}
                className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-md text-sm font-medium transition-colors"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run
                  </>
                )}
              </button>
            </div>

            {/* Input & Output */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Input Section */}
              <div className="flex-1 flex flex-col border-b border-gray-700 min-h-[30%]">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-750 shrink-0">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Input
                  </span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input for your program..."
                  className="flex-1 w-full px-4 py-2 bg-gray-800 text-gray-300 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600"
                  spellCheck={false}
                />
              </div>

              {/* Output Section */}
              <div className="flex-1 flex flex-col min-h-[30%]">
                <div className="flex items-center justify-between px-4 py-1.5 bg-gray-750 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Output
                    </span>
                    {error && (
                      <span className="flex items-center gap-1 text-xs text-red-400">
                        <AlertCircle className="w-3 h-3" />
                        Error
                      </span>
                    )}
                    {output && !error && (
                      <span className="flex items-center gap-1 text-xs text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Success
                      </span>
                    )}
                  </div>
                  {output && (
                    <button
                      onClick={() => setOutput("")}
                      className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex-1 w-full px-4 py-2 bg-gray-800 overflow-auto">
                  {error ? (
                    <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                      {error}
                    </div>
                  ) : output ? (
                    <div className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                      {output}
                    </div>
                  ) : (
                    <div className="text-gray-600 text-sm italic">
                      Run your code to see output here...
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Compiler;
