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
import "./App.css";
import NogenVoiceAssistant from "./components/NogenVoiceAssistant";
import { useSettings } from "./context/SettingsContext";
import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./Pages/RoleBasedRoute";
import StudentDashboard from "./Pages/StudentDashboard";
import TeacherDashboard from "./Pages/TeacherDashboard";
import Profile from "./Pages/Profile";
import SettingsPage from "./Pages/SettingsPage";
import HomeRedirect from "./components/HomeRedirect";

function App() {
  const { settings } = useSettings();

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

  // Effect to apply settings to the body or root element
  useEffect(() => {
    if (settings) {
      // Apply theme to documentElement for global CSS variables
      let themeToApply = settings.theme;

      if (settings.theme === 'system') {
        themeToApply = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      document.documentElement.setAttribute('data-theme', themeToApply);

      // Keep body classes for any legacy CSS
      document.body.classList.remove('theme-light', 'theme-dark');
      document.body.classList.add(`theme-${themeToApply}`);

      // Apply font size
      document.body.classList.remove('font-small', 'font-medium', 'font-large');
      document.body.classList.add(`font-${settings.fontSize}`);

      // Apply text style
      document.body.classList.remove('text-style-default', 'text-style-serif', 'text-style-monospace');
      document.body.classList.add(`text-style-${settings.textStyle}`);
    }
  }, [settings]);


  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomeRedirect />} />
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
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />

          {/* Correct way to route to CompilerPage */}

          {/* Role-based Routes */}
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
  );
}

export default App;