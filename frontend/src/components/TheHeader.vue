<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title>Networklab</v-toolbar-title>
    <v-spacer></v-spacer>

    <v-btn to="/home" text>Home</v-btn>

    <template v-if="!isAuthenticated">
      <v-btn to="/auth" text>Войти</v-btn>
      <v-btn to="/register" text>Зарегистрироваться</v-btn>
    </template>

    <template v-else>
      <v-btn @click="logout" text>Выйти</v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TheHeader",
  computed: {
    ...mapGetters(["isAuthenticated"]),
  },
  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
