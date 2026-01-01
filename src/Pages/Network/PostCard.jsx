import React, { useState } from 'react';
import axiosInstance from '../../api/axios';
import { FiThumbsUp, FiMessageCircle, FiShare2, FiSend, FiMoreHorizontal, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const PostCard = ({ post, setPosts }) => {
    const { user } = useAuth();
    const [commentContent, setCommentContent] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const isLiked = post.likes.includes(user?._id);
    const isOwner = post.author._id?.toString() === user?._id?.toString();

    const handleLike = async () => {
        try {
            const response = await axiosInstance.post(`/posts/${post._id}/like`);
            setPosts(prev => prev.map(p =>
                p._id === post._id ? { ...p, likes: response.data.likes } : p
            ));
        } catch (err) {
            toast.error('Failed to like post');
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        try {
            const response = await axiosInstance.post(`/posts/${post._id}/comment`, { content: commentContent });
            setPosts(prev => prev.map(p =>
                p._id === post._id ? { ...p, comments: [...p.comments, response.data] } : p
            ));
            setCommentContent('');
            toast.success('Comment added!');
        } catch (err) {
            toast.error('Failed to add comment');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axiosInstance.delete(`/posts/${post._id}`);
            setPosts(prev => prev.filter(p => p._id !== post._id));
            toast.success('Post deleted successfully!');
            setShowDropdown(false);
        } catch (err) {
            toast.error('Failed to delete post');
        }
    };

    const handleEdit = () => {
        toast.info('Edit feature coming soon!');
        setShowDropdown(false);
    };

    return (
        <div className="linkedin-post-card">
            <div className="post-header-li">
                <img className="author-img" src={post.author.avatar || `https://ui-avatars.com/api/?name=${post.author.name}&background=random`} alt="" />
                <div className="author-info">
                    <span className="author-name">{post.author.name}</span>
                    <span className="author-role">{post.author.role} • 1st</span>
                    <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Show three dots only for post owner */}
                {isOwner && (
                    <div className="post-menu">
                        <button className="btn-more" onClick={() => setShowDropdown(!showDropdown)}>
                            <FiMoreHorizontal />
                        </button>
                        {showDropdown && (
                            <div className="post-dropdown">
                                <button onClick={handleEdit}>
                                    <FiEdit2 /> Edit Post
                                </button>
                                <button onClick={handleDelete} className="delete-btn">
                                    <FiTrash2 /> Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="post-body-li">
                <p>{post.content}</p>
            </div>

            {post.media?.url && (
                <div className="post-media-container">
                    {post.media.type === 'photo' && (
                        <img src={post.media.url} alt="" className="post-image-li" />
                    )}
                    {post.media.type === 'video' && (
                        <div className="post-video-embed">
                            <iframe
                                src={post.media.url}
                                title="Video"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="post-stats-li">
                <span>{post.likes.length} Likes</span>
                <span>{post.comments.length} Comments</span>
            </div>

            <div className="post-actions-li">
                <button className={`action-btn-li ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                    <FiThumbsUp /> <span>Like</span>
                </button>
                <button className="action-btn-li" onClick={() => setShowComments(!showComments)}>
                    <FiMessageCircle /> <span>Comment</span>
                </button>
                <button className="action-btn-li">
                    <FiShare2 /> <span>Share</span>
                </button>
                <button className="action-btn-li">
                    <FiSend /> <span>Send</span>
                </button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <form className="comment-form" onSubmit={handleComment}>
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                        />
                    </form>
                    <div className="comments-list">
                        {post.comments.map(comment => (
                            <div key={comment._id} className="comment-item">
                                <img src={comment.author.avatar || `https://ui-avatars.com/api/?name=${comment.author.name}&background=random`} alt="" />
                                <div className="comment-body">
                                    <strong>{comment.author.name}</strong>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
