// src/services/firebase.js
// Firebase v9 Modular SDK initialization
// Same Firebase project — no data changes

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDL7fAFhDpK7IMs7RfHjCOUA2GqeGwFG28",
  authDomain: "leftoverlove-66411.firebaseapp.com",
  projectId: "leftoverlove-66411",
  storageBucket: "leftoverlove-66411.appspot.com",
  messagingSenderId: "827705332491",
  appId: "1:827705332491:web:80377501a6ff44253c880e",
  databaseURL: "https://leftoverlove-66411-default-rtdb.asia-southeast1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
