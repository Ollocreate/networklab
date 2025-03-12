<template>
  <v-app class="app">
    <TheHeader />
    <v-main>
      <!-- <TheSidebar /> -->
      <router-view></router-view>
    </v-main>
    <TheFooter />
  </v-app>
</template>

<script>
import TheHeader from './components/TheHeader.vue'; 
import TheFooter from './components/TheFooter.vue';
// import TheSidebar from './components/TheSidebar.vue';

export default {
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    // TheSidebar,
  }

};

</script>

<style>
 .app {
   max-width: 1000px;
   margin: 0 auto;
 }
</style>