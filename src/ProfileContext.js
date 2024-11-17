import React, { createContext, useContext, useState, useEffect } from 'react';

// Context for managing profiles
const ProfileContext = createContext();

export const useProfiles = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const savedProfiles = localStorage.getItem('profiles');
    if (savedProfiles) {
      setProfiles(JSON.parse(savedProfiles));
    }
  }, []);

  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  const addProfile = (newProfile) => {
    setProfiles((prevProfiles) => [...prevProfiles, newProfile]);
  };

  const editProfile = (updatedProfile) => {
    setProfiles((prevProfiles) =>
      prevProfiles.map((profile) => (profile.id === updatedProfile.id ? updatedProfile : profile))
    );
  };

  const deleteProfile = (id) => {
    setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile.id !== id));
  };

  return (
    <ProfileContext.Provider value={{ profiles, addProfile, editProfile, deleteProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
