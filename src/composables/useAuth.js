import { ref, onMounted} from 'vue'
import { auth, db } from '../firebase/firebase.js'
import { doc, setDoc } from 'firebase/firestore'  // Import Firestore methods
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth'
import { useRouter } from 'vue-router'



const error = ref(null)
const user = ref(null)

export function useAuth() {

    const router = useRouter();
    
    // Set up Firebase user listener
    onMounted(() => {
      onAuthStateChanged(auth, (currentUser) => {
        user.value = currentUser;
      });
    });

    

    const register = async (email, password, name) => {
      error.value = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        await setDoc(doc(db, 'users', user.uid), {
          name: name,
          email: email,
          photoURL: '',
          createdAt: new Date() // Good practice to add timestamps
        });
        
        router.push('/Profile');
      } catch (err) {
        error.value = err.message;
        console.error("Registration error:", err);
      }
    };

  const login = async (email, password) => {
    error.value = null
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/Profile')
    } catch (err) {
      alert("mot de passe ou email incorrect")
      error.value = err.message
      console.error("Login error: ", error.value.message);
    }
  }

  const logout = async () => {
    await signOut(auth);
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      error.value = err.message
      console.error("Login error: ", error.value.message);
    }
  }

  return { register, login, logout, resetPassword, error, user }
}
