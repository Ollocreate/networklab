<template>
  <form @submit.prevent="submit">
    <v-text-field v-model="email" label="E-mail" required></v-text-field>

    <v-text-field v-model="password" label="Пароль" type="password" required></v-text-field>

    <div class="btn-container">
      <v-btn color="primary" @click="submit">Войти</v-btn>
      <v-btn color="blue-darken-4" variant="plain" size="small" @click="clear">Забыли пароль?</v-btn>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "AuthPage",
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    ...mapActions(["login"]),

    async submit() {
      try {
        const response = await this.login({ email: this.email, password: this.password });

        if (response.user.role === "admin") {
          this.$router.push("/admin");
        } else if (response.user.role === "teacher") {
          this.$router.push("/teacher");
        } else {
          this.$router.push("/student");
        }
      } catch (error) {
        alert("Ошибка входа: " + (error.response?.data?.error || "Попробуйте снова"));
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
form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  text-align: center;
}

.btn-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}
</style>
