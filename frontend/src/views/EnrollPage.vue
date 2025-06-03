<template>
  <div>
    <h3 class="font-semibold text-lg mb-2">Зачислить студента на курс</h3>

    <div class="mb-2">
      <label>Курс:<br /></label>
      <select
        v-model="selectedCourseId"
        @change="loadAvailableStudents"
        class="custom-select"
      >
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <div class="mb-2" v-if="availableStudents.length">
      <label>Студент:<br /></label>
      <select v-model="selectedStudentId" class="custom-select">
        <option
          v-for="student in availableStudents"
          :key="student.id"
          :value="student.id"
        >
          {{ student.username }} ({{ student.email }})
        </option>
      </select>
    </div>

    <button
      v-if="selectedCourseId"
      class="enroll-btn"
      @click="enroll"
      :disabled="!selectedStudentId"
    >
      Зачислить
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      selectedCourseId: null,
      selectedStudentId: null,
    };
  },
  computed: {
    ...mapState("statistic", ["courses", "availableStudents"]),
  },
  methods: {
    ...mapActions("statistic", [
      "fetchCourses",
      "fetchAvailableStudents",
      "enrollStudentOnCourse",
    ]),

    loadAvailableStudents() {
      this.selectedStudentId = null;
      if (this.selectedCourseId) {
        this.fetchAvailableStudents(this.selectedCourseId);
      }
    },

    enroll() {
      if (!this.selectedCourseId || !this.selectedStudentId) return;

      this.enrollStudentOnCourse({
        courseId: this.selectedCourseId,
        studentId: this.selectedStudentId,
      }).then(() => {
        alert("Студент зачислен!");
        this.selectedStudentId = null;
      });
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>

<style>
.enroll-btn {
  margin: 0;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  user-select: none;
}

.custom-select {
  max-width: 600px;
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #ccc;
  border-radius: 6px;
  background-color: #fff;
  font-size: 16px;
  color: #333;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2210%22%20height%3D%227%22%20viewBox%3D%220%200%2010%207%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%200l5%207%205-7z%22%20fill%3D%22%23666%22/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 10px 7px;
  cursor: pointer;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}

.custom-select:hover {
  border-color: #999;
}

.custom-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  background-color: #fff;
}
</style>
