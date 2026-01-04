import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import CodeEditor from '../components/CodeEditor';
import { generateMockQuestions } from '../components/mockQuestions';
import './CodingPractice.css';

const CodingPractice = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [filter, setFilter] = useState('all');
  const [executionOutput, setExecutionOutput] = useState('');
  const [activeTab, setActiveTab] = useState('testcases');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const mockQuestions = generateMockQuestions();
    setQuestions(mockQuestions);
    if (mockQuestions.length > 0) {
      setCurrentQuestion(mockQuestions[0]);
    }
  }, []);

  const filteredQuestions = questions.filter(q =>
    filter === 'all' || q.difficulty === filter
  );

  return (
    <div className="code-practice-page">


      <main className="workbench">
        {/* Sidebar */}
        <aside className={`pane sidebar-pane ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="pane-header">
            {!isSidebarCollapsed && <span>Questions</span>}
            <button
              className="toggle-sidebar-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <i className={`fas ${isSidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
            </button>
          </div>
          {!isSidebarCollapsed && (
            <ul className="problem-list">
              {filteredQuestions.map(q => (
                <li
                  key={q.title}
                  className={`problem-item ${currentQuestion?.title === q.title ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentQuestion(q);
                    setExecutionOutput('');
                    setActiveTab('testcases');
                  }}
                >
                  <span className="p-name">{q.title}</span>
                  <span className={`difficulty-chip ${q.difficulty}`}>{q.difficulty}</span>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section className="content-area">
          {/* Description */}
          <div className="pane description-pane">
            <div className="pane-header">Description</div>
            <div className="description-scroll">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion?.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <h1>{currentQuestion?.title}</h1>
                  <div className="description-body">
                    <p>{currentQuestion?.description}</p>
                    <div className="example-block">
                      <div className="tc-label">Example 1</div>
                      <strong>Input: </strong> <code>{currentQuestion?.testCases?.[0]?.input}</code><br />
                      <strong>Output: </strong> <code>{currentQuestion?.testCases?.[0]?.output}</code>
                    </div>
                    <div style={{ marginTop: '24px' }}>
                      <h4 style={{ color: 'var(--nogen-white)' }}>Constraints:</h4>
                      <ul style={{ paddingLeft: '20px', fontSize: '0.9rem', color: 'var(--nogen-text-dim)' }}>
                        <li>1 {'<='} array.length {'<='} 10^5</li>
                        <li>Time Limit: 1.0s</li>
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Code & Console */}
          <div className="code-stack">
            {/* Editor */}
            <div className="pane editor-pane-v">
              <CodeEditor
                question={currentQuestion}
                setExecutionOutput={setExecutionOutput}
              />
            </div>

            {/* Console */}
            <div className="pane console-pane-v">
              <div className="console-tabs">
                <button
                  className={`tab-btn ${activeTab === 'testcases' ? 'active' : ''}`}
                  onClick={() => setActiveTab('testcases')}
                >Testcases</button>
                <button
                  className={`tab-btn ${activeTab === 'result' ? 'active' : ''}`}
                  onClick={() => setActiveTab('result')}
                >Result</button>
              </div>
              <div className="console-viewport">
                {activeTab === 'testcases' ? (
                  <div>
                    {currentQuestion?.testCases?.map((tc, i) => (
                      <div key={i} className="testcase-card">
                        <div className="tc-label">Case {i + 1}</div>
                        <div className="tc-content">{tc.input}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                    {executionOutput || "Run code to see results..."}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default CodingPractice;
