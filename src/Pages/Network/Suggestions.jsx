import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { FiUserPlus, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const Suggestions = () => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pendingIds, setPendingIds] = useState(new Set());

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axiosInstance.get('/connections/suggestions');
                setSuggestions(response.data);
            } catch (err) {
                console.error('Failed to fetch suggestions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const handleConnect = async (userId) => {
        try {
            await axiosInstance.post('/connections/request', { recipientId: userId });
            setPendingIds(prev => new Set([...prev, userId]));
        } catch (err) {
            alert(err.response?.data?.error || 'Failed to send request');
        }
    };

    if (loading) return <div className="loading">Loading suggestions...</div>;

    return (
        <div className="network-grid">
            {suggestions.length > 0 ? (
                suggestions.map(user => (
                    <div key={user._id} className="user-card">
                        <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                            alt={user.name}
                            className="user-avatar"
                        />
                        <div className="user-info">
                            <h3>{user.name}</h3>
                            <span className="user-role">{user.role}</span>
                            <div className="card-actions">
                                <button
                                    className="btn-connect"
                                    onClick={() => handleConnect(user._id)}
                                    disabled={pendingIds.has(user._id)}
                                >
                                    {pendingIds.has(user._id) ? 'Request Sent' : <><FiUserPlus /> Connect</>}
                                </button>
                                <Link to={`/profile/${user._id}`} className="btn-message">
                                    <FiUser /> Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state">
                    <p>No suggestions at the moment. Check back later!</p>
                </div>
            )}
        </div>
    );
};

export default Suggestions;
