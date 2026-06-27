// src/pages/Post.jsx

import { ref, push, get, set } from 'firebase/database';
import { useState, useRef } from 'react';
import { db, auth } from '../services/firebase';
import Swal from 'sweetalert2';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Post() {
  const containerRef = useRef(null);

  useGSAP(() => {
    gsap.from(containerRef.current.children, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    });
  }, []);

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    location: '',
    expiry: '',
    foodType: '',
    description: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      Swal.fire('Login Required', 'Please log in to post food.', 'warning');
      return;
    }

    const { foodName, quantity, location, expiry, foodType, description } = formData;

    if (!expiry) {
      Swal.fire('Missing Expiry', 'Please select expiry date and time.', 'error');
      return;
    }

    const expiryTime = new Date(expiry).getTime();
    const now = Date.now();

    if (expiryTime <= now) {
      Swal.fire('Invalid Expiry', 'Expiry must be a future date/time.', 'error');
      return;
    }

    const postData = {
      foodName: foodName.trim(),
      quantity: quantity.trim(),
      location: location.trim(),
      expiryTime,
      foodType,
      description: description.trim(),
      userEmail: user.email,
      createdAt: now,
    };

    try {
      // Push to Firebase 
      await push(ref(db, 'foodPosts'), postData);

      Swal.fire('Success', 'Your food post has been submitted!', 'success');

      // Reset form
      setFormData({
        foodName: '',
        quantity: '',
        location: '',
        expiry: '',
        foodType: '',
        description: '',
      });

      // Increment user post count 
      const sanitizedEmail = user.email.replace(/\./g, '_');
      const userRef = ref(db, `users/${sanitizedEmail}/postCount`);
      const snapshot = await get(userRef);
      const currentCount = snapshot.val() || 0;
      await set(userRef, currentCount + 1);

    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  return (
    <main className="post-container" ref={containerRef}>
      <h2 className="post-section-title">Post Leftover Food</h2>
      <p className="post-subtitle">Share excess food with your community by filling this form.</p>

      <form className="post-form" id="postForm" onSubmit={handleSubmit}>

        <label htmlFor="foodName">Food Name</label>
        <input
          type="text"
          id="foodName"
          placeholder="e.g., Vegetable Biryani"
          required
          value={formData.foodName}
          onChange={handleChange}
        />

        <label htmlFor="quantity">Quantity (servings or packs)</label>
        <input
          type="number"
          id="quantity"
          placeholder="e.g., 5"
          required
          value={formData.quantity}
          onChange={handleChange}
        />

        <label htmlFor="location">Pickup Location</label>
        <input
          type="text"
          id="location"
          placeholder="e.g., 12 Gandhi Street, Chennai"
          required
          value={formData.location}
          onChange={handleChange}
        />

        <label htmlFor="expiry">Expiry Date &amp; Time</label>
        <input
          type="datetime-local"
          id="expiry"
          required
          value={formData.expiry}
          onChange={handleChange}
        />

        <label htmlFor="foodType">Type</label>
        <select
          id="foodType"
          required
          value={formData.foodType}
          onChange={handleChange}
        >
          <option value="">-- Select --</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <label htmlFor="description">Additional Notes (optional)</label>
        <textarea
          id="description"
          rows="3"
          placeholder="Any details, special instructions, etc."
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit" className="post-submit-btn">
          Submit Food Post
        </button>
      </form>
    </main>
  );
}
