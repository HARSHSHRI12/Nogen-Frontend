import { useEffect } from 'react';
import ProfileSettings from './ProfileSettings';
import './SettingsPage.css';

const SettingsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-header">
          <h1>Settings</h1>
          <p>Manage your account preferences and app settings</p>
        </div>
        
        <ProfileSettings />
      </div>
    </div>
  );
};

export default SettingsPage;
