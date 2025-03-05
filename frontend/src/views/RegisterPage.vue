<template>
  <form>
    <v-text-field
    v-model="name"
    :error-messages="nameErrors"
    label="Имя"
    required
    @input="$v.name.$touch()"
    @blur="$v.name.$touch()"
  ></v-text-field>
  <v-text-field
    v-model="surname"
    :error-messages="surnameErrors"
    label="Фамилия"
    required
    @input="$v.surname.$touch()"
    @blur="$v.surname.$touch()"
  ></v-text-field>
  <v-text-field
    v-model="email"
    :error-messages="emailErrors"
    label="E-mail"
    required
    @input="$v.email.$touch()"
    @blur="$v.email.$touch()"
  ></v-text-field>
  <v-text-field
    v-model="password"
    :error-messages="passwordErrors"
    label="Пароль"
    required
    @input="$v.password.$touch()"
    @blur="$v.password.$touch()"
  ></v-text-field>
  
  <div class="btn-container">
    <v-btn color="primary" @click="submit">Зарегистрироваться</v-btn>
    <v-btn 
      color="blue-darken-4" 
      variant="plain" 
      @click="clear">Уже зарегистрированы? Войти</v-btn>
  </div>
</form>
</template>

<script>
export default {
  name: "RegisterPage"
  }   
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