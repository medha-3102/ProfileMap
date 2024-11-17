import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProfiles } from '../ProfileContext';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import 'bootstrap/dist/css/bootstrap.min.css';

// Custom marker setup
const customMarker = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const ProfileDetails = () => {
  const { id } = useParams();
  const { profiles } = useProfiles();
  const [profile, setProfile] = useState(null);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  const geocodeAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchProfileDetails = async () => {
      setLoading(true);
      try {
        const foundProfile = profiles.find((p) => p.id === parseInt(id));

        if (foundProfile) {
          const geoLocation = await geocodeAddress(foundProfile.address);
          setCoordinates(geoLocation || { lat: 40.7128, lng: -74.0060 });
          setProfile(foundProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileDetails();
  }, [id, profiles]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger" role="alert">
          Profile not found.
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* Profile Information */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header text-center bg-light">
              <img
                src={profile.image || 'https://via.placeholder.com/150'}
                alt={profile.name}
                className="rounded-circle mb-3 shadow-sm"
                style={{ width: '100px', height: '100px', objectFit: 'cover' }}
              />
              <h5 className="card-title fw-bold">{profile.name}</h5>
            </div>
            <div className="card-body">
              <p className="mb-2">
                <strong>Email:</strong> <span className="text-muted">{profile.email}</span>
              </p>
              <p className="mb-2">
                <strong>Location:</strong> <span className="text-muted">{profile.address}</span>
              </p>
              <p className="mb-2">
                <strong>About:</strong> <span className="text-muted">{profile.description}</span>
              </p>
              <p className="mb-2">
                <strong>Interests:</strong>
                <ul className="list-inline mt-2">
                  {profile.interests.map((interest, index) => (
                    <li
                      key={index}
                      className="list-inline-item badge bg-primary text-light px-3 py-2 shadow-sm"
                    >
                      {interest}
                    </li>
                  ))}
                </ul>
              </p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-light text-center fw-bold">
              Location on Map
            </div>
            <div className="card-body p-0">
              {coordinates && (
                <MapContainer
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={13}
                  style={{
                    height: '400px',
                    width: '100%',
                    borderRadius: '0 0 10px 10px',
                  }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={[coordinates.lat, coordinates.lng]}
                    icon={customMarker}
                  >
                    <Popup>
                      <strong>{profile.name}</strong>
                      <br />
                      {profile.address}
                    </Popup>
                  </Marker>
                </MapContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
