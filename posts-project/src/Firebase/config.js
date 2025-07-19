// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDS958q6W29rUnzICH71NPnv0ehenhO2w",
  authDomain: "postes-dff1a.firebaseapp.com",
  projectId: "postes-dff1a",
  storageBucket: "postes-dff1a.firebasestorage.app",
  messagingSenderId: "1066382801072",
  appId: "1:1066382801072:web:98e917d1800955bace2375",
  measurementId: "G-PQGDX174WC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);