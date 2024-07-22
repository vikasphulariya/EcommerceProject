// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDY1cNvITE17ExUrDPFpeLhmXHaMrJSVPI",
  authDomain: "ecommerceapp-react-94c4a.firebaseapp.com",
  projectId: "ecommerceapp-react-94c4a",
  storageBucket: "ecommerceapp-react-94c4a.appspot.com",
  messagingSenderId: "900423357756",
  appId: "1:900423357756:web:fc44dd775b7b6baf3dba39",
  measurementId: "G-M0WJNDSJFP",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

