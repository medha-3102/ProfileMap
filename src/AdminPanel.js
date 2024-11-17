import React, { useState } from 'react';
import { useProfiles } from './ProfileContext';

const AdminPanel = () => {
  const { profiles, addProfile, editProfile, deleteProfile } = useProfiles();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    description: '',
    address: '',
    interests: '',
    image: '', 
  });
  const [previewImage, setPreviewImage] = useState(null); // For previewing uploaded image
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');

  // Reset form
  const resetForm = () => {
    setFormState({
      name: '',
      email: '',
      description: '',
      address: '',
      interests: '',
      image: '', 
    });
    setPreviewImage(null);
    setIsEditing(false);
    setEditId(null);
    setError('');
  };

  // Validate email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate form fields
  const validateForm = () => {
    if (!formState.name.trim() || !formState.email.trim() || !formState.description.trim() || !formState.address.trim()) {
      setError('Name, email, description, and location are required fields.');
      return false;
    }
    if (!validateEmail(formState.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  // Check for duplicate profile by name or email (only check if not editing)
  const checkForDuplicate = () => {
    if (!isEditing) {
      const duplicateProfile = profiles.find(
        (profile) => profile.name.toLowerCase() === formState.name.toLowerCase() || profile.email.toLowerCase() === formState.email.toLowerCase()
      );
      return duplicateProfile;
    }
    return null; // Skip duplicate check during edit
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormState({ ...formState, image: file }); // Save file in state
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result; // Base64 encoded image
        setPreviewImage(base64Image); // Set preview as Base64
        setFormState({ ...formState, image: base64Image }); // Save base64 string to form state
      };
      reader.readAsDataURL(file); // Read file as Base64
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    // Check for duplicate profiles only if not editing
    const duplicateProfile = checkForDuplicate();
    if (duplicateProfile) {
      setError('A profile with the same name or email already exists.');
      return;
    }

    const profileData = {
      ...formState,
      id: isEditing ? editId : Date.now(),
      interests: formState.interests.split(',').map((i) => i.trim()).filter((i) => i),
      image: formState.image || 'https://via.placeholder.com/150', // Store base64 image or placeholder if no image
    };

    if (isEditing) {
      editProfile(profileData);
    } else {
      addProfile(profileData);
    }

    resetForm();
  };

  // Handle edit click
  const handleEditClick = (profile) => {
    setFormState({
      name: profile.name,
      email: profile.email,
      description: profile.description,
      address: profile.address,
      interests: profile.interests.join(', '),
      image: profile.image, // Set image as base64 string from profile
    });
    setPreviewImage(profile.image); // Show current image (base64 string)
    setIsEditing(true);
    setEditId(profile.id);
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="text-center mb-4">
        <h3 className="fw-bold">{isEditing ? 'Edit Profile' : 'Add New Profile'}</h3>
      </div>

      {/* Form Section */}
      <div className="d-flex justify-content-center">
        <div className="card shadow-lg rounded border-0" style={{ maxWidth: '100%', width: '100%' }}>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  className="form-control"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Description *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Interests (comma-separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={formState.interests}
                  onChange={(e) => setFormState({ ...formState, interests: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Upload Image</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleImageChange} />
              </div>
              {previewImage && (
                <div className="col-12 mt-2 text-center">
                  <img src={previewImage} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '150px' }} />
                </div>
              )}
            </div>
            <div className="d-flex gap-2 mt-4 justify-content-center">
              <button
                className={`btn ${isEditing ? 'btn-success' : 'btn-primary'} w-auto`} // Reduced width to auto
                onClick={handleSubmit}
                style={{ minWidth: '150px' }} // Added a minimum width for consistency
              >
                {isEditing ? 'Save Changes' : 'Add Profile'}
              </button>
              {isEditing && (
                <button
                  className="btn btn-secondary w-auto"
                  onClick={resetForm}
                  style={{ minWidth: '150px' }} // Minimum width for Cancel button
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile List Section */}
      <div className="row mt-4">
        {profiles.length === 0 ? (
          <div className="col-12">
            <div className="alert alert-info text-center">No profiles added yet.</div>
          </div>
        ) : (
          profiles.map((profile) => (
            <div className="col-sm-6 col-md-4 col-lg-3 mb-3" key={profile.id}>
              <div className="card border-light shadow-sm rounded">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="card-img-top rounded-circle mx-auto mt-3"
                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                />
                <div className="card-body text-center">
                  <h6 className="card-title text-truncate" style={{ maxWidth: '200px', margin: '0 auto' }}>
                    {profile.name}
                  </h6>
                  <p className="card-text text-muted text-truncate" style={{ maxWidth: '200px', margin: '0 auto' }}>
                    {profile.description}
                  </p>
                  <div className="d-flex justify-content-between mt-2">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleEditClick(profile)}
                      style={{ minWidth: '70px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteProfile(profile.id)}
                      style={{ minWidth: '70px' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
