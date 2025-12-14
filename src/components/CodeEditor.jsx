import React, { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import axios from "axios";

const CodeEditor = ({ question }) => {
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
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
      setOutput("⚠️ Please write some code first.");
      return;
    }

    setIsRunning(true);
    setOutput(""); // clear previous output

    try {
      const response = await axios.post("http://localhost:3500/api/run-code", {
        language: "javascript",
        code,
      });
      setOutput(response.data?.result || "✅ Code executed successfully (No output)");
    } catch (error) {
      const err = error.response?.data?.error || error.message;
      setOutput("❌ Error: " + err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="code-editor-container">
      <h3>{question?.title || "Untitled Question"}</h3>
      <p>{question?.description || "No description provided."}</p>

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

      <div className="output" style={{ marginTop: "15px" }}>
        <h4>Output:</h4>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;
