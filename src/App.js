import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { ProfileProvider } from './ProfileContext';
import ProfileListPage from './ProfileListPage';
import ProfileDetails from './pages/ProfileDetails';
import AdminPanel from './AdminPanel';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { FaMapPin } from 'react-icons/fa'; 
import './App.css'; 


const App = () => {
  return (
    <ProfileProvider>
      <Router>
        <div className="app" style={{ backgroundColor: '#f8f9fa' }}>
          {/* Header with Navbar */}
          <header className="bg-info text-white py-4 shadow-sm">
            <div className="container d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <FaMapPin size={36} className="me-2" />
                <h1 className="h3 mb-0">PeopleMap</h1>
              </div>
              <nav>
                <NavLink
                  to="/"
                  className="text-white me-4 text-decoration-none"
                  activeClassName="fw-bold text-warning"
                >
                  Profiles
                </NavLink>
                <NavLink
                  to="/admin"
                  className="text-white text-decoration-none"
                  activeClassName="fw-bold text-warning"
                >
                  Admin
                </NavLink>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="py-5">
            <div className="container">
              <Routes>
                <Route path="/" element={<ProfileListPage />} />
                <Route path="/profile/:id" element={<ProfileDetails />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </div>
          </main>

          {/* Footer */}
          <footer className="bg-dark text-white py-4 mt-auto">
            <div className="container text-center">
              <p className="mb-0">&copy; 2024 PeopleMap. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </Router>
    </ProfileProvider>
  );
};

export default App;
