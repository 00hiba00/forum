<template>
  <div>
    <b-button to="/Profile">Mon Profile</b-button>
    <b-button v-if="user" variant="outline-danger" @click="handleLogout" class="mb-3 float-end">
  Se déconnecter
</b-button><br>
    <b-alert v-if="error" variant="danger" show>{{ error }}</b-alert>
    <b-skeleton-table v-if="loading" :rows="5" :columns="1" />

    <template v-else>

      <!-- Recherche -->
<b-input-group class="mb-3">
  <b-form-input 
    v-model="searchQuery" 
    placeholder="Rechercher une discussion..." 
  />
  <b-form-select v-model="selectedCategory" :options="categories" class="mb-3" />

</b-input-group>

<!-- Tri -->
<b-form-select v-model="selectedSort" :options="sortOptions" class="mb-3" />


      <div v-if="discussions.length === 0" class="text-center">
        <b-alert show variant="info">
          Aucune discussion trouvée pour le moment.
        </b-alert>
        <b-button to="/discussions/new" variant="primary">
          ➕ Créer une nouvelle discussion
        </b-button>
      </div>

      <div v-else>
        <br>
        <b-button to="/discussions/new" variant="primary">
          ➕ Créer une nouvelle discussion
        </b-button>
        <DiscussionItem 
          v-for="discussion in filteredDiscussions" 
          :key="discussion.id" 
          :discussion="discussion" 
          
          :isModerator="isModerator"

          @delete="handleDelete"
        />
      </div>
    </template>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import DiscussionItem from './DiscussionItem.vue';
import { useDiscussions } from '../composables/useDiscussions';
import { defineProps } from 'vue';

import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
const props = defineProps({
  category: {
    type: String,
    default: null
  }
});
//ajout
const searchQuery = ref('');
const selectedSort = ref('date');
const selectedCategory = ref(props.category);

const sortOptions = [
  { value: 'date', text: 'Date (récent en premier)' },
  { value: 'popularity', text: 'Popularité (plus de réponses)' }
];
const categories = [
  { value: null, text: 'Toutes les catégories' },
  { value: 'tech', text: 'Technologie' },
  { value: 'sports', text: 'Sports' },
  { value: 'music', text: 'Musique' },
];

const filteredDiscussions = computed(() => {
  let filtered = discussions.value;

  // Filtre par mots-clés
  if (searchQuery.value) {
    filtered = filtered.filter(d =>
      d.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      (d.content && d.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }

  // Filtre par catégorie si défini
  if (selectedCategory.value) {
    filtered = filtered.filter(d => d.category === selectedCategory.value);
  }

  // Tri
  if (selectedSort.value === 'date') {
    filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
  } else if (selectedSort.value === 'popularity') {
    filtered = filtered.sort((a, b) => b.responseCount - a.responseCount);
  }

  return filtered;
});
//fin


const { logout, user } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  try {
    await logout();
    router.push('/login');  // Redirige vers la page login
  } catch (err) {
    console.error('Erreur de déconnexion:', err.message);
  }
};





const { discussions, loading, error, fetchDiscussions } = useDiscussions();
const unsubscribe = ref(null); // Déclarer comme une ref

onMounted(() => {
  // Stocker la fonction unsubscribe dans la ref
  unsubscribe.value = fetchDiscussions(props.category);
});

onUnmounted(() => {
  // Vérifier que unsubscribe.value est bien une fonction avant de l'appeler
  if (unsubscribe.value && typeof unsubscribe.value === 'function') {
    unsubscribe.value();
  }
});
</script>
