// Import the functions you need from the SDKs you need
import { initializeApp,getApp,getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2pHFB5Y96Ty9GwMAgeFlj0hZFf8IUYUg",
  authDomain: "prepwise-24466.firebaseapp.com",
  projectId: "prepwise-24466",
  storageBucket: "prepwise-24466.firebasestorage.app",
  messagingSenderId: "330969185962",
  appId: "1:330969185962:web:1e701b298882e2fdfb1ad3",
  measurementId: "G-CMFRSW0N95"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app);
export const db = getFirestore(app);
