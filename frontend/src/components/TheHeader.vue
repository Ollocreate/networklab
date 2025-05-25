<template>
  <v-app-bar app color="primary" dark>
    <router-link
      to="/"
      style="text-decoration: none; color: inherit; margin-left: 1em"
    >
      <v-toolbar-title class="cursor-pointer">Networklab</v-toolbar-title>
    </router-link>
    <v-spacer></v-spacer>

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
      this.$router.push("/");
    },
  },
};
</script>
