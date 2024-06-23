import { createApp } from 'vue'
import App from './App.vue'
import Authentication from './services/Authentication';
import { createRouter, createWebHistory } from 'vue-router'
import Start from '/src/views/Start.vue'
import Profile from '/src/views/Profile.vue'
import Knowledge from '/src/views/Knowledge.vue'
import Activities from '/src/views/Activities.vue'
import Chat from '/src/views/Chat.vue'
import ImageUpload from '/src/views/ImageUpload.vue'
import SampleQuestionnaire from '/src/views/Questionnaires/SampleQuestionnaire.vue'


import './assets/main.css'

const AuthenticationService = new Authentication()

const app = createApp(App)
app.provide('AuthenticationService', AuthenticationService)

/**
 * Setup router
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'start',
      component: Start
    },
    {
      path: '/activities',
      name: 'activities',
      component: Activities
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: Knowledge
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/questionnaires/sample-questionnaire',
      name: 'sample-questionnaire',
      component: SampleQuestionnaire
    },
    {
      path: '/image-upload',
      name: 'image-upload',
      component: ImageUpload
    }
  ],
})

/**
 * Redirect to start page if user is not authenticated
 */

const publicPaths = ['/']

router.beforeEach((to, from) => {
  if (!publicPaths.includes(to.fullPath)) {
    if ( AuthenticationService.tokenExpired() ) {
      return "/";
    }
  }

  return true;
})

app.use(router)
app.mount('#app')
