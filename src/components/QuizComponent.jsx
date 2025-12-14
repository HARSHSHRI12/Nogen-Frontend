import React, { useState, useEffect } from 'react';
import { submitQuizResult } from '../api/quizApi'; // ✅ path sahi kar lena

const QuizComponent = ({ userId, subject, questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [weakTopics, setWeakTopics] = useState([]);
  const [report, setReport] = useState(null);
  const [topicStats, setTopicStats] = useState({});

  const currentQuestion = questions[currentIndex];

  const handleNext = () => {
    const currentTopic = currentQuestion.topic;

    setTopicStats(prev => {
      const prevStats = prev[currentTopic] || { correct: 0, total: 0 };
      return {
        ...prev,
        [currentTopic]: {
          correct: selectedOption === currentQuestion.correctAnswer
            ? prevStats.correct + 1
            : prevStats.correct,
          total: prevStats.total + 1
        }
      };
    });

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption('');
    } else {
      setIsCompleted(true);
    }
  };

  useEffect(() => {
    if (isCompleted) {
      generateReport();
    }
  }, [isCompleted]);

  const generateReport = async () => {
    const weak = Object.entries(topicStats)
      .filter(([_, stat]) => (stat.correct / stat.total) < 0.5)
      .map(([topic]) => topic);

    const improvementTips = weak.length > 0
      ? `Focus more on these topics: ${weak.join(', ')}. Revise notes and try again.`
      : 'Great job! You’re doing well across all topics.';

    const fullReport = {
      userId,
      subject,
      score,
      totalQuestions: questions.length,
      weakTopics: weak,
      improvementTips,
      completedAt: new Date().toISOString()
    };

    setReport(fullReport);

    try {
      await submitQuizResult(fullReport); // ✅ send to backend
    } catch (err) {
      console.error("Error submitting quiz result:", err);
    }

    if (onComplete) onComplete(fullReport);
  };

  if (isCompleted && report) {
    return (
      <div className="quiz-report">
        <h2>🎉 Quiz Completed</h2>
        <p><strong>Score:</strong> {score} / {questions.length}</p>
        <p><strong>Weak Topics:</strong> {report.weakTopics.length ? report.weakTopics.join(', ') : 'None'}</p>
        <p><strong>Improvement Tips:</strong> {report.improvementTips}</p>
        <div className="progress-bar">
          <div
            className="progress"
            style={{
              width: `${(score / questions.length) * 100}%`,
              backgroundColor: '#4caf50',
              height: '10px',
              borderRadius: '5px'
            }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h3>{subject} Quiz</h3>
      <p><strong>Q{currentIndex + 1}:</strong> {currentQuestion.question}</p>
      {currentQuestion.options.map((option, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name="option"
              value={option}
              checked={selectedOption === option}
              onChange={() => setSelectedOption(option)}
            />
            {option}
          </label>
        </div>
      ))}
      <button onClick={handleNext} disabled={!selectedOption}>
        {currentIndex + 1 === questions.length ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};

export default QuizComponent;
