<template>
  <div class="task-tooltip">
    <button
      class="icon-button"
      @click="showModal = true"
      aria-label="Показать задание"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ff6600"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-alert-circle"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <circle cx="12" cy="16" r="0.5"></circle>
      </svg>
    </button>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div
        class="modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
      >
        <h2 id="modalTitle">Задание</h2>
        <p>{{ taskText }}</p>
        <button class="close-btn" @click="closeModal">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TaskTooltip",
  props: {
    taskText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>
.task-tooltip {
  display: inline-block;
  position: relative;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.icon-button svg {
  display: block;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.modal-content {
  background-color: white;
  padding: 20px;
  width: 320px;
  max-width: 90%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.close-btn {
  margin-top: 15px;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
}

.close-btn:hover {
  background-color: #0056b3;
}
</style>
