<template>
  <div>
    <router-link to="/Login" v-if="!isLoggedIn">
      <b-button>Login</b-button>
    </router-link>
    
    <router-link to="/Register" v-if="!isLoggedIn">
      <b-button>Register</b-button>
    </router-link>

    <router-link to="/Discussions" v-if="isLoggedIn">
      <b-button>Discussions</b-button>
    </router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase/firebase.js';

const isLoggedIn = ref(false);

onMounted(() => {
  auth.onAuthStateChanged((user) => {
    isLoggedIn.value = !!user;
  });
});
</script>