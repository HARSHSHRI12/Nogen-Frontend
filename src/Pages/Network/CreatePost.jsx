import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { FiImage, FiVideo, FiCalendar, FiEdit3, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const CreatePost = ({ onPostCreated }) => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [mediaType, setMediaType] = useState(null); // 'photo', 'video', 'article'
    const [mediaUrl, setMediaUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.warning('Please write something!');
            return;
        }

        setLoading(true);
        try {
            const postData = { content };

            // Add media if present
            if (mediaUrl && mediaType) {
                postData.media = {
                    type: mediaType,
                    url: mediaUrl
                };
            }

            const response = await axiosInstance.post('/posts', postData);
            onPostCreated(response.data);

            // Reset form
            setContent('');
            setMediaUrl('');
            setMediaType(null);
            setShowModal(false);

            toast.success('Post created successfully! 🎉');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axiosInstance.post('/upload/image', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setMediaUrl(response.data.url);
            setMediaType('photo');
            toast.success('Image uploaded! 📸');
        } catch (err) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handleVideoUrl = () => {
        const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
        if (url) {
            setMediaUrl(url);
            setMediaType('video');
            toast.success('Video added! 🎥');
        }
    };

    const handleArticleMode = () => {
        setMediaType('article');
        toast.info('Article mode activated! ✍️');
    };

    const removeMedia = () => {
        setMediaUrl('');
        setMediaType(null);
    };

    return (
        <>
            <div className="create-post-container">
                <div className="create-post-top">
                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" />
                    <button className="fake-input" onClick={() => setShowModal(true)}>
                        Start a post
                    </button>
                </div>
                <div className="create-post-actions">
                    <button className="action-btn-trigger" onClick={() => setShowModal(true)}>
                        <FiImage style={{ color: '#378fe9' }} /> <span>Photo</span>
                    </button>
                    <button className="action-btn-trigger" onClick={() => setShowModal(true)}>
                        <FiVideo style={{ color: '#5f9b41' }} /> <span>Video</span>
                    </button>
                    <button className="action-btn-trigger" onClick={() => setShowModal(true)}>
                        <FiCalendar style={{ color: '#c37d16' }} /> <span>Event</span>
                    </button>
                    <button className="action-btn-trigger" onClick={() => setShowModal(true)}>
                        <FiEdit3 style={{ color: '#e06847' }} /> <span>Article</span>
                    </button>
                </div>
            </div>

            {showModal && (
                <div className="post-modal-overlay">
                    <div className="post-modal">
                        <div className="post-modal-header">
                            <h3>Create a post</h3>
                            <button className="close-modal" onClick={() => setShowModal(false)}><FiX /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="post-modal-body">
                                <div className="user-summary">
                                    <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} alt="" />
                                    <div>
                                        <h4>{user?.name}</h4>
                                        <span>Post to Anyone</span>
                                    </div>
                                </div>

                                <textarea
                                    className="post-textarea"
                                    placeholder={mediaType === 'article' ? 'Write your article...' : 'What do you want to talk about?'}
                                    autoFocus
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={mediaType === 'article' ? 10 : 4}
                                />

                                {/* Media Preview */}
                                {mediaUrl && (
                                    <div className="media-preview">
                                        {mediaType === 'photo' && (
                                            <div className="image-preview">
                                                <img src={mediaUrl} alt="Preview" />
                                                <button type="button" className="remove-media" onClick={removeMedia}>
                                                    <FiX />
                                                </button>
                                            </div>
                                        )}
                                        {mediaType === 'video' && (
                                            <div className="video-preview">
                                                <FiVideo size={40} />
                                                <p>{mediaUrl}</p>
                                                <button type="button" className="remove-media" onClick={removeMedia}>
                                                    <FiX />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Media Upload Actions */}
                                <div className="post-media-actions">
                                    <label className="media-upload-btn">
                                        <FiImage />
                                        <span>Photo</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            style={{ display: 'none' }}
                                            disabled={uploading}
                                        />
                                    </label>
                                    <button type="button" className="media-upload-btn" onClick={handleVideoUrl}>
                                        <FiVideo />
                                        <span>Video</span>
                                    </button>
                                    <button type="button" className="media-upload-btn" onClick={handleArticleMode}>
                                        <FiEdit3 />
                                        <span>Article</span>
                                    </button>
                                </div>
                            </div>
                            <div className="post-modal-footer">
                                <button
                                    type="submit"
                                    className="submit-post-btn"
                                    disabled={!content.trim() || loading || uploading}
                                >
                                    {uploading ? 'Uploading...' : loading ? 'Posting...' : 'Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreatePost;
