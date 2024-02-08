// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "mern-estate-5eb89.firebaseapp.com",
  projectId: "mern-estate-5eb89",
  storageBucket: "mern-estate-5eb89.appspot.com",
  messagingSenderId: "938763892627",
  appId: "1:938763892627:web:c8b8e90a05e91512ce1a66"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);