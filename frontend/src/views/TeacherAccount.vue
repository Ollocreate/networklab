<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>Личный кабинет преподавателя</v-card-title>
      <v-card-text>
        <p><strong>Имя пользователя:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Роль:</strong> {{ user.role }}</p>
      </v-card-text>
    </v-card>

    <v-card v-if="courses?.length">
  <v-card-title>Мои курсы</v-card-title>
  <v-list>
    <v-list-item v-for="course in courses || []" :key="course.id">
      <v-list-item-content>
        <v-list-item-title>{{ course.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</v-card>

<v-alert v-if="!courses || courses.length === 0" type="info">
  Вы пока не ведёте ни один курс.
</v-alert>

<v-card v-if="materials?.length">
  <v-card-title>Мои материалы</v-card-title>
  <v-list>
    <v-list-item v-for="material in materials || []" :key="material.id">
      <v-list-item-content>
        <v-list-item-title>{{ material.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</v-card>

    <v-card v-if="user.role === 'teacher'">
        <v-btn color="primary" to="/materialcreate">Загрузить материал</v-btn>
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
  },
  methods: {
    ...mapActions(["fetchUser", "uploadMaterial"]),

    async upload() {
      if (!this.materialTitle) return;

      try {
        await this.uploadMaterial({ title: this.materialTitle });
        this.materialTitle = "";
        this.fetchUser(); // Обновляем список материалов
      } catch (error) {
        console.error("Ошибка загрузки материала:", error);
      }
    }
  },
  created() {
    console.log("fetchUser вызывается...");
    this.fetchUser();
  },
};
</script>
