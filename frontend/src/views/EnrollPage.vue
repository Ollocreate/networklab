<template>
  <div>
    <h3 class="font-semibold text-lg mb-2">Зачислить студента на курс</h3>

    <div class="mb-2">
      <label>Курс:</label>
      <select
        v-model="selectedCourseId"
        @change="loadAvailableStudents"
        class="border p-1 rounded"
      >
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <div class="mb-2" v-if="availableStudents.length">
      <label>Студент:</label>
      <select v-model="selectedStudentId" class="border p-1 rounded">
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
      color="primary"
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
