// src/services/authService.js
// Auth functions — replaces js/auth.js logic
// Uses Firebase v9 modular SDK

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';
import Swal from 'sweetalert2';

/**
 * Login with email and password.
 * Shows SweetAlert2 success/error exactly as original.
 * Returns true on success, false on failure.
 */
export async function login(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    Swal.fire('Success', 'Logged in successfully!', 'success');
    return true;
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      Swal.fire('Oops!', 'No account found. Please sign up first.', 'warning');
    } else if (error.code === 'auth/wrong-password') {
      Swal.fire('Incorrect Password', 'Please check your password.', 'error');
    } else {
      Swal.fire('Login Failed', error.message, 'error');
    }
    return false;
  }
}

/**
 * Sign up with email and password.
 * Shows SweetAlert2 success/error exactly as original.
 * Returns true on success, false on failure.
 */
export async function signup(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    Swal.fire('Success', 'Signed up and logged in successfully!', 'success');
    return true;
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        Swal.fire('Already Registered', 'Try logging in instead.', 'warning');
        break;
      case 'auth/invalid-email':
        Swal.fire('Invalid Email', 'Please enter a valid email address.', 'error');
        break;
      case 'auth/weak-password':
        Swal.fire('Weak Password', 'Password should be at least 6 characters.', 'error');
        break;
      default:
        Swal.fire('Signup Failed', error.message, 'error');
    }
    return false;
  }
}

/**
 * Logout the current user.
 * Shows SweetAlert2 success exactly as original.
 */
export async function logout() {
  await signOut(auth);
  Swal.fire('Success', 'Logged out successfully', 'success');
}
