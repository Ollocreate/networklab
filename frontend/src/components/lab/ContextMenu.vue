<template>
  <div
    v-show="visible"
    :style="menuStyle"
    @mouseleave="$emit('hide')"
    class="context-menu"
  >
    <button @click="$emit('toggle-node')">
      {{ node && node.isOn ? "Stop" : "Start" }}
    </button>
  </div>
</template>

<script>
export default {
  name: "ContextMenu",
  props: {
    visible: Boolean,
    node: Object,
    position: Object,
  },
  computed: {
    menuStyle() {
      if (!this.position) return {};
      return {
        display: this.visible ? "block" : "none",
        position: "absolute",
        backgroundColor: "white",
        border: "1px solid #ccc",
        padding: "5px",
        zIndex: 1000,
        left: `${this.position.x}px`,
        top: `${this.position.y}px`,
        borderRadius: "4px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      };
    },
  },
};
</script>

<style scoped>
.context-menu button {
  display: block;
  width: 100%;
  padding: 5px 10px;
  margin: 0;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}
.context-menu button:hover {
  background-color: #0056b3;
}
</style>
