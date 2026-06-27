// src/components/FoodCard.jsx
// Shared food card used by Listings, Dashboard, and ViewPost pages.
// Props control which action buttons are rendered.

import Swal from 'sweetalert2';
import { QRCodeCanvas } from 'qrcode.react';
import ReactDOM from 'react-dom/client';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * @param {object} post      - The food post data object
 * @param {boolean} showShare  - Show the Share button (QR modal)
 * @param {boolean} showMap    - Show the Show on Map button
 * @param {boolean} showEdit   - Show the Edit button (dashboard only)
 * @param {boolean} showDelete - Show the Delete button (dashboard only)
 * @param {function} onEdit    - Called with (postId, postData) when Edit is clicked
 * @param {function} onDelete  - Called with (postId) when Delete is confirmed
 */
export default function FoodCard({
  post,
  showShare = false,
  showMap = false,
  showEdit = false,
  showDelete = false,
  onEdit,
  onDelete,
  index = 0,
}) {
  const cardRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { y: 60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.2)', delay: index * 0.1 }
    );
  }, []);
  const handleShare = () => {

    const shareUrl = `${window.location.origin}/view-post?id=${post.key}`;

    Swal.fire({
      title: 'Share This Post',
      html: `
        <p>Scan this QR code to open the post:</p>
        <div id="qr-code-container" style="display: flex; justify-content: center; margin-top: 1rem;"></div>
        <p style="margin-top:10px;"><a href="${shareUrl}" target="_blank">${shareUrl}</a></p>
      `,
      didOpen: () => {
        const qrContainer = document.getElementById('qr-code-container');
        qrContainer.innerHTML = '';
        const tempDiv = document.createElement('div');
        qrContainer.appendChild(tempDiv);
        const root = ReactDOM.createRoot(tempDiv);
        root.render(
          <QRCodeCanvas
            value={shareUrl}
            size={150}
            fgColor="#00c853"
            bgColor="#ffffff"
          />
        );
      }
    });
  };

  const handleMap = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location)}`;
    window.open(mapUrl, '_blank');
  };

  // Dashboard layout: Edit + Delete in action-buttons row, Share below as full-width
  // Listings layout:  Share full-width, Map full-width (both direct children of flex column)
  const isDashboardCard = showEdit || showDelete;

  return (
    <div className="food-card" ref={cardRef}>
      <img
        src="https://img.icons8.com/fluency-systems-filled/96/4CAF50/meal.png"
        alt="Food Icon"
        className="card-img"
      />
      <div className="food-card-body">
        <h3>{post.foodName}</h3>
        <p><strong>Quantity:</strong> {post.quantity}</p>
        <p><strong>Type:</strong> {post.foodType}</p>
        <p><strong>Location:</strong> {post.location}</p>
        <p><strong>Expires:</strong> {new Date(post.expiryTime).toLocaleString()}</p>
        {post.description && <p><strong>Notes:</strong> {post.description}</p>}

        {/* Dashboard: Edit + Delete side by side in action-buttons */}
        {isDashboardCard && (
          <div className="action-buttons">
            {showEdit && (
              <button
                className="edit-btn"
                data-id={post.key}
                onClick={() => onEdit && onEdit(post.key, post)}
              >
                Edit
              </button>
            )}
            {showDelete && (
              <button
                className="delete-btn"
                data-id={post.key}
                onClick={() => onDelete && onDelete(post.key)}
              >
                Delete
              </button>
            )}
          </div>
        )}

        {/* Share button — always a direct child of food-card-body = full width */}
        {showShare && (
          <button className="share-btn" data-id={post.key} onClick={handleShare}>
            Share
          </button>
        )}

        {/* Map button — direct child of food-card-body = full width */}
        {showMap && (
          <button className="map-btn" data-location={post.location} onClick={handleMap}>
            Show on Map
          </button>
        )}

        <p className="posted-by">Posted by: {post.userEmail}</p>
      </div>
    </div>
  );
}
