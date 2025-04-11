// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhDMmGMAPCMjjxX5z2sJ5ld7Zwy0EoCdE",
  authDomain: "myhistory-463a0.firebaseapp.com",
  projectId: "myhistory-463a0",
  storageBucket: "myhistory-463a0.firebasestorage.app",
  messagingSenderId: "702538866600",
  appId: "1:702538866600:web:925c3817f6af3d8890079d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); 

