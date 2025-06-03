import { createRouter, createWebHistory } from "vue-router";
import store from "../store";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("@/views/HomePage.vue"),
  },
  {
    path: "/auth",
    name: "Auth",
    component: () => import("@/views/AuthPage.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/RegisterPage.vue"),
  },
  {
    path: "/admin",
    name: "AdminDashboard",
    component: () => import("@/views/AdminDashboard.vue"),
  },
  {
    path: "/eve",
    name: "SimulationPage",
    component: () => import("@/views/SimulationPage.vue"),
  },
  {
    path: "/console/:id",
    name: "Console",
    component: () => import("@/components/lab/TheConsole.vue"),
  },
  {
    path: "/:courseSlug",
    name: "CoursePage",
    component: () => import("@/views/MaterialPage.vue"),
    props: true,
  },
  {
    path: "/materialcreate",
    name: "CreateMaterial",
    component: () => import("@/views/CreateMaterial.vue"),
  },
  {
    path: "/student",
    component: () => import("@/views/StudentAccount.vue"),
    meta: { requiresAuth: true, role: "student" },
  },
  {
    path: "/teacher",
    component: () => import("@/views/TeacherAccount.vue"),
    meta: { requiresAuth: true, role: "teacher" },
  },
  {
    path: "/stats",
    component: () => import("@/views/StatisticPage.vue"),
  },
  {
    path: "/enroll",
    component: () => import("@/views/EnrollPage.vue"),
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
