import { createStore } from "vuex";
import axios from "axios";
import material from "./material";

const API_URL = "http://localhost:5000/api/auth";

export default createStore({
  state: {
    token: "",
    user: null,
    courses: [],
  },

  mutations: {
    setAuth(state, { token, user }) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      state.token = token;
      state.user = user;

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    },

    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.token = "";
      state.user = null;
      state.courses = [];
      delete axios.defaults.headers.common["Authorization"];
    },

    setUser(state, { user, courses }) {
      state.user = user;
      state.courses = courses || [];
      localStorage.setItem("user", JSON.stringify(user));
    },

    setCourses(state, courses) {
      state.courses = courses;
    },

    initializeState(state) {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        state.token = token;
        state.user = JSON.parse(userStr);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    }
  },

  actions: {
    initialize({ commit }) {
      commit("initializeState");
    },

    async login({ commit }, credentials) {
      try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        const { token, user } = response.data;
        
        if (!token || !user) {
          throw new Error("Неверный формат ответа от сервера");
        }
        
        commit("setAuth", { token, user });
        return response.data;
      } catch (error) {
        throw error.response?.data?.error || "Ошибка входа";
      }
    },

    async fetchUser({ commit, state }) {
      if (!state.token) return;
      
      try {
        let profileUrl = "/profile"; // Общий путь по умолчанию
    
        if (state.user && state.user.role === "student") {
          profileUrl = "/profile/student";  // Путь для студента
        } else if (state.user && state.user.role === "teacher") {
          profileUrl = "/profile/teacher";  // Путь для преподавателя
        }
    
        const response = await axios.get(`${API_URL}${profileUrl}`, {
          headers: { Authorization: `Bearer ${state.token}` }
        });
    
        commit("setUser", { user: response.data.user, courses: response.data.courses });
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
        commit("logout"); // Если токен невалиден — разлогиниваем
      }
    },

    logout({ commit }) {
      commit("logout");
    },
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    getUserRole: (state) => state.user?.role || "guest",
  },

  modules: {
    material, // Подключаем `material` как Vuex-модуль
  },
});