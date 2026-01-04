import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axiosInstance from "../api/axios";

const CodeEditor = ({ question, setExecutionOutput }) => {
  const [code, setCode] = useState("");
  const [selectedLang, setSelectedLang] = useState("javascript");
  const [isRunning, setIsRunning] = useState(false);

  // Load boilerplate when question or language changes
  useEffect(() => {
    if (question?.boilerplate?.[selectedLang]) {
      setCode(question.boilerplate[selectedLang]);
    } else {
      setCode("// Write your code here...");
    }
  }, [question, selectedLang]);

  const handleEditorChange = (value) => {
    setCode(value ?? "");
  };

  const runCode = async () => {
    if (!code.trim()) {
      setExecutionOutput("⚠️ Please write some code first.");
      return;
    }
    setIsRunning(true);
    setExecutionOutput("Running...");
    try {
      const response = await axiosInstance.post("/run-code", {
        language: selectedLang,
        code,
      });
      if (response.data.success) {
        const { result } = response.data;
        const out = `Status: ${result.status}\nOutput: ${result.output}\nTime: ${result.executionTime}`;
        setExecutionOutput(out);
      } else {
        setExecutionOutput(`❌ Error: ${response.data.error}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setExecutionOutput(`❌ Error: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    if (!code.trim()) {
      setExecutionOutput("⚠️ Please write some code first.");
      return;
    }
    setIsRunning(true);
    setExecutionOutput("Submitting...");
    try {
      const response = await axiosInstance.post("/submit-code", {
        language: selectedLang,
        code,
        questionId: question?.id,
      });
      if (response.data.success) {
        const { result } = response.data;
        const out = `✅ Accepted\nRuntime: ${result.time}\nMemory: ${result.memory}`;
        setExecutionOutput(out);
      } else {
        setExecutionOutput(`❌ ${response.data.error}`);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      setExecutionOutput(`❌ Error: ${msg}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (question?.boilerplate?.[selectedLang]) {
      setCode(question.boilerplate[selectedLang]);
    } else {
      setCode("// Write your code here...");
    }
    setExecutionOutput("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setExecutionOutput("📋 Code copied to clipboard.");
    } catch (_) {
      setExecutionOutput("⚠️ Unable to copy.");
    }
  };

  return (
    <div className="code-editor-container" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Toolbar – LeetCode style */}
      <div className="editor-toolbar" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", background: "var(--panel-header-background)", borderBottom: "1px solid var(--border-color)" }}>
        <select
          className="lang-select"
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          style={{ background: "transparent", border: "none", color: "var(--nogen-text)", fontWeight: 600, fontSize: "0.85rem" }}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={resetCode} disabled={isRunning} className="icon-btn" style={toolbarBtnStyle}>Reset</button>
          <button onClick={copyToClipboard} disabled={isRunning} className="icon-btn" style={toolbarBtnStyle}>Copy</button>
          <button onClick={runCode} disabled={isRunning} className="icon-btn" style={runBtnStyle}>Run</button>
          <button onClick={submitCode} disabled={isRunning} className="icon-btn" style={submitBtnStyle}>Submit</button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          language={selectedLang}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "'Fira Code', monospace",
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderLineHighlight: "all",
            cursorSmoothCaretAnimation: "on",
            smoothScrolling: true,
            scrollbar: { vertical: "auto", horizontal: "auto" },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            formatOnPaste: true,
          }}
        />
      </div>
    </div>
  );
};

// Inline style objects for toolbar buttons
const toolbarBtnStyle = {
  background: "var(--panel-header-background)",
  color: "var(--nogen-text)",
  border: "1px solid var(--border-color)",
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "0.8rem",
  cursor: "pointer",
};
const runBtnStyle = { ...toolbarBtnStyle, background: "#238636", color: "#fff" };
const submitBtnStyle = { ...toolbarBtnStyle, background: "#2cbb5d", color: "#fff" };

export default CodeEditor;
