import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue';
import Admin from '@/views/Admin.vue';
import Discussion from '@/views/Discussion.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import Register from '@/views/Register.vue';
import { auth} from '../firebase/firebase.js';


const routes = [
  { path: '/', component: Home},
  { path: '/admin', component: Admin},
  { path: '/Discussion', component: Discussion},
  { path: '/Login', component: Login},
  { path: '/Profile', component: Profile},
  { path: '/Register', component: Register, meta: { requiresAuth: true }},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router
