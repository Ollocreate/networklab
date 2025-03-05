<template>
    <form>
    <v-text-field
      v-model="email"
      :error-messages="emailErrors"
      label="E-mail"
      required
      @input="$v.email.$touch()"
      @blur="$v.email.$touch()"
    ></v-text-field>
    <v-select
      v-model="select"
      :items="items"
      :error-messages="selectErrors"
      label="Пароль"
      required
      @change="$v.select.$touch()"
      @blur="$v.select.$touch()"
    ></v-select>
    <div class="btn-container">
      <v-btn color="primary" @click="submit">Войти</v-btn>
      <v-btn 
        color="blue-darken-4" 
        variant="outlined" 
        size="small"
        @click="clear">Забыли пароль?</v-btn>
    </div>
  </form>
</template>

<script>
  export default {
    name: "AuthPage"
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