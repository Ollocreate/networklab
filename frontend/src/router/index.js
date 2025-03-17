import { createRouter, createWebHistory } from 'vue-router';
import AuthPage from "../views/AuthPage.vue";
import StudentAccount from "../views/StudentAccount.vue";
import TeacherAccount from "../views/TeacherAccount.vue";

const routes = [
  { path: "/", component: AuthPage },
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
  const user = JSON.parse(localStorage.getItem("user"));

  if (to.meta.requiresAuth) {
    if (!user) {
      return next("/");
    }
    if (to.meta.role && user.role !== to.meta.role) {
      return next("/");
    }
  }

  next();
});

export default router;