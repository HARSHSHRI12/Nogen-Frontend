import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import ECoin from "./Pages/ECoin";
import AiAssistant from "./Pages/AiAssistant";
import CodingPractice from "./Pages/CodingPractice";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import QuizPage from "./Pages/QuizPage";
// import "@fortawesome/fontawesome-free/css/all.min.css";
import "./App.css";
import NogenVoiceAssistant from "./components/NogenVoiceAssistant";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

//  Role-based routing imports
import RoleBasedRoute from "./Pages/RoleBasedRoute";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import Profile from "./Pages/Profile";


function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);

  useEffect(() => {
    const nogen = new NogenVoiceAssistant();
    nogen.start();
  }, []);

  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ecoin" element={<ECoin />} />
            <Route path="/ai-assistant" element={<AiAssistant />} />
            <Route path="/CodingPractice" element={<CodingPractice />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Correct way to route to CompilerPage */}
          

            <Route path="/" element={<h1>Welcome to Nogen AI</h1>} />

            {/*  Role-based Routes */}
            <Route
              path="/student-dashboard"
              element={
                <RoleBasedRoute allowedRole="student">
                  <StudentDashboard />
                </RoleBasedRoute>
              }
            />
            <Route
              path="/teacher-dashboard"
              element={
                <RoleBasedRoute allowedRole="teacher">
                  <TeacherDashboard />
                </RoleBasedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;