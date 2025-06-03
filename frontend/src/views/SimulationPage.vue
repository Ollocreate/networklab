<template>
  <div class="lab-container">
    <h2 style="margin: 10px 0">
      Лабораторная работа. Просмотр таблицы MAC-адресов коммутатора
    </h2>
    <div class="toolbar">
      <button @click="fetchLabData" class="open-lab-button">
        Открыть лабораторию
      </button>
      <WireTool ref="wireTool" @connectionCreated="addConnection" />
      <TaskTooltip
        taskText="Соедините коммутатор с маршрутизатором проводом. Для просмотра МАС-адресa коммутатора введите команду show interfaces vlan 1."
      />
    </div>

    <LabCanvas
      ref="labCanvas"
      :nodes="nodes"
      :links="links"
      :deviceIcons="deviceIcons"
      :stageConfig="stageConfig"
      @drag-move="onDragMove"
      @drag-end="onDragEnd"
      @node-click="onNodeClick"
      @context-menu="showContextMenu"
    />

    <ContextMenu
      ref="contextMenu"
      :visible="contextMenuVisible"
      :node="currentNode"
      :position="contextMenuPosition"
      @toggle-node="() => toggleNode(currentNode)"
      @hide="hideContextMenu"
    />

    <div v-if="showConsole">
      <TheConsole @close="showConsole = false" />
    </div>

    <button v-if="canvasLoaded" class="finish-button" @click="finishTask">
      Завершить задание
    </button>
  </div>
</template>

<script>
import axios from "axios";
import TheConsole from "../components/lab/TheConsole.vue";
import WireTool from "../components/lab/WireTool.vue";
import LabCanvas from "../components/lab/LabCanvas.vue";
import ContextMenu from "../components/lab/ContextMenu.vue";
import TaskTooltip from "../components/lab/TaskTooltip.vue";

export default {
  name: "SimulationPage",
  components: {
    TheConsole,
    WireTool,
    LabCanvas,
    ContextMenu,
    TaskTooltip,
  },

  data() {
    return {
      nodes: [],
      links: [],
      deviceIcons: {},
      stageConfig: {
        width: 800,
        height: 500,
      },
      currentNode: null,
      isConnecting: false,
      showConsole: false,
      contextMenuPosition: { x: 0, y: 0 },
      contextMenuVisible: false,
      canvasLoaded: false,
    };
  },
  computed: {},
  methods: {
    async fetchLabData() {
      try {
        await axios.get("http://localhost:5000/api/labs/nodes/stop");
        console.log("🔴 Все ноды остановлены");

        const [nodesResponse, topologyResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/labs/nodes"),
          axios.get("http://localhost:5000/api/labs/topology"),
        ]);

        if (
          nodesResponse.data.status === "success" &&
          topologyResponse.data.status === "success"
        ) {
          console.log("🔹 Ноды:", nodesResponse.data.data);
          console.log("🔹 Топология:", topologyResponse.data.data);
          this.processLabData(
            nodesResponse.data.data,
            topologyResponse.data.data
          );
        } else {
          console.error(
            "Ошибка загрузки данных:",
            nodesResponse.data.message,
            topologyResponse.data.message
          );
        }
      } catch (error) {
        console.error("Ошибка запроса к API:", error);
      }
    },

    processLabData(nodesData, topologyData) {
      const nodesById = {};

      this.nodes = Object.values(nodesData).map((node) => {
        const processedNode = {
          id: node.id,
          name: node.name,
          x: node.left || 100,
          y: node.top || 100,
          icon: node.icon,
          url: node.url,
        };
        nodesById[node.id] = processedNode;
        return processedNode;
      });

      this.links = topologyData
        .map((link) => {
          const sourceId = link.source.replace("node", "");
          const destinationId = link.destination.replace("node", "");

          const sourceNode = nodesById[sourceId];
          const destinationNode = nodesById[destinationId];

          if (!sourceNode || !destinationNode) return null;

          return { source: sourceNode, destination: destinationNode };
        })
        .filter((link) => link !== null);

      console.log("✅ Обработанные узлы:", this.nodes);
      console.log("✅ Обработанные связи:", this.links);

      this.loadAllIcons();
      this.canvasLoaded = true;
    },

    async loadAllIcons() {
      const iconMap = {
        "Switch.png": "switch.svg",
        "Router.png": "router.svg",
        "Server-2D-Linux-S.svg": "workstation.svg",
      };

      const loadImage = (iconName) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = `/icons/${iconMap[iconName] || iconName}`;
          img.onload = () => resolve(img);
          img.onerror = () => {
            console.error(`Ошибка загрузки иконки: ${iconName}`);
            resolve(null);
          };
        });
      };

      for (const node of this.nodes) {
        const img = await loadImage(node.icon);
        if (img) {
          this.deviceIcons[node.icon] = img;
        }
      }

      console.log("✅ Иконки загружены", this.deviceIcons);
    },

    onDragMove(event, node) {
      const newPos = event.target.position();
      node.x = newPos.x;
      node.y = newPos.y;
      this.$refs.labCanvas?.getLayerNode()?.batchDraw();
    },

    onDragEnd(node) {
      console.log("🔹 Перемещение узла:", node);
    },

    async toggleNode(node) {
      try {
        if (node.isOn) {
          await axios.get(
            `http://localhost:5000/api/labs/node/${node.id}/stop`
          );
          console.log(`🛑 Нода ${node.name} остановлена`);
          node.isOn = false;
        } else {
          await axios.get(
            `http://localhost:5000/api/labs/node/${node.id}/start`
          );
          console.log(`🚀 Нода ${node.name} запущена`);
          node.isOn = true;
        }
        this.hideContextMenu();
      } catch (error) {
        console.error(`Ошибка управления нодой ${node.name}:`, error);
      }
    },

    openTelnet(node, event) {
      if (event && event.evt.button !== 0) return;

      if (node.isOn) {
        const url = this.$router.resolve({
          name: "Console",
          params: { id: node.id },
        }).href;
        window.open(
          url,
          "_blank",
          "width=800,height=400,menubar=no,toolbar=no,location=no,status=no"
        );
      } else {
        console.warn(
          `❗ Нода ${node.name} выключена — консоль не открывается.`
        );
      }
    },

    addConnection(link) {
      this.links.push(link);
    },

    onNodeClick(node, event) {
      if (event && event.evt.button !== 0) return;

      const isWireMode = this.$refs.wireTool?.isConnecting;

      if (isWireMode) {
        if (node.isOn) {
          alert(
            `Узел ${node.name} включен. Выключите его перед созданием соединения.`
          );
          return;
        } else {
          this.$refs.wireTool.onNodeClick(node);
        }
      } else {
        if (!node.isOn) {
          alert(
            `Узел ${node.name} выключен. Включите его перед подключением к консоли.`
          );
          return;
        } else {
          this.openTelnet(node, event);
        }
      }
    },

    showContextMenu(event, node) {
      event.evt.preventDefault();
      event.evt.stopPropagation();

      this.currentNode = node;

      const x = event.evt.pageX - 225;
      const y = event.evt.pageY - 50;

      this.contextMenuPosition = { x, y };
      this.contextMenuVisible = true;
    },

    hideContextMenu() {
      const menu = this.$refs.contextMenu?.$el;
      menu.style.display = "none";
    },
    finishTask() {
      this.$router.go(-1);
    },
  },
  mounted() {
    const container = this.$el.querySelector(".canvas-container");
    if (container) {
      this.stageConfig.width = container.clientWidth;
      this.stageConfig.height = container.clientHeight;
    }
  },
};
</script>

<style>
button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

#context-menu {
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#context-menu button {
  display: block;
  width: 100%;
  padding: 5px 10px;
  margin: 0;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

#context-menu button:hover {
  background-color: #0056b3;
}

.lab-container {
  position: relative;
}

.finish-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #28a745;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  z-index: 1001;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.finish-button:hover {
  background-color: #218838;
}

.open-lab-button {
  margin: 0;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  user-select: none;
}

.open-lab-button:hover {
  background-color: #0056b3;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  position: relative;
}
</style>
