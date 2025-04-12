<template>
    <div>
      <h2>{{ isLogin ? 'Connexion' : 'Inscription' }}</h2>
      <b-form @submit.prevent="handleSubmit">
        <b-form-group v-if="!isLogin" label="Nom">
            <b-form-input v-model="name" required />
        </b-form-group>

        <b-form-group label="Email">
          <b-form-input v-model="email" type="email" required />
        </b-form-group>
  
        <b-form-group label="Mot de passe">
          <b-form-input v-model="password" type="password" required />
        </b-form-group>
  
        <b-button type="submit" variant="primary">
          {{ isLogin ? 'Se connecter' : "S 'inscrire" }}
        </b-button>
  
        <b-button v-if="isLogin" variant="link" @click="reset">
          Mot de passe oublié ?
        </b-button>
  
        <b-alert variant="danger" v-if="error" class="mt-3">{{ error }}</b-alert>
      </b-form>
    </div>
  </template>
  
<script setup>
import { ref } from 'vue'
import { useAuth } from '../composables/useAuth'


const props = defineProps({
  isLogin: Boolean // true pour login, false pour register
})

const email = ref('')
const password = ref('')
const name = ref('') 
const { login, register, resetPassword, error } = useAuth()

const handleSubmit = async () => {
console.log("Registering with:", email.value, password.value);
  if (props.isLogin) {
    await login(email.value, password.value)
  } else {
    await register(email.value, password.value, name.value)
  }
  
}

const reset = async () => {
  if (email.value) {
    await resetPassword(email.value)
    alert('Un e-mail de réinitialisation a été envoyé.')
  } else {
    alert('Veuillez entrer votre e-mail.')
  }
}
</script>
  