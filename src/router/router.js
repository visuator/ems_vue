import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore';
import LoginPage from '../views/LoginPage.vue';
import HomePage from '../views/HomePage.vue';
import ConfirmationPage from '../views/ConfirmationPage.vue';
import PasswordResetPage from '../views/PasswordResetPage.vue';
import ImportPage from '../views/ImportPage.vue';
import ClassVersionPage from '../views/ClassVersionPage.vue';
import IdlePeriodPage from '../views/IdlePeriodPage.vue';
import SettingPage from '../views/SettingPage.vue';
import LkPage from '../views/LkPage.vue';
import GroupPage from '../views/GroupPage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login', component: LoginPage, meta: {
        requiresAuth: false,
      }
    },
    {
      path: '/', component: HomePage, meta: {
        requiresAuth: true,
      },
      children: [
        {
          path: 'import/', component: ImportPage, meta: {
            requiresAuth: true
          },
        },
        {
          path: 'classVersion', component: ClassVersionPage, meta: {
            requiresAuth: true
          }
        },
        {
          path: 'idlePeriod', component: IdlePeriodPage, meta: {
            requiresAuth: true
          }
        },
        {
          path: 'setting', component: SettingPage, meta: {
            requiresAuth: true
          }
        },
        {
          path: 'lk', component: LkPage, meta: {
            requiresAuth: true
          }
        },
        {
          path: 'group', component: GroupPage, meta: {
            requiresAuth: true
          }
        },
      ]
    },
    {
      path: '/confirm', component: ConfirmationPage, meta: {
        requiresAuth: false
      }
    },
    {
      path: '/passwordReset/', component: PasswordResetPage, meta: {
        requiresAuth: false
      }
    },
  ]
});

router.beforeEach((to, from, next) => {
  const store = useUserStore();

  if(store.isLoggedIn){
    if (to.path === '/login') {
      next('/');
    }
    else {
      next();
    }
  }
  else{
    if(to.meta.requiresAuth){
      next('/login');
    }
    else next();
  }
})

export default router
