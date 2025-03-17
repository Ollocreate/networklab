<template>
  <v-container class="login-container">
    <v-card class="login-card">
      <v-card-title class="text-center">Вход</v-card-title>
      <v-card-text>
        <form @submit.prevent="submit">
          <v-text-field v-model="email" label="E-mail" required></v-text-field>

          <v-text-field v-model="password" label="Пароль" type="password" required></v-text-field>

          <v-alert v-if="errorMessage" type="error" class="mt-2">{{ errorMessage }}</v-alert>

          <div class="btn-container">
            <v-btn color="primary" @click="submit">Войти</v-btn>
            <v-btn color="blue-darken-4" variant="plain" size="small" @click="clear">Забыли пароль?</v-btn>
          </div>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AuthPage",
  data() {
    return {
      email: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    ...mapActions(["login"]),

    async submit() {
      this.errorMessage = ""; // Очистка ошибки перед отправкой
      try {
        const response = await this.login({ email: this.email, password: this.password });

        // Перенаправление в зависимости от роли
        if (response.user.role === "admin") {
          this.$router.push("/admin");
        } else if (response.user.role === "teacher") {
          this.$router.push("/teacher");
        } else {
          this.$router.push("/student");
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.error || "Ошибка входа. Попробуйте снова.";
      }
    },

    clear() {
      this.email = "";
      this.password = "";
    },
  },
};
</script>

<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-card {
  width: 400px;
  padding: 20px;
}

.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
</style>
