// Pages/CompilerPage.jsx
import React, { useState, useEffect } from "react";
import CodeEditor from "../components/CodeEditor"; // Custom code editor component
import QuestionDetails from "../components/QuestionList"; // Custom component for question details
import "./CompilerPage.css"; // Your custom styles for the page

function CompilerPage() {
  const [question, setQuestion] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuestion = () => {
      setQuestion({
        title: "Reverse an Array",
        description: "Given an array, reverse the elements in-place.",
        input: "Array of integers",
        output: "Array of integers in reversed order",
        boilerplate: {
          javascript: `function reverseArray(arr) {
  // Write your logic here
  return arr;
}

console.log(reverseArray([1, 2, 3]));`,
        },
        testCases: [
          { input: "[1, 2, 3]", expected: "[3, 2, 1]" },
          { input: "[5, 10, 15]", expected: "[15, 10, 5]" },
        ],
      });
    };
    fetchQuestion();
  }, []);

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // In real app, evaluate output vs test cases here
    }, 2000);
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    // Add backend submission logic here
  };

  return (
    <div className="compiler-page">
      <div className="question-left">
        {question ? <QuestionDetails question={question} /> : <p>Loading question...</p>}
      </div>

      <div className="compiler-right">
        {question && <CodeEditor question={question} />}

        <div className="actions" style={{ marginTop: "1rem" }}>
          <button onClick={handleRun} disabled={isRunning}>
            {isRunning ? "Running..." : "Run"}
          </button>
          <button onClick={handleSubmit} disabled={isSubmitted}>
            {isSubmitted ? "Submitted" : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompilerPage;
