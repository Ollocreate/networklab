<template>
  <div>
    <h1>Заявки на регистрацию преподавателей</h1>
    <v-table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Имя</th>
          <th>Статус</th>
          <th>Действие</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="request in pendingRequests" :key="request.id">
          <td>{{ request.id }}</td>
          <td>{{ request.email }}</td>
          <td>{{ request.username }}</td>
          <td>{{ request.status }}</td>
          <td>
            <v-btn color="green" @click="approve(request.id)">Одобрить</v-btn>
            <v-btn color="red" @click="reject(request.id)">Отклонить</v-btn>
          </td>
        </tr>

        <tr v-for="request in approvedRequests" :key="request.id">
          <td>{{ request.id }}</td>
          <td>{{ request.email }}</td>
          <td>{{ request.username }}</td>
          <td>{{ request.status }}</td>
          <td></td>
        </tr>
      </tbody>
    </v-table>

    <v-snackbar v-model="snackbar" :timeout="3000" color="success">
      Заявка одобрена!
    </v-snackbar>
  </div>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      requests: [],
      snackbar: false,
    };
  },
  computed: {
    ...mapGetters(["getToken"]),

    pendingRequests() {
      return this.requests.filter((request) => request.status === "pending");
    },

    approvedRequests() {
      return this.requests.filter(
        (request) =>
          request.status === "approved" || request.status === "rejected"
      );
    },
  },
  async created() {
    this.fetchRequests();
  },
  methods: {
    async fetchRequests() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/requests",
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );
        this.requests = response.data;
      } catch (error) {
        alert("Ошибка загрузки заявок");
      }
    },

    async approve(requestId) {
      try {
        await axios.post(
          "http://localhost:5000/api/admin/approve",
          { requestId },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );

        this.requests = this.requests.filter(
          (request) => request.id !== requestId
        );
        this.snackbar = true;
      } catch (error) {
        alert("Ошибка при одобрении заявки");
      }
    },

    async reject(requestId) {
      try {
        await axios.post(
          "http://localhost:5000/api/admin/reject",
          { requestId },
          {
            headers: { Authorization: `Bearer ${this.getToken}` },
          }
        );

        this.requests = this.requests.filter(
          (request) => request.id !== requestId
        );
      } catch (error) {
        alert("Ошибка при отклонении заявки");
      }
    },
  },
};
</script>

<style scoped></style>
