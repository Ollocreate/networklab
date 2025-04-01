<template>
  <v-app class="app">
    <TheHeader v-if="!isConsolePage" />
    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import TheHeader from "./components/TheHeader.vue";

export default {
  name: "App",
  components: {
    TheHeader,
  },
  computed: {
    isConsolePage() {
      return this.$route.name === "Console";
    },
  },
};
</script>

<style>
.app {
  max-width: 1000px;
  margin: 0 auto;
}
</style>
