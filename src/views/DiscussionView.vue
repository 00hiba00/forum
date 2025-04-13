<template>
  <div>
    <b-alert v-if="!discussion && !loading" variant="warning" show>
  Discussion introuvable ou non spécifiée.
</b-alert>

    <b-button to="/discussions/" variant="outline-primary" class="mb-3">
      ← Retour aux discussions
    </b-button>

    <b-alert v-if="error" show variant="danger">{{ error }}</b-alert>
    <b-skeleton-card v-if="loading" />

    <template v-else>
      <DiscussionDetail :discussionId="discussionId" />
      
      <ResponseList 
        v-if="responses" 
        :responses="responses" 
        class="mt-4" 
      />
      
      <NewResponseForm
        v-if="user"
        :discussion-id="discussionId"
        @created="refreshResponses"
        class="mt-4"
      />
    </template>
  </div>
</template>
  
  <script setup>
  import { watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useAuth } from '../composables/useAuth';
  import { useDiscussions } from '../composables/useDiscussions';
  import DiscussionDetail from '../components/DiscussionDetail.vue';
  import ResponseList from '../components/ResponseList.vue';
  import NewResponseForm from '../components/NewResponseForm.vue';
  
  const route = useRoute();
  const { user } = useAuth();
  const {
    currentDiscussion: discussion,
    responses,
    fetchDiscussion,
    fetchResponses
  } = useDiscussions();
  
  const discussionId = route.params.id;
  
  // Chargement initial
  fetchDiscussion(discussionId);
  fetchResponses(discussionId);
  
  const refreshResponses = () => {
    fetchResponses(discussionId);
  };
  
  // Réagit aux changements d'ID
 // In DiscussionView.vue
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchDiscussion(newId).then(discussion => {
      if (!discussion) {
        // Handle not found case
      }
    });
    fetchResponses(newId);
  }
}, { immediate: true });
  </script>