<template>
    <div>
      <b-card class="mb-3">
        <b-card-header>
          <h3>Profil Utilisateur</h3>
        </b-card-header>
        <b-card-body>
          <b-form @submit.prevent="handleSubmit">
            <b-form-group label="Nom" label-for="name">
              <b-form-input
                id="name"
                v-model="name"
                type="text"
                required
              />
            </b-form-group>
  
            <b-form-group label="Photo de Profil" label-for="photoURL">
              <b-form-input
                id="photoURL"
                v-model="photoURL"
                type="text"
                placeholder="URL de la photo de profil"
              />
            </b-form-group>
  
            <b-button type="submit" variant="primary">Mettre à jour</b-button>
          </b-form>
  
          
        </b-card-body>
      </b-card>
  
      <b-card v-if="userProfile" class="mt-3">
        <b-card-header>Informations Profil</b-card-header>
        <b-card-body>
          <p><strong>Nom:</strong> {{ userProfile.name }}</p>
          <p><strong>Email:</strong> {{ userProfile.email }}</p>
          <p><strong>Photo:</strong> <img :src="userProfile.photoURL" alt="User Photo" width="100" /></p>
        </b-card-body>
      </b-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useFirestore } from '../composables/useFirestore'; // Import the composable
  
  const { userProfile, fetchUserProfile, updateUserProfile } = useFirestore();
  
  const name = ref('');
  const photoURL = ref('');
  const email = ref('');
  
  const handleSubmit = async () => {
    // Update user profile in Firestore
    await updateUserProfile(name.value, photoURL.value);
    alert('Profil mis à jour avec succès!');
  };
  
  // Fetch user profile data on component mount
  onMounted(async () => {
    await fetchUserProfile();
    if (userProfile.value) {
      name.value = userProfile.value.name;
      photoURL.value = userProfile.value.photoURL || '';
      email.value = userProfile.value.email;
     
    }
  });
  </script>
  