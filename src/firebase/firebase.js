// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-T7Nw9W-sL0RCCHaMTwKLShp0X-r3WLg",
  authDomain: "foodbill-b35d8.firebaseapp.com",
  projectId: "foodbill-b35d8",
  storageBucket: "foodbill-b35d8.appspot.com",
  messagingSenderId: "639504837870",
  appId: "1:639504837870:web:26b1740fa9e1ef279d17ff",
  measurementId: "G-NQ55NQXLV1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export default app;