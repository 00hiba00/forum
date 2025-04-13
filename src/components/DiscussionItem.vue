<template>
    <b-card class="mb-3">
      <div class="d-flex justify-content-between">
        <div>
          <router-link :to="`/discussion/${discussion.id}`">
            <h5>{{ discussion.title }}</h5>
          </router-link>
          <p class="mb-2 text-muted">
            Par {{ discussion.authorName || "user" }} • {{ formatDate(discussion.createdAt) }}
          </p>
        </div>
        <div>
          <b-badge variant="info" class="mr-2">
            {{ discussion.responseCount }} réponses
          </b-badge>
          <b-button 
            v-if="isOwner" 
            variant="outline-danger" 
            size="sm" 
            @click="$emit('delete', discussion.id)"
          >
            Supprimer
          </b-button>
        </div>
      </div>
    </b-card>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useAuth } from '../composables/useAuth';
  import { defineProps } from 'vue';

  const props = defineProps({
    discussion: {
      type: Object,
      required: true
    }
  });
  
  
  const { user } = useAuth();
  
  const isOwner = computed(() => {
    return user.value && user.value.uid === props.discussion.authorId;
  });
  
  const formatDate = (timestamp) => {
    return new Date(timestamp?.toDate() || timestamp).toLocaleString();
  };
  </script>