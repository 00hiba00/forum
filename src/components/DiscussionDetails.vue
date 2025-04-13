<template>
    <div v-if="currentDiscussion">
  <b-card>
    <h2>{{ currentDiscussion.title }}</h2>
    <div>Catégorie: {{ currentDiscussion.category }}</div><br>
    <div v-html="currentDiscussion.content"></div>
    <template #footer>
      <small class="text-muted">
        Posté par {{ currentDiscussion.authorName }} le {{ formatDate(currentDiscussion.createdAt) }}
      </small>
    </template>
  </b-card>
</div>
<div v-else>
  Not found
</div>

  </template>
  
  <script setup>
  import { watch } from 'vue';
  import { useDiscussions } from '../composables/useDiscussions';
  import { defineProps, defineExpose } from 'vue';

  const props = defineProps({
  discussionId: {
    type: String,
    required: true
  }
});

  
  const { currentDiscussion, fetchDiscussion } = useDiscussions();
  
  let unsubscribe;
  
  watch(() => props.discussionId, (id) => {
  console.log("Chargement discussion avec id :", id);
  if (unsubscribe) unsubscribe();
  if (id) unsubscribe = fetchDiscussion(id);
}, { immediate: true });


  
  const formatDate = (timestamp) => {
    return new Date(timestamp?.toDate() || timestamp).toLocaleString();
  };
  
  defineExpose({
    discussion: currentDiscussion,
    formatDate
  });
  </script>