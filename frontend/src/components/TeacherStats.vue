<template>
  <div>
    <div class="mb-4">
      <label>Курс:</label>
      <select v-if="courses.length" v-model="selectedCourseId" class="border p-2 rounded">
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <div v-if="students && students.length" class="mb-4">
      <label>Студент:</label>
      <select v-model="selectedStudentId" class="border p-2 rounded">
        <option v-for="student in students" :key="student.id" :value="student.id">
          {{ student.username }} ({{ student.email }})
        </option>
      </select>
    </div>

    <div v-if="selectedCourseId && selectedStudentId && studentStats.length">
      <h3 class="font-semibold">Просмотры:</h3>
      <p>Всего просмотрено: {{ studentStats.length }} материалов</p>
      <p>Всего в курсе: {{ materialCount }} материалов</p>
      <p>Прогресс: {{ progressPercentage }}%</p>

      <ul>
        <li v-for="s in studentStats" :key="s.id">
          {{ formatDate(s.createdAt) }} — Материал ID: {{ s.materialId }}
        </li>
      </ul>
    </div>
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
    ...mapState("statistic", ["courses", "students", "statistics", "totalMaterials"]),
    studentStats() {
      if (!this.selectedStudentId || !Array.isArray(this.statistics)) return [];
      return this.statistics.filter((s) => s.userId === this.selectedStudentId);
    },
    materialCount() {
      return this.totalMaterials || 0;
    },
    progressPercentage() {
      if (!this.materialCount) return 0;
      const viewed = new Set(this.studentStats.map((s) => s.materialId));
      return ((viewed.size / this.materialCount) * 100).toFixed(1);
    },
  },
  methods: {
    ...mapActions("statistic", ["fetchCourses", "fetchStatistics", "fetchStudents"]),
    formatDate(date) {
      return new Date(date).toLocaleString("ru-RU");
    },
  },
  watch: {
  selectedCourseId(newId) {
    if (newId) {
      this.fetchStudents(newId);
    }
  },
  selectedStudentId(newId) {
    if (newId && this.selectedCourseId) {
      this.fetchStatistics({ studentId: newId, courseId: this.selectedCourseId });
    }
  },
},
  mounted() {
    this.fetchCourses();
  },
};
</script>
