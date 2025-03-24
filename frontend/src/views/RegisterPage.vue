<template>
  <form @submit.prevent="submit">
    <v-select
      v-model="role"
      :items="roles"
      item-title="text"
      item-value="value"
      label="Выберите роль"
      required
    ></v-select>
    <v-text-field
      v-model="username"
      :error-messages="nameErrors"
      label="Username"
      required
    ></v-text-field>
    <v-text-field
      v-model="email"
      label="E-mail"
      required
    ></v-text-field>
    <v-text-field
      v-model="password"
      label="Пароль"
      required
    ></v-text-field>
  
  <div class="btn-container">
    <v-btn color="primary" @click="submit">Зарегистрироваться</v-btn>
    <v-btn 
      to="/auth"
      color="blue-darken-4" 
      variant="plain" 
      @click="clear">Уже зарегистрированы? Войти</v-btn>
  </div>
</form>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterPage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      role: "", 
      roles: [
        { text: "Студент", value: "student" },
        { text: "Преподаватель", value: "teacher" }
      ],
      nameErrors: []
    };
  },
  computed: {

  },
  methods: {
    async submit() {
      try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
          username: this.username,
          email: this.email,
          password: this.password,
          role: this.role
        });

        localStorage.setItem("token", response.data.token);
        alert("Регистрация успешна!");
        this.$router.push("/auth");
      } catch (error) {
        alert(error.response.data.error);
      }
    },
    clear() {
      this.username = "";
      this.email = "";
      this.password = "";
      this.role = "";
      this.nameErrors = [];
    }
  },
};
</script>

<style>
form{
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