import axios from "axios";

export default {
  namespaced: true, // 💡 Добавляем `namespaced: true`, чтобы избежать конфликтов с `index.js`
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
    SET_LOADING_TOPICS(state, value) {
      state.loadingTopics = value;
    },
  },

  actions: {
    async fetchMaterials({ commit }, courseId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/materials/course/${courseId}`);
        commit("SET_MATERIALS", response.data);
      } catch (error) {
        console.error("Ошибка загрузки материалов", error);
      }
    },

    async fetchMaterial({ commit }, materialId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/materials/${materialId}`);
        commit("SET_SELECTED_MATERIAL", response.data);
      } catch (error) {
        console.error("Ошибка загрузки материала", error);
      }
    },

    async fetchTopics({ commit }) {
      try {
        const response = await axios.get("http://localhost:5000/api/materials/topics");
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

    async createMaterial({ dispatch }, formData) {
      try {
        console.log("!!!!Отправляемый formData in createMaterial!!!!:", ...formData.entries());
        await axios.post("http://localhost:5000/api/materials", formData);
        dispatch("fetchMaterials"); // 🔄 Обновляем список материалов после добавления
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
