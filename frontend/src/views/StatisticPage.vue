<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Статистика просмотров</h2>
    <TeacherStatistic v-if="isTeacher" />
    <StudentStatistic v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import TeacherStatistic from "../components/stats/TeacherStats.vue";
import StudentStatistic from "../components/stats/StudentStats.vue";

export default {
  components: {
    TeacherStatistic,
    StudentStatistic,
  },
  computed: {
    ...mapGetters(["getUserRole"]),
    isTeacher() {
      return this.getUserRole?.toLowerCase() === "teacher";
    },
  },
};
</script>
