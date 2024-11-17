import React from 'react';

const ProfileCard = ({ profile, onSummaryClick }) => (
  <div className="profile-card">
    <img src={profile.image} alt={profile.name} />
    <h3>{profile.name}</h3>
    <p>{profile.description}</p>
    <button onClick={onSummaryClick}>Summary</button>
  </div>
);

export default ProfileCard;
