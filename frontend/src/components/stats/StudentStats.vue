<template>
  <div>
    <div class="mb-4">
      <label>Курс:</label>
      <select
        v-if="courses.length"
        v-model="selectedCourseId"
        class="border p-2 rounded"
      >
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <div v-if="selectedCourseId && studentStats.length">
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
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      selectedCourseId: null,
    };
  },
  computed: {
    ...mapState("statistic", ["courses", "statistics", "totalMaterials"]),
    ...mapGetters(["getUser"]),
    currentUserId() {
      return this.getUser?.id;
    },
    studentStats() {
      if (!this.currentUserId || !Array.isArray(this.statistics)) return [];
      return this.statistics.filter((s) => s.userId === this.currentUserId);
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
    ...mapActions("statistic", ["fetchCourses", "fetchStatistics"]),
    formatDate(date) {
      return new Date(date).toLocaleString("ru-RU");
    },
    async fetchStatisticsForStudent() {
      if (!this.currentUserId || !this.selectedCourseId) return;
      await this.fetchStatistics({
        studentId: this.currentUserId,
        courseId: this.selectedCourseId,
      });
    },
  },
  watch: {
    selectedCourseId(newVal) {
      if (newVal) {
        this.fetchStatisticsForStudent();
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>
