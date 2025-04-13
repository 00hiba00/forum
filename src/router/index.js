import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue';
import Admin from '@/views/AdminView.vue';
import Login from '@/views/LoginView.vue';
import Profile from '@/views/ProfileView.vue';
import Register from '@/views/RegisterView.vue';
import { auth} from '@/firebase/firebase.js';


const routes = [
  { path: '/', component: Home},
  { path: '/admin', component: Admin, meta: { requiresAuth: true }},
  {
    path: '/discussions',
    name: 'Discussions',
    component: () => import('../components/DiscussionList.vue')
  } , 
  {
    path: '/discussion/:id',
    name: 'DiscussionView',
    component: () => import('../views/DiscussionView.vue')
  }
,  
  
  { path: '/Login', component: Login},
  { path: '/Profile', component: Profile, meta: { requiresAuth: true }},
  { path: '/Register', component: Register}, // Removed requiresAuth
  {
    path: '/discussions/new',
    name: 'NewDiscussion',
    component: () => import('../components/NewDiscussionForm.vue')
  }
  
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