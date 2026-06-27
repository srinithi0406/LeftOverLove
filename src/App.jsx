// src/App.jsx
// React Router setup with ProtectedRoute for auth-gated pages.

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Post from './pages/Post';
import Dashboard from './pages/Dashboard';
import ViewPost from './pages/ViewPost';

/**
 * ProtectedRoute — wraps routes that require authentication.
 * If user is not logged in, redirects to / and opens the auth modal.
 */
function ProtectedRoute({ children }) {
  const { user, authLoading, openAuthModal } = useAuth();

  if (authLoading) return null; // wait for auth state to resolve

  if (!user) {
    // Trigger auth modal after redirect
    setTimeout(() => {
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          icon: 'info',
          title: 'Login Required',
          text: 'Please login to access this page.',
          confirmButtonText: 'Login Now'
        }).then(() => openAuthModal());
      });
    }, 100);
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppLayout() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listings" element={<Listings />} />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <Post />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/view-post" element={<ViewPost />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <AuthModal />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}
