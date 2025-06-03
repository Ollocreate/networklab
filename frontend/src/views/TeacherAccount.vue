<template>
  <v-container>
    <v-card v-if="user && user.role">
      <v-card-title>Профиль преподавателя</v-card-title>
      <v-card-text>
        <p><strong>Имя пользователя:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Роль:</strong> {{ user.role }}</p>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text>
        <p>Данные пользователя недоступны</p>
      </v-card-text>
    </v-card>

    <v-card v-if="courses?.length">
      <v-card-title>Мои курсы</v-card-title>
      <v-list>
        <v-list-item v-for="course in courses || []" :key="course.id">
          <v-list-item-title>
            <v-btn :to="`/${course.slug}`">{{ course.title }}</v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <div class="toolbar">
      <v-card v-if="user && user.role === 'teacher'">
        <v-btn color="primary" to="/materialcreate">Загрузить материал</v-btn>
      </v-card>

      <v-card>
        <v-btn color="primary" to="/stats">Посмотреть статистику</v-btn>
      </v-card>

      <v-card>
        <v-btn color="primary" to="/enroll">Записать на курс</v-btn>
      </v-card>
    </div>

    <v-alert v-if="!courses || courses.length === 0" type="info">
      Вы пока не ведёте ни один курс.
    </v-alert>

    <v-card v-if="materials?.length">
      <v-card-title>Мои материалы</v-card-title>
      <v-list>
        <v-list-item v-for="material in materials || []" :key="material.id">
          <v-list-item-title>{{ material.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      materialTitle: "",
    };
  },
  computed: {
    ...mapState(["user", "courses", "materials"]),
    ...mapState("material", ["materials"]),
  },
  methods: {
    ...mapActions(["fetchUser"]),
    ...mapActions("material", ["fetchUserMaterials", "uploadMaterial"]),

    async upload() {
      if (!this.materialTitle) return;

      try {
        await this.uploadMaterial({ title: this.materialTitle });
        this.materialTitle = "";
        this.fetchUser();
      } catch (error) {
        console.error("Ошибка загрузки материала:", error);
      }
    },
  },
  async created() {
    await this.fetchUser();
    if (this.user && this.user.id) {
      this.fetchUserMaterials(this.user.id);
    }
  },
};
</script>

<style>
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  position: relative;
}
</style>
