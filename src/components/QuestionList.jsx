import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const QuestionList = ({ setSelectedQuestion }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axiosInstance.get('/get-questions');
        setQuestions(response.data);
      } catch (error) => {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="question-list">
      <h3>Available Coding Problems</h3>
      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length > 0 ? (
        questions.map((question) => (
          <div 
            key={question._id || question.id}
            onClick={() => setSelectedQuestion(question)}
            className="question-item"
          >
            <h4>{question.title}</h4>
            <p>{question.description}</p>
          </div>
        ))
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
};

export default QuestionList;
