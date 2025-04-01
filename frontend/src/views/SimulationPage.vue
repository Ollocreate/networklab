<template>
  <div>
    <h1>Управление лабораториями EVE-NG</h1>
    <button @click="fetchLabData">Открыть лабораторию</button>
    <WireTool ref="wireTool" @connectionCreated="addConnection" />
    <div v-if="nodes.length > 0" class="canvas-container">
      <v-stage ref="stage" :config="stageConfig">

        <v-layer ref="layer">
          <!-- Линии между узлами -->
          <v-line v-for="(link, index) in computedLinks" :key="'line-' + index" :config="{
            points: link.points,
            stroke: '#007bff',
            strokeWidth: 2,
            lineCap: 'round',
            lineJoin: 'round',
          }" />

          <!-- Узлы (устройства) -->
          <v-group v-for="node in nodes" :key="'node-' + node.id" :config="{
            x: node.x || 0,
            y: node.y || 0,
            draggable: true,
          }" @dragmove="onDragMove($event, node)" @dragend="onDragEnd(node)"
            @click="onNodeClick(node, $event); openTelnet(node, $event)" @contextmenu="showContextMenu($event, node)">
            <v-circle :config="{
              radius: 22,
              fill: node.isOn ? '#007bff' : '#666', // Индикация состояния
            }" />
            <v-image :config="{
              image: deviceIcons[node.icon],
              width: 40,
              height: 40,
              offsetX: 20,
              offsetY: 20,
            }" />
            <v-text :config="{
              text: node.name,
              fontSize: 12,
              fill: '#333',
              align: 'center',
              y: 25,
              x: -20,
              width: 80,
            }" />
          </v-group>
        </v-layer>
      </v-stage>
    </div>

    <div id="context-menu" @mouseleave="hideContextMenu" style="
        display: none;
        position: absolute;
        background-color: white;
        border: 1px solid #ccc;
        padding: 5px;
        z-index: 1000;
      ">
      <button @click="toggleNode(currentNode)">
        {{ currentNode && currentNode.isOn ? "Stop" : "Start" }}
      </button>
    </div>

    <div v-if="showConsole">
      <TheConsole @close="showConsole = false" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import TheConsole from "../components/TheConsole.vue";
import WireTool from "../components/WireTool.vue";

export default {
  name: "SimulationPage",
  components: {
    TheConsole,
    WireTool
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
      showConsole: false,
    };
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

    async fetchLabData() {
      try {
        // Остановка всех нод перед запуском
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
      // Создаем временный объект для быстрого доступа к узлам по id
      const nodesById = {};

      // Преобразуем список узлов
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

      // Формируем связи, используя ссылки на узлы из nodesById
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

      // Загружаем иконки для всех устройств
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
      // Обновляем слой для перерисовки линий
      this.$refs.layer.getNode().batchDraw();
    },

    onDragEnd(node) {
      console.log("🔹 Перемещение узла:", node);
      // Здесь можно добавить сохранение позиции на сервере
    },

    async toggleNode(node) {
      try {
        if (node.isOn) {
          // Остановка ноды
          await axios.get(
            `http://localhost:5000/api/labs/node/${node.id}/stop`
          );
          console.log(`🛑 Нода ${node.name} остановлена`);
          node.isOn = false; // Обновляем состояние
        } else {
          // Запуск ноды
          await axios.get(
            `http://localhost:5000/api/labs/node/${node.id}/start`
          );
          console.log(`🚀 Нода ${node.name} запущена`);
          node.isOn = true; // Обновляем состояние
        }
        this.hideContextMenu(); // Прячем меню после операции
      } catch (error) {
        console.error(`Ошибка управления нодой ${node.name}:`, error);
      }
    },

    openTelnet(node, event) {
      // Проверяем, что нажата левая кнопка (код 0)
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
      // Проверяем, что нажата левая кнопка мыши
      if (event && event.evt.button !== 0) return;

      // Если нода включена — не даём использовать провод
      if (node.isOn) {
        console.warn(`❗ Нода ${node.name} включена — нельзя подключить провод.`);
        alert(`Узел ${node.name} включен. Выключите его перед созданием соединения.`);
        return;
      }

      this.$refs.wireTool.onNodeClick(node);
    }
    ,

    showContextMenu(event, node) {
      event.evt.preventDefault();
      event.evt.stopPropagation(); // Останавливаем всплытие события

      this.currentNode = node;
      const menu = document.getElementById("context-menu");
      menu.style.display = "block";
      menu.style.left = `${event.evt.clientX}px`;
      menu.style.top = `${event.evt.clientY}px`;
    },

    // Скрыть контекстное меню
    hideContextMenu() {
      const menu = document.getElementById("context-menu");
      menu.style.display = "none";
    },
  },
  mounted() {
    // Устанавливаем размеры сцены в соответствии с размерами контейнера
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

.canvas-container {
  margin: 20px auto;
  width: 800px;
  height: 500px;
  border: 1px solid #000;
  background-color: #f8f9fa;
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
</style>
