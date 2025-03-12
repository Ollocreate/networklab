import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    token: localStorage.getItem("token") || "",
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  mutations: {
    setAuth(state, { token, user }) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      state.token = token;
      state.user = user;
    },
    logout(state) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.token = "";
      state.user = null;
    },
  },
  actions: {
    async login({ commit }, credentials) {
      const response = await axios.post("http://localhost:5000/api/auth/login", credentials);
      const { token, user } = response.data;
      commit("setAuth", { token, user });
      return response.data;
    },
    logout({ commit }) {
      commit("logout");
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    getToken: (state) => state.token,
    getUser: (state) => state.user,
  },
});
