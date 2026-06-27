// src/pages/ViewPost.jsx
// Reads post ID from URL ?id=xxx, fetches from Firebase, renders read-only FoodCard.

import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { db } from '../services/firebase';
import FoodCard from '../components/FoodCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ViewPost() {
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('id');

  const [post, setPost] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'found' | 'expired' | 'notfound' | 'noid'
  const containerRef = useRef(null);

  useGSAP(() => {
    if (status === 'found') {
      gsap.from(containerRef.current.querySelector('.food-card'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(1.5)'
      });
    } else {
      gsap.from(containerRef.current.children, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    }
  }, { dependencies: [status] });

  useEffect(() => {
    if (!postId) {
      setStatus('noid');
      return;
    }

    // One-time fetch 
    get(ref(db, `foodPosts/${postId}`)).then((snapshot) => {
      const data = snapshot.val();

      if (!data) {
        setStatus('notfound');
        return;
      }

      if (data.expiryTime <= Date.now()) {
        setStatus('expired');
        return;
      }

      setPost({ ...data, key: postId });
      setStatus('found');
    });
  }, [postId]);

  return (
    <main className="view-post-page">
      <h2 className="view-post-title" style={{ color: '#00c853', marginBottom: '1.5rem', fontSize: '1.8rem' }}>
        Shared Food Post
      </h2>

      <div id="viewPostContainer" className="viewPostContainer" ref={containerRef}>
        {status === 'loading' && (
          <p style={{ color: '#888' }}>Loading post...</p>
        )}
        {status === 'noid' && (
          <p style={{ color: '#888' }}>No post ID found in URL.</p>
        )}
        {status === 'notfound' && (
          <p style={{ color: '#888' }}>Post not found or has expired.</p>
        )}
        {status === 'expired' && (
          <p style={{ color: '#888' }}>This post has expired.</p>
        )}
        {status === 'found' && post && (
          <FoodCard
            post={post}
            showShare={false}
            showMap={false}
            showEdit={false}
            showDelete={false}
          />
        )}
      </div>
    </main>
  );
}
