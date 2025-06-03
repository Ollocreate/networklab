<template>
  <div>
    <div class="mb-4">
      <label>Курс:</label>
      <select
        v-if="courses.length"
        v-model="selectedCourseId"
        class="custom-select"
      >
        <option v-for="course in courses" :key="course.id" :value="course.id">
          {{ course.title }}
        </option>
      </select>
    </div>

    <div v-if="selectedCourseId && studentStats.length" class="stats-container">
      <h3 class="font-semibold text-lg mb-2">Просмотры</h3>
      <p class="mb-1">
        Всего просмотрено: <strong>{{ studentStats.length }}</strong> материалов
      </p>
      <p class="mb-1">
        Всего в курсе: <strong>{{ materialCount }}</strong> материалов
      </p>
      <p class="mb-4">
        Прогресс: <strong>{{ progressPercentage }}%</strong>
      </p>

      <div class="progress-bar-background">
        <div
          class="progress-bar-fill"
          :style="{ width: progressPercentage + '%' }"
          :aria-valuenow="progressPercentage"
          aria-valuemin="0"
          aria-valuemax="100"
          role="progressbar"
        ></div>
      </div>

      <ul class="view-list">
        <li
          v-for="s in studentStats"
          :key="s.id"
          class="view-item"
          :title="`Материал ID: ${s.materialId}`"
        >
          <span class="view-date">{{ formatDate(s.createdAt) }}</span>
          <span class="view-material">{{ s.material.title }}</span>
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

<style>
.view-material {
  max-width: 300px;
  text-align: end;
}

.view-item {
  display: flex;
  align-items: center;
}
</style>
