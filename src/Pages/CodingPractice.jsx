import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CodeEditor from '../components/CodeEditor';
import QuestionDetails from '../components/QuestionDetails';
import { generateMockQuestions } from '../components/mockQuestions';
import './CodingPractice.css';

const CodePractice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [filter, setFilter] = useState('all');
  const [topicFilter, setTopicFilter] = useState('all');
  const [executionOutput, setExecutionOutput] = useState('');

  const topics = [
    'Array', 'String', 'Linked List', 'Stack', 'Queue', 
    'Tree', 'BST', 'Graph', 'Heap', 'Sorting', 
    'Searching', 'Dynamic Programming', 'Backtracking',
    'Greedy', 'Divide and Conquer', 'Bit Manipulation',
    'Math', 'Geometry', 'Design', 'Hash Table'
  ];

  useEffect(() => {
    const mockQuestions = generateMockQuestions();
    setQuestions(mockQuestions);
    if (mockQuestions.length > 0) {
      setCurrentQuestion(mockQuestions[0]);
    }
  }, []);

  const filteredQuestions = questions.filter(q => {
    const matchesDifficulty = filter === 'all' || q.difficulty === filter;
    const matchesTopic = topicFilter === 'all' || q.topics.includes(topicFilter);
    return matchesDifficulty && matchesTopic;
  });

  const handleQuestionSelect = (question) => {
    setCurrentQuestion(question);
    setExecutionOutput('');
  };

  return (
    <motion.div 
      className="code-practice-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className="practice-header">
        <h1>Code Practice</h1>
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="difficulty-filter">Difficulty:</label>
            <select id="difficulty-filter" onChange={(e) => setFilter(e.target.value)} value={filter}>
              <option value="all">All</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="topic-filter">Topic:</label>
            <select id="topic-filter" onChange={(e) => setTopicFilter(e.target.value)} value={topicFilter}>
              <option value="all">All</option>
              {topics.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <motion.div className="layout-panel questions-panel" layout>
          <div className="panel-header">
            <h3>Questions</h3>
          </div>
          <ul className="question-list">
            {filteredQuestions.map((q) => (
              <li 
                key={q.title} 
                onClick={() => handleQuestionSelect(q)}
                className={currentQuestion?.title === q.title ? 'active' : ''}
              >
                <span>{q.title}</span>
                <span className={`difficulty-tag ${q.difficulty}`}>{q.difficulty}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="layout-panel editor-panel">
          {currentQuestion && (
            <>
              <motion.div className="panel-header" layout>
                <QuestionDetails question={currentQuestion} />
              </motion.div>
              <CodeEditor 
                question={currentQuestion} 
                setExecutionOutput={setExecutionOutput} 
              />
            </>
          )}
        </div>

        <div className="layout-panel output-panel">
          <div className="panel-header">
            <h3>Output</h3>
          </div>
          <pre className="output-console">{executionOutput}</pre>
        </div>
      </div>
    </motion.div>
  );
};

export default CodePractice;
