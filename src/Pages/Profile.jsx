import { useEffect, useState, useRef, useCallback } from "react";
import axiosInstance from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiEdit, FiSave, FiX, FiLinkedin, FiGithub,
  FiUser, FiBriefcase, FiTarget, FiCamera, FiUpload,
  FiSettings, FiActivity, FiMapPin, FiMail, FiAlertCircle
} from "react-icons/fi";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import ProfileSettingsTab from './ProfileSettingsTab';
import GlassCard from "../components/common/GlassCard";
import AnimatedButton from "../components/common/AnimatedButton";

const Profile = () => {
  const { user, logout, updateUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from URL
  const isOwnProfile = !userId || (user && userId === user._id); // Check if it's the current user's profile

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  // Image Upload State
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Fetch Profile
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    try {
      const endpoint = isOwnProfile ? "/profile/me" : `/profile/${userId}`;
      const response = await axiosInstance.get(endpoint);
      const data = response.data;

      // Append timestamp to prevent caching issues and Force HTTPS
      if (data.profilePic) {
        if (data.profilePic.startsWith('http://') && data.profilePic.includes('onrender.com')) {
          data.profilePic = data.profilePic.replace('http://', 'https://');
        }
        data.profilePic = `${data.profilePic}?t=${new Date().getTime()}`;
      }

      setProfile(data);

      // Only update context if it's own profile
      if (isOwnProfile && typeof updateUser === 'function' && (
        user?.name !== data.name ||
        user?.profilePic !== data.profilePic ||
        user?.email !== data.email
      )) {
        updateUser({
          name: data.name,
          profilePic: data.profilePic,
          email: data.email
        });
      }

      // Initialize form data
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        skills: data.skills?.join(", ") || "",
        goals: data.goals || "",
        linkedIn: data.socialLinks?.linkedIn || "",
        github: data.socialLinks?.github || "",
      });
    } catch (err) {
      console.error("Profile Fetch Error:", err);
      // Fallback or specific error handling
      if (err.response && err.response.status === 404) {
        setError("Profile not found.");
      } else {
        setError("Failed to fetch profile. " + (err.response?.data?.message || err.message));
      }
      if (err.response && err.response.status === 401) {
        if (isOwnProfile) {
          logout();
          navigate("/login");
        }
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, logout, userId, isOwnProfile]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handlers
  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      const updatedData = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
        goals: formData.goals,
        socialLinks: {
          linkedIn: formData.linkedIn,
          github: formData.github,
        },
      };

      // Sending to /profile endpoint which is now the dedicated update route
      const res = await axiosInstance.put("/profile", updatedData);
      setProfile(res.data);
      updateUser({ name: res.data.name });
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile. " + (err.response?.data?.error || err.message));

    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPreviewSource(reader.result);
      };
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setError(null);

    const uploadData = new FormData();
    uploadData.append('profilePic', selectedFile);

    try {
      const res = await axiosInstance.post("/upload/profile-pic", uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const updatedProfile = res.data;
      // Add timestamp to bypass cache if it's the same URL
      if (updatedProfile.profilePic) {
        updatedProfile.profilePic = `${updatedProfile.profilePic}?t=${new Date().getTime()}`;
      }
      setProfile(updatedProfile);
      updateUser({ profilePic: updatedProfile.profilePic });
      setPreviewSource('');
      setSelectedFile(null);
    } catch (err) {
      setError('Image upload failed. ' + (err.response?.data?.error || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="loading-spinner"><div className="spinner-border text-primary" role="status"></div></div>;

  const role = profile?.role || user?.role || "student";
  const RoleIcon = role === "teacher" ? FaChalkboardTeacher : FaUserGraduate;

  return (
    <div className="profile-container">
      <div className="profile-header-bg"></div>

      <div className="profile-content-wrapper">

        {/* Full Image Upload Overlay */}
        <AnimatePresence>
          {previewSource && (
            <motion.div
              className="file-upload-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img src={previewSource} alt="Preview" className="upload-preview" />
              <div className="flex gap-4">
                <AnimatedButton onClick={handleImageUpload} disabled={isUploading} variant="primary">
                  {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </AnimatedButton>
                <AnimatedButton onClick={() => { setPreviewSource(''); setSelectedFile(null); }} variant="danger">
                  Cancel
                </AnimatedButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="profile-grid-layout">

          {/* Left Column: Identity Card */}
          <GlassCard className="profile-left-col" delay={0.1}>
            <div className="profile-card-header">
              <div className="profile-avatar-container" onClick={() => fileInputRef.current.click()}>
                <img
                  src={profile?.profilePic || `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`}
                  alt="Profile"
                  className="profile-avatar"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${profile?.name || 'User'}&background=random`; }}
                />
                {isOwnProfile && (
                  <div className="profile-avatar-overlay">
                    <FiCamera className="camera-icon" />
                  </div>
                )}
                {isOwnProfile && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    hidden
                  />
                )}
              </div >

              <div className="profile-identity">
                <h2>{profile?.name}</h2>
                <p>{profile?.email}</p>
                <div className="role-badge">
                  <RoleIcon /> {role.charAt(0).toUpperCase() + role.slice(1)}
                </div>
              </div>

              <div className="profile-stats-row">
                <div className="stat-box">
                  <span className="stat-value">12</span>
                  <span className="stat-label">Courses</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">85%</span>
                  <span className="stat-label">Avg. Score</span>
                </div>
                <div className="stat-box">
                  <span className="stat-value">1250</span>
                  <span className="stat-label">XP</span>
                </div>
              </div>
            </div >

            <div className="profile-actions-col">
              {isOwnProfile && (!editMode ? (
                <AnimatedButton
                  width="100%"
                  onClick={() => setEditMode(true)}
                  icon={<FiEdit />}
                >
                  Edit Profile
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  width="100%"
                  variant="danger"
                  onClick={() => { setEditMode(false); setError(null); }}
                  icon={<FiX />}
                >
                  Cancel Editing
                </AnimatedButton>
              ))}


            </div>
          </GlassCard >

          {/* Right Column: Details & Edit */}
          < GlassCard className="profile-right-col" delay={0.2} >
            {error && <div className="error-message"><FiAlertCircle className="inline mr-2" /> {error}</div>}

            {
              editMode ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="section-title"><FiEdit /> Edit Profile</h3>
                    <AnimatedButton onClick={handleUpdate} disabled={isUpdating} icon={<FiSave />}>
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </AnimatedButton>
                  </div>

                  <div className="edit-form-grid">
                    <div className="form-field">
                      <label>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                      <label>Bio</label>
                      <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" />
                    </div>
                    <div className="form-field full-width">
                      <label>Skills <small>(comma separated)</small></label>
                      <input type="text" name="skills" value={formData.skills} onChange={handleChange} />
                    </div>
                    <div className="form-field full-width">
                      <label>Goals</label>
                      <textarea name="goals" value={formData.goals} onChange={handleChange} rows="2" />
                    </div>
                    <div className="form-field">
                      <label>LinkedIn URL</label>
                      <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                    </div>
                    <div className="form-field">
                      <label>GitHub URL</label>
                      <input type="text" name="github" value={formData.github} onChange={handleChange} placeholder="https://github.com/..." />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  <div className="nav-tabs">
                    <button
                      className={`nav-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                      onClick={() => setActiveTab('about')}
                    >
                      About
                    </button>
                    <button
                      className={`nav-tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                      onClick={() => setActiveTab('details')}
                    >
                      Details
                    </button>
                    <button
                      className={`nav-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('settings')}
                    >
                      Settings
                    </button>
                  </div>

                  <div className="tab-content-area">
                    <AnimatePresence mode="wait">
                      {activeTab === 'about' && (
                        <motion.div
                          key="about"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <h4 className="section-title"><FiUser /> Bio</h4>
                          <p className="text-gray-300 leading-relaxed mb-6">
                            {profile?.bio || "No bio information available. Click edit to add a bio!"}
                          </p>

                          <h4 className="section-title"><FiActivity /> Recent Activity</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <label>Courses Completed</label>
                              <p>3</p>
                            </div>
                            <div className="info-item">
                              <label>Current Streak</label>
                              <p>5 Days</p>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'details' && (
                        <motion.div
                          key="details"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="mb-8">
                            <h4 className="section-title"><FiTarget /> Skills & Goals</h4>
                            <div className="skills-tags mb-4">
                              {profile?.skills?.length > 0 ? (
                                profile.skills.map((skill, idx) => (
                                  <span key={idx} className="skill-pill">{skill}</span>
                                ))
                              ) : (
                                <p className="text-gray-400">No skills listed.</p>
                              )}
                            </div>
                            <div className="info-item">
                              <label>Goals</label>
                              <p>{profile?.goals || "No goals set yet."}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="section-title"><FiBriefcase /> Social Connections</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {profile?.socialLinks?.linkedIn && (
                                <a href={profile.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer" className="social-link-card">
                                  <FiLinkedin size={24} /> <span>LinkedIn Profile</span>
                                </a>
                              )}
                              {profile?.socialLinks?.github && (
                                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link-card">
                                  <FiGithub size={24} /> <span>GitHub Profile</span>
                                </a>
                              )}
                              {!profile?.socialLinks?.linkedIn && !profile?.socialLinks?.github && (
                                <p className="text-gray-400">No social links added.</p>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'settings' && (
                        <motion.div
                          key="settings"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ProfileSettingsTab />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )
            }
          </GlassCard >
        </div >
      </div >
    </div >
  );
};

export default Profile;
