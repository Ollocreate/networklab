<template>
  <div>
    <button @click="activateWireMode">Режим проводов</button>

    <div v-if="showModal" class="modal">
      <h3>Выбор интерфейсов</h3>
      <div>
        <label>Узел 1 - Интерфейс:</label>
        <select v-model="selectedIface1">
          <option v-for="iface in interfaces1" :key="iface.id" :value="iface.id">
            {{ iface.name }}
          </option>
        </select>
      </div>
      <div>
        <label>Узел 2 - Интерфейс:</label>
        <select v-model="selectedIface2">
          <option v-for="iface in interfaces2" :key="iface.id" :value="iface.id">
            {{ iface.name }}
          </option>
        </select>
      </div>
      <button @click="createConnection">Создать соединение</button>
      <button @click="cancelConnection">Отмена</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "WireTool",
  data() {
    return {
      wireMode: false,
      selectedNodes: [],
      showModal: false,
      interfaces1: [],
      interfaces2: [],
      selectedIface1: null,
      selectedIface2: null,
    };
  },
  methods: {
    activateWireMode() {
      this.wireMode = !this.wireMode;
      console.log("🔌 Режим проводов:", this.wireMode ? "Включен" : "Выключен");
      document.body.style.cursor = this.wireMode ? "crosshair" : "default";
    },

    async onNodeClick(node) {
      if (!this.wireMode) return;

      this.selectedNodes.push(node);
      console.log("🖱️ Выбрана нода:", node);

      if (this.selectedNodes.length === 2) {
        await this.fetchInterfaces();
        this.showModal = true;
      }
    },

    async fetchInterfaces() {
  const [node1, node2] = this.selectedNodes;
  try {
    const res1 = await axios.get(
      `http://localhost:5000/api/labs/node/${node1.id}/interfaces`
    );
    const res2 = await axios.get(
      `http://localhost:5000/api/labs/node/${node2.id}/interfaces`
    );

    const parseInterfaces = (data) => {
      if (Array.isArray(data.ethernet)) {
        // Если интерфейсы в виде массива (QEMU)
        return data.ethernet
        .filter((iface) => iface.network_id === 0)
        .map((iface, index) => ({
          id: index,
          name: iface.name,
        }));
      } else {
        // Если интерфейсы в виде объекта (IOL)
        return Object.entries(data.ethernet)
        .filter(([, iface]) => iface.network_id === 0)
        .map(([key, iface]) => ({
          id: parseInt(key),
          name: iface.name,
        }));
      }
    };

    this.interfaces1 = parseInterfaces(res1.data.data);
    this.interfaces2 = parseInterfaces(res2.data.data);

    if (this.interfaces1.length > 0) {
      this.selectedIface1 = this.interfaces1[0].id;
    }
    if (this.interfaces2.length > 0) {
      this.selectedIface2 = this.interfaces2[0].id;
    }

    console.log("🌐 Интерфейсы узла 1:", this.interfaces1);
    console.log("🌐 Интерфейсы узла 2:", this.interfaces2);
  } catch (error) {
    console.error("Ошибка загрузки интерфейсов:", error.message);
  }
}
,

    async createConnection() {
      const [node1, node2] = this.selectedNodes;
      try {
        const networkRes = await axios.post("http://localhost:5000/api/labs/network/create", {
          name: `Net-${node1.name}-${node2.name}`,
          left: 150,
          top: 150,
        });
        const networkId = networkRes.data.data.id;
        console.log("🌐 Создана сеть:", networkId);

        await axios.post("http://localhost:5000/api/labs/connection/create", {
          node1Id: node1.id,
          node1Iface: this.selectedIface1,
          node2Id: node2.id,
          node2Iface: this.selectedIface2,
          networkId: parseInt(networkId),
        });

        this.$emit("connectionCreated", {
          source: node1,
          destination: node2,
        });

        this.closeModal();
      } catch (error) {
        console.error("Ошибка создания соединения:", error.response?.data || error.message);
      }
    },

    cancelConnection() {
      this.resetSelection();
    },

    closeModal() {
    this.showModal = false;
    this.selectedNodes = [];
    this.selectedIface1 = null;
    this.selectedIface2 = null;
    console.log("🔒 Модальное окно закрыто");
    },

    resetSelection() {
      this.selectedNodes = [];
      this.showModal = false;
      this.wireMode = false;
      document.body.style.cursor = "default";
    },
  },
};
</script>

<style>
.modal {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -30%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

select {
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  border-radius: 4px;
  border: 2px solid #007bff;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

select:focus {
  border-color: #0056b3;
}
</style>
