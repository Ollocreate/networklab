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
      <v-btn :to="userDashboardLink" text>Личный кабинет</v-btn>
      <v-btn @click="logout" text>Выйти</v-btn>
    </template>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "TheHeader",
  computed: {
    ...mapGetters(["isAuthenticated", "getUser"]),

    userDashboardLink() {
      const user = this.getUser;
      if (!user || !user.role) return "/home";
      return user.role === "student" ? "/student" : "/teacher";
    },
  },
  methods: {
    ...mapActions(["logout"]),

    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/home");
    },
  },
};
</script>
