import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import PostCard from './PostCard';
import CreatePost from './CreatePost';
import './Feed.css';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (pageNum = 1) => {
        try {
            const response = await axiosInstance.get(`/posts?page=${pageNum}&limit=10`);
            if (pageNum === 1) {
                setPosts(response.data.posts);
            } else {
                setPosts(prev => [...prev, ...response.data.posts]);
            }
            setHasMore(pageNum < response.data.totalPages);
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
        <div className="feed-container">
            <CreatePost onPostCreated={handlePostCreated} />
            <div className="posts-list">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} setPosts={setPosts} />
                ))}
                {loading && <div className="loading">Loading posts...</div>}
                {hasMore && !loading && (
                    <button className="load-more" onClick={() => {
                        setPage(p => p + 1);
                        fetchPosts(page + 1);
                    }}>
                        Load More
                    </button>
                )}
            </div>
        </div>
    );
};

export default Feed;
