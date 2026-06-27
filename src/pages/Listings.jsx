// src/pages/Listings.jsx
// Includes: real-time Firebase listener, type/location/food filters, FoodCard with Share + Map.

import { useEffect, useState, useRef } from 'react';
import { ref, onValue, remove } from 'firebase/database';
import { db } from '../services/firebase';
import FoodCard from '../components/FoodCard';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function Listings() {
  const [allPosts, setAllPosts] = useState([]);

  // Filter state — mirrors original: typeFilter, locationFilter, foodSearch
  const [typeFilter, setTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [foodSearch, setFoodSearch] = useState('');

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  // Filter logic — same as original applyFilters()
  const filteredPosts = allPosts.filter((post) => {
    const selectedType = typeFilter.toLowerCase();
    const locationQuery = locationFilter.trim().toLowerCase();
    const foodQuery = foodSearch.trim().toLowerCase();

    const matchesType =
      selectedType === 'all' ||
      (post.foodType && post.foodType.toLowerCase() === selectedType);

    const matchesLocation =
      !locationQuery ||
      (post.location && post.location.toLowerCase().includes(locationQuery));

    const matchesFood =
      !foodQuery ||
      (post.foodName && post.foodName.toLowerCase().includes(foodQuery));

    return matchesType && matchesLocation && matchesFood;
  });

  useGSAP(() => {
    gsap.from(sidebarRef.current, { x: -50, opacity: 0, duration: 0.8, ease: 'power3.out' });
    gsap.from(contentRef.current.querySelector('.search-input'), { y: -20, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
  }, []);



  // Real-time listener — same as original: dbRef.on("value", ...)
  useEffect(() => {
    const dbRef = ref(db, 'foodPosts');
    const now = Date.now();

    const unsubscribe = onValue(dbRef, (snapshot) => {
      const posts = [];

      snapshot.forEach((childSnap) => {
        const post = childSnap.val();
        const key = childSnap.key;

        // Remove expired posts from DB — same as original listings.js
        if (post.expiryTime <= Date.now()) {
          remove(ref(db, `foodPosts/${key}`));
          return;
        }

        posts.push({ ...post, key });
      });

      setAllPosts(posts);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);



  const handleClearFilters = () => {
    setTypeFilter('all');
    setLocationFilter('');
    setFoodSearch('');
  };

  return (
    <>
      <main className="listings-page">
        {/* Sidebar Filters */}
        <aside className="sidebar" ref={sidebarRef}>
          <h3>Filter Listings</h3>

          <label htmlFor="typeFilter">Food Type:</label>
          <select
            id="typeFilter"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Veg">Veg</option>
            <option value="Non-Veg">Non-Veg</option>
          </select>

          <label htmlFor="locationFilter">Location:</label>
          <input
            type="text"
            id="locationFilter"
            placeholder="e.g. Anna Nagar"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />

          <button id="clearFiltersBtn" className="clear-btn" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </aside>

        {/* Listings Content */}
        <section className="listings-content" ref={contentRef}>
          <input
            type="text"
            id="foodSearch"
            placeholder="Search food name..."
            className="search-input"
            value={foodSearch}
            onChange={(e) => setFoodSearch(e.target.value)}
          />

          <div className="listings-grid" id="listingsGrid">
            {filteredPosts.length === 0 ? (
              <p style={{ color: '#888' }}>No posts found matching your filters.</p>
            ) : (
              filteredPosts.map((post, index) => (
                <FoodCard
                  key={post.key}
                  post={post}
                  showShare={true}
                  showMap={true}
                  index={index}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </>
  );
}
