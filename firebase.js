import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from  "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-Vc_CQyLKPvVv6cwhNugHHoS2eXbQXd0",
  authDomain: "recipeapp-75459.firebaseapp.com",
  projectId: "recipeapp-75459",
  storageBucket: "recipeapp-75459.appspot.com",
  messagingSenderId: "28256098813",
  appId: "1:28256098813:web:a4d5698cdcbd3472056194"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);