// src/composables/useFirestore.js
import { ref } from 'vue';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase.js';



const userProfile = ref(null);

export function useFirestore() {
  // Fetch user profile data
  const fetchUserProfile = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid); // Access the user document by uid
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        userProfile.value = userDoc.data();
      } else {
        console.error('No such document!');
      }
    }
  };

  // Update user profile
  const updateUserProfile = async (name, photoURL) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, { name, photoURL }, { merge: true });
      // Optionally, update the local state
      userProfile.value = { ...userProfile.value, name, photoURL };
    }
  };

  return { userProfile, fetchUserProfile, updateUserProfile };
}
