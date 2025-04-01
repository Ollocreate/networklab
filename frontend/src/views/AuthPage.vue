<template>
  <form @submit.prevent="submit">
    <v-text-field
      v-model="email"
      label="E-mail"
      required
      :disabled="loading"
    ></v-text-field>

    <v-text-field
      v-model="password"
      label="Пароль"
      type="password"
      required
      :disabled="loading"
    ></v-text-field>

    <v-alert v-if="errorMessage" type="error" class="mt-2">{{
      errorMessage
    }}</v-alert>

    <div class="btn-container">
      <v-btn
        color="primary"
        @click="submit"
        :loading="loading"
        :disabled="loading"
      >
        Войти
      </v-btn>
      <v-btn
        color="blue-darken-4"
        variant="plain"
        size="small"
        @click="clear"
        :disabled="loading"
      >
        Забыли пароль?
      </v-btn>
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
      errorMessage: "",
      loading: false,
    };
  },
  methods: {
    ...mapActions(["login"]),

    async submit() {
      if (this.loading) return;

      this.errorMessage = "";
      this.loading = true;

      try {
        const response = await this.login({
          email: this.email,
          password: this.password,
        });

        if (!response || !response.user) {
          throw new Error("Ошибка получения данных пользователя");
        }

        if (response.user.role === "admin") {
          this.$router.push("/admin");
        } else if (response.user.role === "teacher") {
          this.$router.push("/teacher");
        } else {
          this.$router.push("/student");
        }
      } catch (error) {
        this.errorMessage =
          error.response?.data?.error || "Ошибка входа. Попробуйте снова.";
      } finally {
        this.loading = false;
      }
    },

    clear() {
      this.email = "";
      this.password = "";
      this.errorMessage = "";
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
  gap: 10px;
}

.button-container .v-btn {
  margin-top: 10px;
}
</style>
