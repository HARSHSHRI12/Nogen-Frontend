import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import QuestionDetails from '../components/QuestionList';  // Fixed typo from QuestionList to QuestionDetails
import Output from '../components/Output';
import { generateMockQuestions } from '../components/mockQuestions'; // Importing the mock data
import './CodingPractice.css';

const CodePractice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [filter, setFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [progress, setProgress] = useState({
    easy: { solved: 0, total: 0 },
    medium: { solved: 0, total: 0 },
    hard: { solved: 0, total: 0 },
  });

  const topics = [
    'Array', 'String', 'Linked List', 'Stack', 'Queue', 
    'Tree', 'BST', 'Graph', 'Heap', 'Sorting', 
    'Searching', 'Dynamic Programming', 'Backtracking',
    'Greedy', 'Divide and Conquer', 'Bit Manipulation',
    'Math', 'Geometry', 'Design', 'Hash Table'
  ];

  useEffect(() => {
    const mockQuestions = generateMockQuestions(); // Fetch the questions
    setQuestions(mockQuestions);

    // Count how many questions are there per difficulty
    const easyCount = mockQuestions.filter(q => q.difficulty === 'easy').length;
    const mediumCount = mockQuestions.filter(q => q.difficulty === 'medium').length;
    const hardCount = mockQuestions.filter(q => q.difficulty === 'hard').length;

    setProgress({
      easy: { solved: 0, total: easyCount },
      medium: { solved: 0, total: mediumCount },
      hard: { solved: 0, total: hardCount },
    });
  }, []);

  useEffect(() => {
    if (questions.length > 0 && !currentQuestion) {
      setCurrentQuestion(questions[0]);
      setCode(questions[0].boilerplate[language] || '');
    }
  }, [questions, currentQuestion, language]);

  useEffect(() => {
    if (currentQuestion) {
      setCode(currentQuestion.boilerplate[language] || '');
    }
  }, [language, currentQuestion]);

  const filteredQuestions = questions.filter(q => {
    const matchesDifficulty = filter === 'all' || q.difficulty === filter;
    const matchesTopic = topicFilter === 'all' || q.topics.includes(topicFilter);
    return matchesDifficulty && matchesTopic;
  });

  const handleQuestionSelect = (question) => {
    setCurrentQuestion(question);
    setOutput('');
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput('Running test cases...\n\n');

    setTimeout(() => {
      let outputText = 'Running test cases...\n\n';
      currentQuestion.testCases.forEach((testCase, index) => {
        const randomSuccess = Math.random() > 0.3;
        outputText += `Test Case ${index + 1}: ${randomSuccess ? '✓ Passed' : '✗ Failed'}\n`;
        outputText += `Input: ${testCase.input}\n`;
        outputText += `Expected Output: ${testCase.output}\n`;
        if (!randomSuccess) {
          outputText += `Your Output: [Wrong output]\n`;
        }
        outputText += '\n';
      });

      const allPassed = Math.random() > 0.3;
      outputText += allPassed ? '\nAll test cases passed!' : '\nSome test cases failed.';

      setOutput(outputText);
      setIsRunning(false);
    }, 1500);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setOutput('Submitting solution...\n\n');

    setTimeout(() => {
      const randomSuccess = Math.random() > 0.5;
      let outputText = 'Submitting solution...\n\n';

      if (randomSuccess) {
        outputText += '✓ Solution Accepted!\n';
        outputText += `Runtime: ${(Math.random() * 100).toFixed(2)} ms\n`;
        outputText += `Memory: ${(Math.random() * 50).toFixed(2)} MB\n`;

        if (currentQuestion && !currentQuestion.solved) {
          const difficulty = currentQuestion.difficulty;
          setProgress(prev => ({
            ...prev,
            [difficulty]: {
              ...prev[difficulty],
              solved: prev[difficulty].solved + 1,
            },
          }));
          currentQuestion.solved = true;
        }
      } else {
        outputText += '✗ Solution Rejected. Try again.';
      }

      setOutput(outputText);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="code-practice-container">
      <h1>Code Practice</h1>

      <div className="filters">
        <label>Difficulty:</label>
        <select onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <label>Topic:</label>
        <select onChange={(e) => setTopicFilter(e.target.value)}>
          <option value="all">All</option>
          {topics.map((t, i) => <option key={i} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="main-layout">
        <div className="question-list">
          <h3>Questions</h3>
          <ul>
            {filteredQuestions.map((q, idx) => (
              <li key={idx} onClick={() => handleQuestionSelect(q)}>
                {q.title} ({q.difficulty})
              </li>
            ))}
          </ul>
        </div>

        <div className="code-area">
          {currentQuestion && (
            <>
              <QuestionDetails question={currentQuestion} />
              <CodeEditor setLanguage={setLanguage} setCode={setCode} />
              <div className="actions">
                <button onClick={handleRun} disabled={isRunning}>Run</button>
                <button onClick={handleSubmit} disabled={isSubmitting}>Submit</button>
              </div>
              <Output result={output} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePractice;
