import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/AboutPage.vue'),
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('@/views/AuthPage.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/RegisterPage.vue'),
  },
  {
    path: '/student',
    name: 'Account',
    component: () => import('@/views/AccountPage.vue'),
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
  },

  {
    path: '/material',
    name: 'MaterialPage',
    component: () => import('@/views/MaterialPage.vue'),
  },
  {
    path: '/materialcreate',
    name: 'CreateMaterial',
    component: () => import('@/views/CreateMaterial.vue'),
  },

  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;