import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiEdit, FiSave, FiX, FiLogOut } from "react-icons/fi";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import "./Profile.css";
import { useAuth } from "../context/AuthContext"; // Correct path to AuthContext

const Profile = () => {
  const { logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    skills: "",
    goals: "",
    socialLinks: {
      linkedIn: "",
      github: "",
    },
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const getToken = () =>
    localStorage.getItem("token") || sessionStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) {
          setError("You are not logged in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:3500/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data;
        setProfile(data);
        setFormData({
          name: data.name || "",
          bio: data.bio || "",
          skills: data.skills?.join(", ") || "",
          goals: data.goals || "",
          socialLinks: {
            linkedIn: data.socialLinks?.linkedIn || "",
            github: data.socialLinks?.github || "",
          },
        });
      } catch (err) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = getToken();
      const updatedData = {
        ...formData,
        skills: formData.skills.split(",").map((skill) => skill.trim()),
      };

      const res = await axios.put("http://localhost:3500/api/profile", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data);
      setEditMode(false);
      setSuccessMessage("Profile updated successfully.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError("Failed to update profile.");
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "linkedIn" || name === "github") {
      setFormData((prev) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    // Reset form data to original profile data
  };
  
  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = "/login";
  };


  if (loading) return <div className="loading-container">Loading Profile...</div>;

  const role = profile?.user?.role || "student";
  const RoleIcon = role === "teacher" ? FaChalkboardTeacher : FaUserGraduate;

  return (
    <div className="profile-page">
      <motion.div
        className="profile-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <img
              src={profile?.profilePic || `https://i.pravatar.cc/150?u=${profile?._id}`}
              alt="Avatar"
              className="profile-avatar"
            />
            <div className="role-badge">
              <RoleIcon />
            </div>
          </div>
          <div className="profile-title">
            <h2>{profile?.name}</h2>
            <p className="email">{profile?.email}</p>
          </div>
          <div className="profile-actions">
            {editMode ? (
              <>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="action-btn save-btn" onClick={handleUpdate}><FiSave /> Save</motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="action-btn cancel-btn" onClick={handleCancelEdit}><FiX /> Cancel</motion.button>
              </>
            ) : (
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="action-btn edit-btn" onClick={() => setEditMode(true)}><FiEdit /> Edit Profile</motion.button>
            )}
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="action-btn logout-btn" onClick={handleLogout}><FiLogOut /> Logout</motion.button>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}
        {successMessage && <div className="success-msg">{successMessage}</div>}

        <div className="profile-content">
          <div className="profile-section">
            <h3>About Me</h3>
            {editMode ? (
              <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Your bio..."></textarea>
            ) : (
              <p>{profile?.bio || "No bio yet."}</p>
            )}
          </div>

          <div className="profile-section">
            <h3>Skills</h3>
            {editMode ? (
              <input type="text" name="skills" value={formData.skills} onChange={handleChange} placeholder="e.g., React, Node.js, ..." />
            ) : (
              <div className="skills-list">
                {profile?.skills?.length > 0 ? (
                  profile.skills.map((skill, index) => <span key={index} className="skill-tag">{skill}</span>)
                ) : (
                  <p>No skills listed.</p>
                )}
              </div>
            )}
          </div>

          <div className="profile-section">
            <h3>My Goals</h3>
            {editMode ? (
              <textarea name="goals" value={formData.goals} onChange={handleChange} placeholder="Your goals..."></textarea>
            ) : (
              <p>{profile?.goals || "No goals set."}</p>
            )}
          </div>
          
          <div className="profile-section">
            <h3>Social Links</h3>
            {editMode ? (
              <div className="social-inputs">
                <input type="text" name="linkedIn" value={formData.socialLinks.linkedIn} onChange={handleChange} placeholder="LinkedIn URL" />
                <input type="text" name="github" value={formData.socialLinks.github} onChange={handleChange} placeholder="GitHub URL" />
              </div>
            ) : (
              <div className="social-links">
                <a href={profile?.socialLinks?.linkedIn} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href={profile?.socialLinks?.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;