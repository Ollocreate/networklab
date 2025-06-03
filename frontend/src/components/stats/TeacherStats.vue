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

    <div class="mb-4">
      <label>Студент:</label>
      <select v-model="selectedStudentId" class="custom-select">
        <option
          v-for="student in studentOptions"
          :key="student.id"
          :value="student.id"
        >
          {{ student.username }} ({{ student.email }})
        </option>
      </select>
    </div>

    <div
      v-if="selectedCourseId && selectedStudentId && studentStats.length"
      class="stats-container"
    >
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
        <li v-for="s in studentStats" :key="s.id" class="view-item">
          <span class="view-date">{{ formatDate(s.createdAt) }}</span>
          <span class="view-material">{{ s.material.title }}</span>
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
    ...mapState("statistic", [
      "courses",
      "students",
      "statistics",
      "totalMaterials",
    ]),

    studentOptions() {
      return this.students.filter((student) => student.role === "student");
    },
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
    ...mapActions("statistic", [
      "fetchCourses",
      "fetchStatistics",
      "fetchStudents",
    ]),
    formatDate(date) {
      return new Date(date).toLocaleString("ru-RU");
    },
  },
  watch: {
    selectedCourseId(newId) {
      if (newId) {
        this.fetchStudents(newId);
        this.selectedStudentId = null;
      }
    },
    selectedStudentId(newId) {
      if (newId && this.selectedCourseId) {
        this.fetchStatistics({
          studentId: newId,
          courseId: this.selectedCourseId,
        });
      }
    },
  },
  mounted() {
    this.fetchCourses();
  },
};
</script>

<style>
.progress-bar-background {
  background-color: #e5e7eb; /* светло-серый */
  border-radius: 8px;
  width: 100%;
  max-width: 150px;
  height: 16px;
  margin-bottom: 16px;
  overflow: hidden;
}

.progress-bar-fill {
  background-color: #3b82f6; /* синий */
  height: 100%;
  border-radius: 8px 0 0 8px;
  transition: width 0.3s ease;
}

.view-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #ddd;
}

.view-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}

.view-item:last-child {
  border-bottom: none;
}

.view-date {
  color: #666;
  font-style: italic;
}

.view-material {
  font-weight: 600;
  color: #007bff;
}

.stats-container {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
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

.mb-4 label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #222;
}

.view-material {
  max-width: 300px;
  text-align: end;
}

.view-item {
  display: flex;
  align-items: center;
}
</style>
