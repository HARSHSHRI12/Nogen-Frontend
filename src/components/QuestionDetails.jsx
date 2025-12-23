import React from 'react';

const QuestionDetails = ({ question }) => {
  if (!question) {
    return (
      <div className="question-details-container">
        <p className="placeholder-text">Select a question to see the details.</p>
      </div>
    );
  }

  return (
    <div className="question-details-container">
      <h2 className="question-title-details">{question.title}</h2>
      <div className="question-meta">
        <span className={`difficulty-tag ${question.difficulty}`}>{question.difficulty}</span>
        {question.topics && question.topics.length > 0 && (
          <div className="topic-tags">
            {question.topics.map((topic, index) => (
              <span key={index} className="topic-tag">{topic}</span>
            ))}
          </div>
        )}
      </div>
      <div className="question-description">
        <h3>Description</h3>
        <p>{question.description}</p>
      </div>

      {question.testCases && question.testCases.length > 0 && (
        <div className="question-test-cases">
          <h3>Example Test Cases</h3>
          {question.testCases.map((testCase, index) => (
            <div key={index} className="test-case-item">
              <p><strong>Input:</strong> <code>{testCase.input}</code></p>
              <p><strong>Output:</strong> <code>{testCase.output}</code></p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionDetails;
