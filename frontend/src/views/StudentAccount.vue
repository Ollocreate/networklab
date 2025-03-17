<template>
  <v-container>
    <v-card v-if="user">
      <v-card-title>Личный кабинет студента</v-card-title>
      <v-card-text>
        <p><strong>Имя пользователя:</strong> {{ user.username }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Роль:</strong> {{ user.role }}</p>
      </v-card-text>
    </v-card>

    <v-card v-if="courses.length">
      <v-card-title>Мои курсы</v-card-title>
      <v-list>
        <v-list-item v-for="course in courses" :key="course.id">
          <v-list-item-content>
            <v-list-item-title>{{ course.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>

    <v-alert v-if="courses.length === 0" type="info">
      Вы пока не подписаны ни на один курс.
    </v-alert>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["user", "courses"]),
  },
  methods: {
    ...mapActions(["fetchUser"]),
  },
  created() {
    this.fetchUser();
  },
};
</script>
