<template>
  <div>
    <h4 class="mb-3">Réponses ({{ filteredResponses.length }})</h4>
    <b-list-group>
      <ResponseItem
        v-for="response in filteredResponses"
        :key="response.id"
        :response="response"
      />
    </b-list-group>
    
    <b-alert v-if="!filteredResponses.length" show variant="info">
      Aucune réponse pour le moment
    </b-alert>
  </div>
</template>

<script setup>
import ResponseItem from './ResponseItem.vue';
import { computed } from 'vue';
import { defineProps } from 'vue';
const props = defineProps({
  responses: {
    type: Array,
    default: () => [] // Toujours fournir un tableau par défaut
  }
});

// Filtre les réponses valides
const filteredResponses = computed(() => {
  return props.responses?.filter(r => r && r.id && r.authorId) || [];
});
</script>