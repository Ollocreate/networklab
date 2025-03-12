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
import axios from 'axios';
export default {
  name: 'HomePage',
  data() {
    return {
      users: [],
      newUser: { username: '', email: '' },
    };
  },
  async created() {
    const response = await axios.get('http://localhost:5000/api/users');
    this.users = response.data;
  },
  methods: {
    async addUser() {
      const response = await axios.post('http://localhost:5000/api/users', this.newUser);
      this.users.push(response.data);
      this.newUser = { username: '', email: '' };
    },
  },
};
</script>

<style>
  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }
  li {
    list-style-type: none;
    padding: 10px;
  }
</style>