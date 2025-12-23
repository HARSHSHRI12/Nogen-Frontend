import { useEffect, useState, useRef, useCallback } from "react";
import axiosInstance from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit, FiSave, FiX, FiLogOut, FiLinkedin, FiGithub, FiUser, FiBriefcase, FiTarget, FiCamera, FiUpload, FiSettings } from "react-icons/fi";
import { FaUserGraduate, FaChalkboardTeacher } from "react-icons/fa";
import "./Profile.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link} from "react-router-dom";
import ProfileSettingsTab from './ProfileSettingsTab';

const Profile = () => {
  const { user, logout, updateUser, isAuthenticated } = useAuth(); // Added isAuthenticated
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('about');
  
  // New state for image upload
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // No longer need getToken, as tokens are HTTP-only cookies handled by the browser
  // and sent automatically by axios with withCredentials: true.

  const fetchProfile = useCallback(async () => {
    
    // Check if user exists in auth context
    if (!isAuthenticated) { // Use isAuthenticated from context
      navigate("/login");
      return;
    }

    try {
      // No need to manually add Authorization header, axios with withCredentials handles HTTP-only cookies
      const response = await axiosInstance.get("/profile/me");

      const data = response.data;
      setProfile(data);
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        skills: data.skills?.join(", ") || "",
        goals: data.goals || "",
        linkedIn: data.socialLinks?.linkedIn || "",
        github: data.socialLinks?.github || "",
      });
    } catch (err) {
      setError("Failed to fetch profile. Please login again.");
      // Redirect to login on 401 or other auth-related errors
      if (err.response && err.response.status === 401) {
        logout(); // Clear auth context on unauthorized
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, logout]); // Depend on isAuthenticated and logout

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]); // Depend on fetchProfile memoized by useCallback

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      if (!isAuthenticated) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

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

      const res = await axiosInstance.put("/profile", updatedData); // No manual headers
      setProfile(res.data);
      updateUser({ name: res.data.name }); // Update context
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile. " + (err.response?.data?.error || err.message));
      if (err.response && err.response.status === 401) {
        logout(); // Clear auth context on unauthorized
        navigate("/login");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleLogout = () => {
      logout();
      navigate("/login");
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
      if (!isAuthenticated) {
        setError("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const res = await axiosInstance.post("/upload/profile-pic", uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          // No manual Authorization header needed
        },
      });
      setProfile(res.data);
      updateUser({ profilePic: res.data.profilePic }); // Update context
      setPreviewSource('');
      setSelectedFile(null);
    } catch (err) {
      setError('Image upload failed. ' + (err.response?.data?.error || err.message));
      if (err.response && err.response.status === 401) {
        logout(); // Clear auth context on unauthorized
        navigate("/login");
      }
    } finally {
      setIsUploading(false);
    }
  };


  if (loading) return <div className="loading-spinner"></div>;
  if (error && !profile) return <div className="error-full-page">{error}</div>;

  const role = profile?.role || user?.role || "student"; // Use user from context if profile not loaded
  const RoleIcon = role === "teacher" ? FaChalkboardTeacher : FaUserGraduate;

  return (
    <div className="profile-container">
      <motion.div className="profile-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        
        {/* Left Column */}
        <motion.div className="profile-left" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <div className="profile-avatar-section">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            <img src={previewSource || profile?.profilePic || `https://i.pravatar.cc/150?u=${profile?._id}`} alt="Avatar" className="profile-avatar-main" />
            <button className="avatar-overlay" onClick={() => fileInputRef.current.click()}>
              <FiCamera />
            </button>
            <div className="role-badge-main"><RoleIcon /></div>
          </div>
          
          {previewSource && (
            <div className="upload-actions">
              <button className="btn-upload" onClick={handleImageUpload} disabled={isUploading}>
                {isUploading ? 'Uploading...' : <><FiUpload /> Upload</>}
              </button>
              <button className="btn-cancel-upload" onClick={() => setPreviewSource('')}><FiX /></button>
            </div>
          )}

          <h2 className="profile-name">{profile?.name}</h2>
          <p className="profile-email">{profile?.email}</p>
          <div className="profile-stats">
            <div className="stat-item"><span>12</span> Courses</div>
            <div className="stat-item"><span>8</span> Quizzes Taken</div>
            <div className="stat-item"><span>1250</span> E-Coins</div>
          </div>
          <div className="profile-actions-main">
            <button className="btn-edit" onClick={() => setEditMode(!editMode)}><FiEdit /> {editMode ? 'Cancel' : 'Edit Profile'}</button>
            <button className="btn-settings" onClick={() => setActiveTab('settings')}><FiSettings /> Settings</button>
            <button className="btn-logout" onClick={handleLogout}><FiLogOut /> Logout</button>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div className="profile-right" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}>
          {error && <p className="error-inline">{error}</p>}
          {editMode ? (
            <div className="edit-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Skills (comma-separated)</label>
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} />
              </div>
               <div className="form-group">
                <label>Goals</label>
                <textarea name="goals" value={formData.goals} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input type="text" name="linkedIn" value={formData.linkedIn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>GitHub URL</label>
                <input type="text" name="github" value={formData.github} onChange={handleChange} />
              </div>
              <button className="btn-save" onClick={handleUpdate} disabled={isUpdating}>
                {isUpdating ? 'Saving...' : <><FiSave /> Save Changes</>}
              </button>
            </div>
          ) : (
            <>
              <div className="profile-tabs">
                <button className={`tab ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}><FiUser /> About</button>
                <button className={`tab ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}><FiBriefcase /> Details</button>
                <button className={`tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><FiSettings /> Settings</button>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} className="tab-content" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {activeTab === 'about' && (
                    <div>
                      <h4>Bio</h4>
                      <p>{profile?.bio || "No bio yet."}</p>
                    </div>
                  )}
                  {activeTab === 'details' && (
                    <div>
                      <h4>Skills</h4>
                      <div className="skills-list-main">
                        {profile?.skills?.length > 0 ? profile.skills.map((s, i) => <span key={i} className="skill-tag-main">{s}</span>) : <p>No skills added.</p>}
                      </div>
                      <h4 className="mt-4">Goals</h4>
                      <p>{profile?.goals || "No goals set."}</p>
                      <h4 className="mt-4">Social Links</h4>
                      <div className="social-links-main">
                        {profile?.socialLinks?.linkedIn && <a href={profile.socialLinks.linkedIn} target="_blank" rel="noopener noreferrer"><FiLinkedin /> LinkedIn</a>}
                        {profile?.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"><FiGithub /> GitHub</a>}
                        {!profile?.socialLinks?.linkedIn && !profile?.socialLinks?.github && <p>No social links added.</p>}
                      </div>
                    </div>
                  )}
                  {activeTab === 'settings' && (
                    <ProfileSettingsTab />
                  )}
                </motion.div>
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Profile;
