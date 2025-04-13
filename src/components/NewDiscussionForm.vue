<template>
  <!-- Formulaire pour créer une nouvelle discussion -->
  <b-form @submit="handleSubmit">
    <b-form-group label="Titre">
      <b-form-input v-model="title" required />
    </b-form-group>

    <b-form-group label="Contenu">
      <b-form-textarea v-model="content" required />
    </b-form-group>

    <b-form-group label="Catégorie">
      <b-form-select v-model="category" :options="categoryOptions" required />
    </b-form-group>

    <b-button type="submit" variant="primary">Publier</b-button>
  </b-form>
</template>

<script setup>
import { ref } from 'vue';
import { useDiscussions } from '../composables/useDiscussions'; // Assurez-vous que le chemin est correct
import { useRouter } from 'vue-router';

// Déclarez vos variables avec `ref` pour la réactivité
const title = ref('');
const content = ref('');
const category = ref(null);

// Les options pour la catégorie, vous pouvez les ajuster selon vos besoins
const categoryOptions = [
  { value: 'tech', text: 'Technologie' },
  { value: 'music', text: 'Musique' },
  { value: 'sports', text: 'Sports' },
  // Ajoutez plus d'options si nécessaire
];

const { createDiscussion } = useDiscussions();
const router = useRouter();

// Gérer la soumission du formulaire
const handleSubmit = async () => {
  try {
    const discussionData = {
      title: title.value,
      content: content.value,
      category: category.value,
    };
    console.log("Données de la discussion :", discussionData); // Vérifie si les données sont bien récupérées

    // Appeler la méthode pour créer une nouvelle discussion
    await createDiscussion(discussionData);
    
    // Naviguer vers la page des discussions après la création
    router.push('/discussions/');
  } catch (err) {
    console.error("Erreur lors de la création de la discussion:", err);
  }
};
</script>
