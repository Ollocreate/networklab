<template>
  <div>
    <h1>Home Page</h1>
    <ul>
      <li v-for="user in users" :key="user.id">{{ user.username }}</li>
      <li v-for="user in users" :key="user.id">{{ user.email }}</li>
    </ul>
    <input v-model="newUser.username" placeholder="Username" />
    <input v-model="newUser.email" placeholder="Email" />
    <button @click="addUser">Add User</button>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      users: [],
      newUser: { username: '', email: '' },
    };
  },
  methods: {
    addUser() {
      this.users.push({ ...this.newUser });
      this.newUser = { username: '', email: '' };
    },
  },
};
</script>

<style>

</style>