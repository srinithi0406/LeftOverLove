// src/components/Footer.jsx

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from(footerRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.3
    });
  }, []);

  return (
    <footer ref={footerRef}>
      <div className="footer-content">
        <div>
          <h4>Contact</h4>
          <p>Email: support@leftoverlove.org</p>
          <p>Phone: 987654321</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <p><Link to="/" className="active">Home</Link></p>
          <p><Link to="/post">Post Food</Link></p>
          <p><Link to="/dashboard">Dashboard</Link></p>
        </div>
        <div>
          <h4>Follow Us</h4>
          <p>
            <a href="#">Instagram</a> |{' '}
            <a href="#">LinkedIn</a> |{' '}
            <a href="#">X</a>
          </p>
        </div>
      </div>
      <p className="copyright">© 2025 LeftOverLove. All rights reserved.</p>
    </footer>
  );
}
