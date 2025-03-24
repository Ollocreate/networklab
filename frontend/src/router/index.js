import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from "../views/AuthPage.vue";
import StudentAccount from "../views/StudentAccount.vue";
import TeacherAccount from "../views/TeacherAccount.vue";
import store from '../store';

const routes = [
  { path: "/", component: AuthPage },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
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
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/AdminDashboard.vue'),
  },
  {
    path: '/:courseSlug',
    name: 'CoursePage',
    component: () => import('@/views/MaterialPage.vue'),
    props: true,
  },
  {
    path: '/materialcreate',
    name: 'CreateMaterial',
    component: () => import('@/views/CreateMaterial.vue'),
  },
  {
    path: "/student",
    component: StudentAccount,
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/teacher",
    component: TeacherAccount,
    meta: { requiresAuth: true, role: "teacher" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = store.getters.getUser;

  if (to.meta.requiresAuth) {
    if (!user) {
      console.log("Пользователь не авторизован");
      return next("/");
    }
    if (to.meta.role && user.role !== to.meta.role) {
      console.log("Роль пользователя не соответствует требуемой роли");
      return next("/");
    }
  }

  next();
});

export default router;