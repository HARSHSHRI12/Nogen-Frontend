import React from "react";
import { Link } from 'react-router-dom';
const TeacherDashboard = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome to Teacher Dashboard</h1>
      <p>This section is accessible only to users with the teacher role.</p>
      <Link to="/profile">
  <button className="btn">Go to Profile</button>
</Link>
    </div>
  );
};

export default TeacherDashboard;
