<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Networklab</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/home" text>Home</v-btn>
      <!-- <v-btn to="/about" text>About</v-btn> -->
      <v-btn to="/auth" text>Войти</v-btn>
      <v-btn to="/register" text>Зарегистрироваться</v-btn>
    </v-app-bar>
</template>

<script>
  export default {
    name: "TheHeader"
    }   
</script>
