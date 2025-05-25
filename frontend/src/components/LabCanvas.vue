<template>
  <div v-if="nodes.length > 0" class="canvas-container">
    <v-stage ref="stage" :config="stageConfig">
      <v-layer ref="layer">
        <v-line
          v-for="(link, index) in computedLinks"
          :key="'line-' + index"
          :config="{
            points: link.points,
            stroke: '#007bff',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
          }"
        />
        <v-group
          v-for="node in nodes"
          :key="'node-' + node.id"
          :config="{
            x: node.x || 0,
            y: node.y || 0,
            draggable: true,
          }"
          @dragmove="$emit('drag-move', $event, node)"
          @dragend="$emit('drag-end', node)"
          @click="handleClick(node, $event)"
          @contextmenu="handleContextMenu($event, node)"
        >
          <v-circle
            :config="{
              radius: 22,
              fill: node.isOn ? '#007bff' : '#666',
            }"
          />
          <v-image
            :config="{
              image: deviceIcons[node.icon],
              width: 40,
              height: 40,
              offsetX: 20,
              offsetY: 20,
            }"
          />
          <v-text
            :config="{
              text: node.name,
              fontSize: 12,
              fill: '#333',
              align: 'center',
              y: 25,
              x: -20,
              width: 80,
            }"
          />
        </v-group>
      </v-layer>
    </v-stage>
  </div>
</template>

<script>
export default {
  name: "LabCanvas",
  props: {
    nodes: Array,
    links: Array,
    deviceIcons: Object,
    stageConfig: Object,
  },
  computed: {
    computedLinks() {
      return this.links.map((link) => {
        const sourceCenter = this.getNodeCenter(link.source);
        const destCenter = this.getNodeCenter(link.destination);
        return {
          points: [sourceCenter.x, sourceCenter.y, destCenter.x, destCenter.y],
        };
      });
    },
  },
  methods: {
    getNodeCenter(node) {
      if (!node) return { x: 0, y: 0 };
      return {
        x: node.x || 0,
        y: node.y || 0,
      };
    },
    handleClick(node, event) {
      this.$emit("node-click", node, event);
    },
    handleContextMenu(event, node) {
      event.evt.preventDefault();
      event.evt.stopPropagation();
      this.$emit("context-menu", event, node);
    },
  },
};
</script>

<style scoped>
.canvas-container {
  margin: 20px auto;
  width: 800px;
  height: 500px;
  border: 1px solid #000;
  background-color: #f8f9fa;
}
</style>
