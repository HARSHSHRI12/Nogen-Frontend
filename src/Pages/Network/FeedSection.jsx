import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import './Feed.css';

const FeedSection = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const response = await axiosInstance.get('/posts?limit=10');
            setPosts(response.data.posts);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts(prev => [newPost, ...prev]);
    };

    return (
        <div className="feed-section">
            <CreatePost onPostCreated={handlePostCreated} />
            <div className="posts-list">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} setPosts={setPosts} />
                ))}
                {loading && <div className="loading">Loading feed...</div>}
                {!loading && posts.length === 0 && (
                    <div className="empty-feed">
                        <p>No posts yet. Be the first to start a conversation!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedSection;
