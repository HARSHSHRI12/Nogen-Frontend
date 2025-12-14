import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuestionList.css'; // Optional: You can add styles here

const QuestionList = ({ setSelectedQuestion }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3500/api/get-questions');
        setQuestions(response.data);
      } catch (error) {
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
            style={{
              cursor: 'pointer',
              border: '1px solid #ddd',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '8px',
              transition: '0.2s',
              backgroundColor: '#fafafa'
            }}
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
