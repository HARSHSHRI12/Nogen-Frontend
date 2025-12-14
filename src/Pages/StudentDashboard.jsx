// pages/student/StudentDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div>
      <h1>Hello Welcome to student desboard....</h1>
      <p>we are create for </p>
      <Link to="/profile">
  <button className="btn">Go to Profile</button>
</Link>

    </div>
  );
};

export default StudentDashboard;
