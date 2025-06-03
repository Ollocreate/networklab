import axios from "axios";

export default {
  namespaced: true,
  state: {
    materials: [],
    topics: [],
    courses: [],
    selectedMaterial: null,
  },

  mutations: {
    SET_MATERIALS(state, materials) {
      state.materials = materials;
    },
    SET_SELECTED_MATERIAL(state, material) {
      state.selectedMaterial = material;
    },
    SET_TOPICS(state, topics) {
      state.topics = topics;
    },
    SET_COURSES(state, courses) {
      state.courses = courses;
    },
  },

  actions: {
    async fetchMaterials({ commit, rootState }, courseSlug) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/materials/course/${courseSlug}`,
          {
            headers: {
              Authorization: `Bearer ${rootState.token}`,
            },
          }
        );
        commit("SET_MATERIALS", response.data);
      } catch (error) {
        console.error("Ошибка загрузки материалов", error);
      }
    },

    async fetchMaterial({ commit, rootState }, materialId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/materials/${materialId}`,
          {
            headers: {
              Authorization: `Bearer ${rootState.token}`,
            },
          }
        );
        commit("SET_SELECTED_MATERIAL", response.data);
      } catch (error) {
        console.error("Ошибка загрузки материала", error);
      }
    },

    async fetchTopics({ commit }) {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/materials/topics"
        );
        commit("SET_TOPICS", response.data);
      } catch (error) {
        console.error("Ошибка загрузки тем:", error);
      }
    },

    async fetchCourses({ commit }) {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        commit("SET_COURSES", response.data);
      } catch (error) {
        console.error("Ошибка загрузки курсов:", error);
      }
    },

    async fetchUserMaterials({ commit }, userId) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/materials/user/${userId}`
        );
        commit("SET_MATERIALS", response.data);
      } catch (error) {
        console.error("Ошибка загрузки материалов пользователя", error);
      }
    },

    async createMaterial({ dispatch }, formData) {
      try {
        await axios.post("http://localhost:5000/api/materials", formData);
        dispatch("fetchMaterials");
      } catch (error) {
        if (error.response) {
          console.error("Ошибка на сервере:", error.response.data);
          alert("Ошибка при отправке данных на сервер.");
        } else if (error.request) {
          console.error("Ошибка в запросе:", error.request);
          alert("Ошибка при отправке запроса.");
        } else {
          console.error("Неизвестная ошибка:", error.message);
          alert("Неизвестная ошибка при отправке материала.");
        }
      }
    },
  },

  getters: {
    allMaterials: (state) => state.materials,
    selectedMaterial: (state) => state.selectedMaterial,
    allTopics: (state) => state.topics,
    allCourses: (state) => state.courses,
  },
};
