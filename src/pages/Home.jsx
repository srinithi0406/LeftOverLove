// src/pages/Home.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import hero2 from '../assets/hero2.png';

export default function Home() {
  const { user, openAuthModal } = useAuth();
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  useGSAP(() => {
    // Hero Text children slide up and fade in
    gsap.from(heroRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
    });

    // Features staggered fade up on scroll
    gsap.fromTo(featuresRef.current.children,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 85%',
        }
      }
    );
  }, []);

  // Protected feature button handler
  const handleProtectedClick = (e, path) => {
    if (!user) {
      e.preventDefault();
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          icon: 'info',
          title: 'Login Required',
          text: 'Please login to access this feature.',
          confirmButtonText: 'Login Now'
        }).then(() => openAuthModal());
      });
    }
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="hero"
        style={{
          backgroundImage: `url(${hero2})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover'
        }}
      >
        <div className="hero-text" ref={heroRef}>
          <h1>Share food. Save lives. Fight waste.</h1>
          <p>Help your community by giving leftover food a second chance.</p>
          <Link to="/post" className="cta-btn" onClick={(e) => handleProtectedClick(e, '/post')}>
            Get Started
          </Link>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features" ref={featuresRef}>
        <div className="feature">
          <img src="https://img.icons8.com/fluency/96/food.png" alt="Post" />
          <h3>Post Leftover Food</h3>
          <p>Share extra food with others around you with just a few clicks.</p>
          <Link
            to="/post"
            className="feature-btn"
            data-protected="true"
            onClick={(e) => handleProtectedClick(e, '/post')}
          >
            Post Now
          </Link>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/fluency/96/ingredients-list.png" alt="Listings" />
          <h3>View Listings</h3>
          <p>Filter and find food available near you in real-time.</p>
          <Link to="/listings" className="feature-btn">
            View Listings
          </Link>
        </div>
        <div className="feature">
          <img src="https://img.icons8.com/fluency/96/edit-property.png" alt="Dashboard" />
          <h3>Your Dashboard</h3>
          <p>Manage your posts, update quantities, and track pickups.</p>
          <Link
            to="/dashboard"
            className="feature-btn"
            data-protected="true"
            onClick={(e) => handleProtectedClick(e, '/dashboard')}
          >
            Go to Dashboard
          </Link>
        </div>
      </section>
    </>
  );
}
