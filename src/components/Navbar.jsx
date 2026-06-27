// src/components/Navbar.jsx
// Handles: hamburger toggle, active link highlighting, login/logout dropdown.

import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/authService';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Navbar() {
  const { user, openAuthModal } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [navOpen, setNavOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });
  }, []);

  // Derived username — same logic as original: user.email.split("@")[0]
  const username = user ? user.email.split('@')[0] : null;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile nav when route changes
  useEffect(() => {
    setNavOpen(false);
  }, [location]);

  const handleLoginBtnClick = () => {
    if (user) {
      setDropdownOpen(prev => !prev);
    } else {
      openAuthModal();
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    navigate('/');
  };

  // Protected nav links — same list as original auth.js
  const protectedRoutes = ['/post', '/dashboard'];

  const handleProtectedNavClick = (e, to) => {
    if (protectedRoutes.includes(to) && !user) {
      e.preventDefault();
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          icon: 'info',
          title: 'Login Required',
          text: 'Please login to access this page.',
          confirmButtonText: 'Login Now'
        }).then(() => openAuthModal());
      });
    }
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header ref={headerRef} style={{ position: 'relative', zIndex: 9999 }}>
      <nav className="navbar">
        <Link to="/" className="logo">
          Left<span>Over</span>Love
        </Link>

        <ul className={`nav-links${navOpen ? ' active' : ''}`} id="nav-links">
          <li>
            <Link to="/" className={isActive('/')} onClick={(e) => handleProtectedNavClick(e, '/')}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/listings" className={isActive('/listings')} onClick={(e) => handleProtectedNavClick(e, '/listings')}>
              Listings
            </Link>
          </li>
          <li>
            <Link to="/post" className={isActive('/post')} onClick={(e) => handleProtectedNavClick(e, '/post')}>
              Post Food
            </Link>
          </li>
          <li>
            <Link to="/dashboard" className={isActive('/dashboard')} onClick={(e) => handleProtectedNavClick(e, '/dashboard')}>
              Dashboard
            </Link>
          </li>
        </ul>

        <div className="user-dropdown" ref={dropdownRef}>
          <button className="login-btn" id="loginBtn" onClick={handleLoginBtnClick}>
            {user ? username : 'Login / Sign Up'}
          </button>
          {user && dropdownOpen && (
            <div className="dropdown-content" id="userDropdown">
              <p id="userEmail">{user.email}</p>
              <button id="logoutBtn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>

        <div
          className="hamburger"
          id="hamburger"
          onClick={() => setNavOpen(prev => !prev)}
        >
          ☰
        </div>
      </nav>
    </header>
  );
}
