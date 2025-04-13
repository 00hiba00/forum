<template>
  <div>
    <home></home>
    <router-view></router-view>
  </div>
</template>

<script>
import Home from '../src/views/HomeView.vue';
export default {
  components: {Home},
  name: 'App',
}
</script>