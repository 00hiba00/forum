<template>
  <b-list-group-item 
  v-if="response"
  :class="{'border border-danger': isModerator && response.isReported}"
>

  <div class="d-flex justify-content-between align-items-start">
    <div>
      <div v-if="!editing" >
        <p class="mb-1">{{ response.content }}</p>
        <small class="text-muted">
          Par {{ response.authorName || 'Anonyme' }} • {{ formattedDate }}
        </small>
      </div>
      <div v-else>
        <b-form-textarea v-model="editedContent" rows="3" />
        <b-button size="sm" variant="success" @click="updateResponse">Enregistrer</b-button>
        <b-button size="sm" variant="secondary" @click="editing = false">Annuler</b-button>
      </div>
    </div>
    
    <div v-if="isModerator || isOwner">
      <b-button size="sm" variant="danger" @click="deleteResponse">Supprimer</b-button>
    </div>
    <div v-if="isOwner">
      <b-button size="sm" variant="warning" @click="editing = true">Modifier</b-button>
    </div>

    

    <div v-if="!isModerator && !isOwner">
      <b-button 
        variant="outline-danger" 
        size="sm"
        @click="reportResponse"
      >
        🚩 Signaler
      </b-button>
    </div>
  </div>
</b-list-group-item>

</template>

<script setup>
//ajouter 
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { doc, updateDoc, deleteDoc, increment,
  serverTimestamp} from 'firebase/firestore';
import { db } from '../firebase/firebase.js';
import { computed } from 'vue';
import { defineProps } from 'vue';


const props = defineProps({
  response: {
    type: Object,
    required: true,
    validator: value => value && value.id // Validation stricte
  }
});


const { user } = useAuth();
const isOwner = computed(() => {
  return user.value && user.value.uid === props.response.authorId;
});

//ajouter


const moderatorEmail = "hello123@gmail.com";
const isModerator = computed(() => { 
  return user.value && user.value.email === moderatorEmail;
});

const editing = ref(false);
const editedContent = ref(props.response.content);

console.log(user.value.email);
const formattedDate = computed(() => {
  if (!props.response?.createdAt) return '';
  try {
    const date = props.response.createdAt.toDate 
      ? props.response.createdAt.toDate() 
      : new Date(props.response.createdAt);
    return date.toLocaleString();
  } catch {
    return '';
  }
});


//ajouter
const updateResponse = async () => {
  try {
    const docRef = doc(db, 'responses', props.response.id);
    await updateDoc(docRef, {
      content: editedContent.value,
      updatedAt: new Date()
    });
    editing.value = false;
  } catch (error) {
    console.error("Erreur lors de la modification :", error.message);
  }
};

const deleteResponse = async () => {
  if (confirm("Voulez-vous supprimer cette réponse ?")) {
    try {
      const docRef = doc(db, 'responses', props.response.id);
      await deleteDoc(docRef);
      await updateDoc(doc(db, 'discussions', props.response.discussionId), {
  responseCount: increment(-1),
  updatedAt: serverTimestamp()
});
    } catch (error) {
      console.error("Erreur lors de la suppression :", error.message);
    }
  }
};

const reportResponse = async () => {
  try {
    const docRef = doc(db, 'responses', props.response.id);
    await updateDoc(docRef, {
      isReported: true,
      updatedAt: new Date()
    });
    editing.value = false;
  } catch (error) {
    console.error("Erreur lors du signalement :", error.message);
  }
};

</script>