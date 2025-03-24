import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCLpDUGI56SZbY6NXfVhI7-1N4iVBEqg5s",
  authDomain: "shopit-c9343.firebaseapp.com",
  projectId: "shopit-c9343",
  storageBucket: "shopit-c9343.firebasestorage.app",
  messagingSenderId: "1047611691322",
  appId: "1:1047611691322:web:ef0738ee3d5ea320954003",
  measurementId: "G-T6BZZ45YB2",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
