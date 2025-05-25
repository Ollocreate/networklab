import axios from "axios";

export default {
    namespaced: true,
state: {
  courses: [],
  students: [],
  statistics: [],
  totalMaterials: null,
  availableStudents: [],
},

mutations: {
  SET_COURSES(state, courses) {
    state.courses = courses;
  },
  SET_STUDENTS(state, students) {
    state.students = students;
  },
  SET_STATISTICS(state, stats) {
    state.statistics = stats;
  },
  SET_TOTAL_MATERIALS(state, materials) {
    state.totalMaterials = materials;
  },
  SET_AVAILABLE_STUDENTS(state, students) {
    console.log("Полученные доступные студенты:", students);
    state.availableStudents = students;
  },
},

actions: {
  fetchCourses({ commit, rootState }) {
  const userId = rootState.user?.id;
  const role = rootState.user?.role;

  let url = "http://localhost:5000/api/courses";
  if (role === "student") {
    url = `http://localhost:5000/api/users/${userId}/courses`;
  }

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${rootState.token}`,
      },
    })
    .then((response) => {
      commit("SET_COURSES", response.data);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке курсов", error);
    });
},

  fetchStatistics({ commit, rootState }, { studentId, courseId }) {
  const url = courseId 
    ? `http://localhost:5000/api/statistics/course/${courseId}/student/${studentId}`
    : `http://localhost:5000/api/statistics/student/${studentId}`;

  return axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${rootState.token}`,
      },
    })
    .then((response) => {
      console.log('Полученные материалы:', response.data.statistics);
      commit("SET_STATISTICS", response.data.statistics);
      commit("SET_STUDENTS", response.data.students);
      commit("SET_TOTAL_MATERIALS", response.data.totalMaterials || []);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке статистики", error);
    });
},
fetchStudents({ commit, rootState }, courseId) {
  return axios
    .get(`http://localhost:5000/api/courses/${courseId}/students`, {
      headers: {
        Authorization: `Bearer ${rootState.token}`,
      },
    })
    .then((response) => {
      console.log('Полученные студенты:', response.data);
      commit("SET_STUDENTS", response.data.students);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке студентов", error);
    });
},

fetchAvailableStudents({ commit, rootState }, courseId) {
  return axios
    .get(`http://localhost:5000/api/courses/${courseId}/available-students`, {
      headers: {
        Authorization: `Bearer ${rootState.token}`,
      },
    })
    .then((response) => {
      commit("SET_AVAILABLE_STUDENTS", response.data.students);
    })
    .catch((error) => {
      console.error("Ошибка при загрузке доступных студентов", error);
    });
},

  enrollStudentOnCourse({ rootState }, { courseId, studentId }) {
    return axios.post(
      'http://localhost:5000/api/users/enroll',
      { courseId, studentId },
      {
        headers: {
          Authorization: `Bearer ${rootState.token}`,
        },
      }
    );
  },
},

}
