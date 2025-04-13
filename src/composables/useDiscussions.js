import { ref, onUnmounted } from 'vue';
import { db } from '../firebase/firebase.js';
import {
  collection, query, where, orderBy,
  addDoc, updateDoc, getDoc,
  doc, onSnapshot, increment,
  serverTimestamp
} from 'firebase/firestore';

export function useDiscussions() {
  const discussions = ref([]);
  const currentDiscussion = ref(null);
  const responses = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const discussionsRef = collection(db, 'discussions');
  const responsesRef = collection(db, 'responses');


  const fetchDiscussions = async (category = null) => {
    loading.value = true;
    try {
      let q = query(discussionsRef, orderBy('createdAt', 'desc'));
      if (category) {
        q = query(q, where('category', '==', category));
      }
      
      // Retourner explicitement la fonction unsubscribe
      return onSnapshot(q, (snapshot) => {
        discussions.value = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      });
    } catch (err) {
      error.value = err.message;
      return () => {}; // Retourner une fonction vide en cas d'erreur
    } finally {
      loading.value = false;
    }
  };
  
  const fetchDiscussion = async (id) => {
    try {
      const docRef = doc(db, 'discussions', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        currentDiscussion.value = { id: docSnap.id, ...docSnap.data() };
        return currentDiscussion.value;
      } else {
        currentDiscussion.value = null;
        throw new Error('Discussion non trouvée');
      }
    } catch (error) {
      console.error('Erreur lors du chargement :', error);
      currentDiscussion.value = null;
      return null;
    }
  };
  
  
  let unsubscribe = null;

const fetchResponses = async (discussionId) => {
  loading.value = true;
  try {
    const q = query(
      responsesRef,
      where('discussionId', '==', discussionId)
    );

    // Arrêter l'ancien listener s'il existe
    if (unsubscribe) unsubscribe();

    unsubscribe = onSnapshot(q, (snapshot) => {
      responses.value = snapshot.docs
        .filter(doc => doc.exists())
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
    });
  } catch (err) {
    error.value = err.message;
    responses.value = []; // Vide en cas d'erreur
  } finally {
    loading.value = false;
  }
};

// Stopper l'écoute quand le composant est démonté
onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});

  const createDiscussion = async (discussionData) => {
  loading.value = true;
  try {
    console.log("Creating discussion with data:", discussionData); // Debug log
    await addDoc(discussionsRef, {
      ...discussionData,
      createdAt: serverTimestamp(),
      views: 0,
      responseCount: 0
    });
    console.log("Discussion created successfully"); // Debug log
  } catch (err) {
    error.value = err.message;
    console.error("Error creating discussion:", err); // Debug log
    throw err;
  } finally {
    loading.value = false;
  }
};


  const createResponse = async (responseData) => {
    if (!responseData.discussionId) {
      throw new Error("Discussion ID is required");
    }
    loading.value = true;
    try {
      await addDoc(responsesRef, {
        ...responseData,
        createdAt: serverTimestamp()
      });
      // Update response count
      await updateDoc(doc(db, 'discussions', responseData.discussionId), {
        responseCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    discussions,
    currentDiscussion,
    responses,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussion,
    fetchResponses,
    createDiscussion,
    createResponse
  };
}