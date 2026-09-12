import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAHtK4tEG5IDFomSWZJejeZK99LgRWRrhE",
  authDomain: "caremitra-383e0.firebaseapp.com",
  projectId: "caremitra-383e0",
  storageBucket: "caremitra-383e0.firebasestorage.app",
  messagingSenderId: "621204194302",
  appId: "1:621204194302:web:4a73979730996d9df7b6af"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);