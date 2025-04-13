<template>
    <b-card title="Ajouter une réponse" class="mt-4">
      <b-form @submit.prevent="handleSubmit">
        <b-form-group>
          <b-form-textarea
            v-model="content"
            rows="3"
            placeholder="Votre réponse..."
            required
          ></b-form-textarea>
        </b-form-group>
        <b-button type="submit" variant="primary" :disabled="loading">
          <b-spinner small v-if="loading"></b-spinner>
          Publier
        </b-button>
      </b-form>
    </b-card>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useAuth } from '../composables/useAuth';
  import { useDiscussions } from '../composables/useDiscussions';
  import { defineProps, defineEmits } from 'vue';

  const props = defineProps({
    discussionId: {
      type: String,
      required: true
    }
  });
  
  const emit = defineEmits(['created']);
  
  const content = ref('');
  const { user } = useAuth();
  const { createResponse, loading } = useDiscussions();
  
  const handleSubmit = async () => {
    try {
      await createResponse({
        content: content.value,
        discussionId: props.discussionId,
        authorId: user.value.uid,
        authorName: user.value.displayName || user.value.email,
        isReported: false
      });
      content.value = '';
      emit('created');
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };
  </script>