import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { FiMessageSquare, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const AllConnections = () => {
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConnections = async () => {
            try {
                const response = await axiosInstance.get('/connections/all');
                setConnections(response.data);
            } catch (err) {
                console.error('Failed to fetch connections:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConnections();
    }, []);

    if (loading) return <div className="loading">Loading connections...</div>;

    return (
        <div className="network-grid">
            {connections.length > 0 ? (
                connections.map(conn => (
                    <div key={conn._id} className="connection-card-li">
                        <div className="card-top-pattern"></div>
                        <img
                            src={(conn.avatar || `https://ui-avatars.com/api/?name=${conn.name}&background=random`).replace('http://nogen-backend', 'https://nogen-backend')}
                            alt={conn.name}
                            className="connection-avatar"
                        />
                        <div className="connection-body">
                            <h3>{conn.name}</h3>
                            <p className="connection-role">{conn.role}</p>
                            <span className="mutual-count">12 mutual connections</span>
                            <div className="connection-actions">
                                <Link to={`/chat/${conn._id}`} className="btn-message-li">
                                    <FiMessageSquare /> Message
                                </Link>
                                <Link to={`/profile/${conn._id}`} className="btn-profile-li">
                                    <FiUser /> View
                                </Link>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state">
                    <p>No connections yet. Try finding some in Suggestions!</p>
                </div>
            )}
        </div>
    );
};

export default AllConnections;
