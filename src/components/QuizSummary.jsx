import React, { useState } from 'react';
import { submitQuizResult } from '../api/quizeApi';

const QuizComponent = ({ userId, subject, questions, onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQIndex];

  const handleOptionSelect = (option) => {
    setSelectedOptions({
      ...selectedOptions,
      [currentQIndex]: option,
    });
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQIndex > 0) {
      setCurrentQIndex(currentQIndex - 1);
    }
  };

  const handleSubmit = () => {
    let correct = 0;

    questions.forEach((q, index) => {
      if (selectedOptions[index] === q.correctAnswer) {
        correct += 1;
      }
    });

    setScore(correct);
    setIsSubmitted(true);

    // API call to store result
    const result = {
      userId,
      subject,
      topics: [...new Set(questions.map((q) => q.topic))],
      score: correct,
      totalQuestions: questions.length,
    };

    submitQuizResult(result);
  };

  return (
    <div className="quiz-container">
      {!isSubmitted ? (
        <>
          <h2>📚 Quiz: {subject}</h2>
          <div className="quiz-question">
            <p><strong>Q{currentQIndex + 1}:</strong> {currentQuestion.question}</p>
            <ul className="quiz-options">
              {currentQuestion.options.map((option, idx) => (
                <li
                  key={idx}
                  className={`option ${selectedOptions[currentQIndex] === option ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>

          <div className="quiz-nav">
            <button onClick={handlePrev} disabled={currentQIndex === 0}>⬅ Prev</button>
            {currentQIndex < questions.length - 1 ? (
              <button onClick={handleNext}>Next ➡</button>
            ) : (
              <button onClick={handleSubmit}>✅ Submit</button>
            )}
          </div>
        </>
      ) : (
        <div className="quiz-result">
          <h2>🎉 Quiz Completed!</h2>
          <p>Your Score: <strong>{score} / {questions.length}</strong></p>
          <button onClick={onComplete}>Close</button>
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
