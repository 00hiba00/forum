import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Vos clés de configuration récupérées sur la console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAwZodC3Joce7w6EP0PS1QXyDrbBFm1AlY",
    authDomain: "forum-ump.firebaseapp.com",
    projectId: "forum-ump",
    storageBucket: "forum-ump.firebasestorage.app",
    messagingSenderId: "1032754603295",
    appId: "1:1032754603295:web:98a26a4d1f03ea6437fc2a"
  };

// Initialiser l'application Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services que vous souhaitez utiliser
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };