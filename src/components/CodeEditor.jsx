import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axiosInstance from "../api/axios";

const CodeEditor = ({ question, setExecutionOutput }) => {
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (question?.boilerplate?.javascript) {
      setCode(question.boilerplate.javascript);
    } else {
      setCode("// Write your code here...");
    }
  }, [question]);

  const handleEditorChange = (value) => {
    setCode(value || ""); // avoid undefined
  };

  const handleRun = async () => {
    if (!code.trim()) {
      setExecutionOutput("⚠️ Please write some code first.");
      return;
    }

    setIsRunning(true);
    setExecutionOutput("Running..."); // clear previous output

    try {
      const response = await axiosInstance.post("/run-code", {
        language: "javascript",
        code,
      });

      if (response.data.success) {
        const result = response.data.result;
        const outputString = `Status: ${result.status}\nOutput: ${result.output}\nExecution Time: ${result.executionTime}`;
        setExecutionOutput(outputString);
      } else {
        setExecutionOutput(`❌ Error: ${response.data.error}`);
      }
    } catch (error) {
      const err = error.response?.data?.error || error.message;
      setExecutionOutput("❌ Error: " + err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-container">
      <Editor
        height="400px"
        language="javascript"
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
        }}
      />

      <div className="actions" style={{ marginTop: "10px" }}>
        <button onClick={handleRun} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;

