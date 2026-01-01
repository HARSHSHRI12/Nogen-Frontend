import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';

const ConnectionRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axiosInstance.get('/connections/pending');
            setRequests(response.data);
        } catch (err) {
            console.error('Failed to fetch requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (requestId, action) => {
        try {
            if (action === 'accept') {
                await axiosInstance.put(`/connections/accept/${requestId}`);
            } else {
                await axiosInstance.delete(`/connections/reject/${requestId}`);
            }
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err) {
            alert('Action failed');
        }
    };

    if (loading) return <div className="loading">Loading requests...</div>;

    return (
        <div className="requests-container">
            {requests.length > 0 ? (
                requests.map(req => (
                    <div key={req._id} className="request-item">
                        <div className="request-user">
                            <img
                                src={req.requester.avatar || `https://ui-avatars.com/api/?name=${req.requester.name}&background=random`}
                                alt={req.requester.name}
                                className="request-avatar"
                            />
                            <div>
                                <strong>{req.requester.name}</strong>
                                <p className="user-role">{req.requester.role}</p>
                            </div>
                        </div>
                        <div className="request-actions">
                            <button className="btn-accept" onClick={() => handleAction(req._id, 'accept')}>Accept</button>
                            <button className="btn-reject" onClick={() => handleAction(req._id, 'reject')}>Reject</button>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-state">
                    <p>No pending requests.</p>
                </div>
            )}
        </div>
    );
};

export default ConnectionRequests;
