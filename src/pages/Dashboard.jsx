// src/pages/Dashboard.jsx
// Migrated from dashboard.html + js/dashboard.js
// Protected route (auth guard) is handled by ProtectedRoute in App.jsx.

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, remove, update, get } from 'firebase/database';
import { db, auth } from '../services/firebase';
import Swal from 'sweetalert2';
import FoodCard from '../components/FoodCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  const headerRef = useRef(null);
  const badgeRef = useRef(null);
  const gridRef = useRef(null);

  useGSAP(() => {
    gsap.from(headerRef.current, { y: -20, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.fromTo(badgeRef.current,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.3 }
    );
  }, []);



  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const currentUserEmail = user.email;
    const sanitizedEmail = user.email.replace(/\./g, '_');

    // Load total contribution count 
    const countRef = ref(db, `users/${sanitizedEmail}/postCount`);
    get(countRef).then((snapshot) => {
      setPostCount(snapshot.val() || 0);
    });

    // Real-time listener filtered to current user's active posts
    const dbRef = ref(db, 'foodPosts');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const now = Date.now();
      const userPosts = [];

      snapshot.forEach((childSnap) => {
        const post = childSnap.val();
        const key = childSnap.key;

        if (post.userEmail === currentUserEmail && post.expiryTime > now) {
          userPosts.push({ ...post, key });
        }
      });

      setPosts(userPosts);
    });

    return () => unsubscribe();
  }, []);

  // Delete with Swal config
  const handleDelete = (postId) => {
    Swal.fire({
      title: 'Delete this post?',
      text: "You won't be able to recover it.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#00c853',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it'
    }).then((result) => {
      if (result.isConfirmed) {
        remove(ref(db, `foodPosts/${postId}`));
      }
    });
  };

  // Edit with validation + Firebase update logic
  const handleEdit = (postId, post) => {
    Swal.fire({
      title: 'Edit Post',
      customClass: {
        container: 'edit-modal-container',
      },
      html: `
        <div class="edit-form-group">
          <label class="edit-label">Food Name</label>
          <input id="edit-foodName" class="edit-input" placeholder="e.g. Vegetable Biryani" value="${post.foodName || ''}" />
        </div>
        <div class="edit-form-group">
          <label class="edit-label">Quantity</label>
          <input id="edit-quantity" class="edit-input" placeholder="e.g. 5 servings" value="${post.quantity || ''}" />
        </div>
        <div class="edit-form-group">
          <label class="edit-label">Food Type</label>
          <select id="edit-foodType" class="edit-select">
            <option value="Veg" ${post.foodType === 'Veg' ? 'selected' : ''}>Veg</option>
            <option value="Non-Veg" ${post.foodType === 'Non-Veg' ? 'selected' : ''}>Non-Veg</option>
          </select>
        </div>
        <div class="edit-form-group">
          <label class="edit-label">Pickup Location</label>
          <input id="edit-location" class="edit-input" placeholder="e.g. 12 Gandhi Street, Chennai" value="${post.location || ''}" />
        </div>
        <div class="edit-form-group">
          <label class="edit-label">Additional Notes</label>
          <textarea id="edit-description" class="edit-textarea" placeholder="Any details or special instructions">${post.description || ''}</textarea>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Save Changes',
      preConfirm: () => {
        const updatedPost = {
          foodName: document.getElementById('edit-foodName').value.trim(),
          quantity: document.getElementById('edit-quantity').value.trim(),
          foodType: document.getElementById('edit-foodType').value,
          location: document.getElementById('edit-location').value.trim(),
          description: document.getElementById('edit-description').value.trim(),
        };

        if (!updatedPost.foodName || !updatedPost.quantity || !updatedPost.location) {
          Swal.showValidationMessage('Please fill out all required fields.');
          return false;
        }

        return updatedPost;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        update(ref(db, `foodPosts/${postId}`), result.value);
      }
    });
  };


  return (
    <main className="dashboard-page">
      <div className="dashboard-header" ref={headerRef}>
        <h2 className="dashboard-title">Your Active Posts</h2>
        <div className="contributions-wrapper">
          <span className="post-count-label">Total Contributions:</span>
          <div className="post-count-badge" id="postCountBadge" ref={badgeRef}>
            {postCount}
          </div>
        </div>
      </div>

      <div id="dashboardGrid" className="listings-grid" ref={gridRef}>
        {posts.length === 0 ? (
          <p style={{ color: '#888' }}>You have no active posts.</p>
        ) : (
          posts.map((post, index) => (
            <FoodCard
              key={post.key}
              post={post}
              showEdit={true}
              showDelete={true}
              showShare={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
              index={index}
            />
          ))
        )}
      </div>
    </main>
  );
}
