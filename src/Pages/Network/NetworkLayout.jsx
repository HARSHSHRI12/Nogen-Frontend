import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Network.css';

const NetworkLayout = () => {
    return (
        <div className="network-page">
            <div className="network-container">
                <header className="network-header">
                    <h1>My Network</h1>
                    <nav className="network-tabs">
                        <NavLink to="/network/all" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
                            All Connections
                        </NavLink>
                        <NavLink to="/network/suggestions" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
                            Suggestions
                        </NavLink>
                        <NavLink to="/network/requests" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
                            Requests
                        </NavLink>
                        <NavLink to="/network/feed" className={({ isActive }) => isActive ? 'tab-link active' : 'tab-link'}>
                            Feed
                        </NavLink>
                    </nav>
                </header>
                <main className="network-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default NetworkLayout;
