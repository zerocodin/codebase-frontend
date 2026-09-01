import React, { useRef, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Send,
  Terminal,
  ChevronDown,
  Loader2,
  GripHorizontal,
} from "lucide-react";
import languageSnippets, { commonSnippets } from "../../utils/snippets";

const CodeEditor = ({
  problem,
  code,
  setCode,
  language,
  setLanguage,
  languages,
  input,
  setInput,
  output,
  setOutput,
  isRunning,
  isSubmitting,
  onRun,
  onSubmit,
  theme,
}) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const [bottomHeight, setBottomHeight] = useState(200); // Initial height of bottom section
  const [isDragging, setIsDragging] = useState(false);

  const getMonacoLanguage = (lang) => {
    const map = {
      python: "python",
      javascript: "javascript",
      java: "java",
      cpp: "cpp",
      c: "c",
      php: "php",
    };
    return map[lang] || lang;
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    const allLanguages = ["python", "javascript", "java", "cpp", "c", "php"];

    allLanguages.forEach((lang) => {
      monaco.languages.registerCompletionItemProvider(lang, {
        provideCompletionItems: (model, position) => {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };

          const snippets = languageSnippets[lang] || [];
          const suggestions = snippets.map((snippet) => ({
            label: snippet.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: snippet.insertText,
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: snippet.documentation || "",
            range: range,
            sortText: "0",
          }));

          return { suggestions };
        },
      });
    });

    // Common snippets for all languages
    monaco.languages.registerCompletionItemProvider("*", {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const suggestions = commonSnippets.map((snippet) => ({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: snippet.documentation || "",
          range: range,
          sortText: "1",
        }));

        return { suggestions };
      },
    });

    // Enable quick suggestions
    editor.updateOptions({
      quickSuggestions: true,
      suggest: {
        showKeywords: true,
        showFunctions: true,
        showConstructors: true,
        showFields: true,
        showVariables: true,
      },
    });
  };

  // Handle language change
  useEffect(() => {
    if (editorRef.current) {
      const model = editorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, getMonacoLanguage(language));
      }
    }
  }, [language]);

  // Handle resize drag
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = containerRect.bottom - e.clientY;

      // Set minimum and maximum height constraints
      const minHeight = 100;
      const maxHeight = containerRect.height - 100; // Leave at least 100px for editor

      if (newHeight >= minHeight && newHeight <= maxHeight) {
        setBottomHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "row-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  return (
    <div ref={containerRef} className="flex flex-col h-full bg-gray-900">
      {/* Language Selector & Actions */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs text-gray-500">|</span>
          <span className="text-xs text-gray-400">
            {problem?.title || "No problem selected"}
          </span>
        </div>
      </div>

      {/* Code Editor - Flexible */}
      <div
        className="flex-1 min-h-0"
        style={{
          height: `calc(100% - ${bottomHeight}px)`,
          minHeight: "100px",
        }}
      >
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={code}
          onChange={setCode}
          theme={theme}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
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
            quickSuggestions: true,
            acceptSuggestionOnEnter: "on",
            snippetSuggestions: "top",
            wordBasedSuggestions: true,
            parameterHints: {
              enabled: true,
              cycle: true,
            },
            suggest: {
              showKeywords: true,
              showFunctions: true,
              showConstructors: true,
              showFields: true,
              showVariables: true,
              showEnums: true,
              showModules: true,
              showOperators: true,
              showValues: true,
            },
          }}
        />
      </div>

      {/* Resize Handle */}
      <div
        className="flex items-center justify-center h-1.5 bg-gray-700 hover:bg-blue-500 cursor-row-resize transition-colors group shrink-0"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
      </div>

      {/* Bottom Section - Input/Output & Actions */}
      <div
        className="flex flex-col bg-gray-800 border-t border-gray-700 shrink-0"
        style={{ height: `${bottomHeight}px` }}
      >
        {/* Input/Output Row */}
        <div className="flex flex-1 min-h-0">
          {/* Input Box */}
          <div className="flex-1 border-r border-gray-700 flex flex-col min-w-0">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-750 border-b border-gray-700 shrink-0">
              <Terminal className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Input
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter input for your program..."
              className="flex-1 w-full px-3 py-2 bg-gray-800 text-gray-300 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-gray-600"
              spellCheck={false}
            />
          </div>

          {/* Output Box */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between px-3 py-1.5 bg-gray-750 border-b border-gray-700 shrink-0">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Output
                </span>
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
            <div className="flex-1 w-full px-3 py-2 bg-gray-800 overflow-auto">
              {output ? (
                <div className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                  {output}
                </div>
              ) : (
                <div className="text-gray-600 text-sm italic">
                  Run or submit your code to see output...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 px-4 py-2 bg-gray-750 border-t border-gray-700 shrink-0">
          <button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
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
          <button
            onClick={onSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-2 px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-md text-sm font-medium transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
