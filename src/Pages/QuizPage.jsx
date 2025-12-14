// src/pages/QuizPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const questions = location.state?.questions || [];

  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);

  const handleOptionChange = (index, option) => {
    setAnswers({ ...answers, [index]: option });
  };

  const handleSubmit = () => {
    let s = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.answer) s++;
    });
    setScore(s);

    // 🟢 Save score to backend/profile later here
  };

  if (!questions.length) {
    return (
      <div className="text-center mt-20 text-xl">
        ❌ No Quiz Data Found. Go back and generate notes first.
        <br />
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => navigate('/')}
        >
          ⬅ Back to Notes
        </button>
      </div>
    );
  }

  return (
    <div className="quiz-page px-4 py-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧠 Quiz Based on Your Notes</h1>

      {questions.map((q, index) => (
        <div key={index} className="mb-6 border-b pb-4">
          <h2 className="text-lg font-semibold">{index + 1}. {q.question}</h2>
          {q.options.map((opt, i) => (
            <label key={i} className="block ml-4 mt-1">
              <input
                type="radio"
                name={`q${index}`}
                value={opt}
                checked={answers[index] === opt}
                onChange={() => handleOptionChange(index, opt)}
              />
              <span className="ml-2">{opt}</span>
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        ✅ Submit Quiz
      </button>

      {score !== null && (
        <div className="mt-6 text-xl font-bold text-purple-700">
          🎉 You scored {score}/{questions.length}
        </div>
      )}
    </div>
  );
};

export default QuizPage;
