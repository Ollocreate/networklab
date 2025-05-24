const axios = require("axios");
const cookie = require("cookie");
require("dotenv").config();
const { eveNgClient } = require("../config/eveNgClient");

exports.apiStatus = async (req, res) => {
  try {
    const labListResponse = await eveNgClient.get(`/api/status`);

    console.log("Лаборатория клонирована успешно:");
    console.log(labListResponse.data);
    res.json(labListResponse.data);
  } catch (error) {
    console.error(
      "Ошибка при клонировании лаборатории:",
      error.response ? error.response.data : error.message
    );
  }
};

exports.getLabTopology = async (req, res) => {
  try {
    // const { labPath } = "/test.unl"; // Например: "/User1/MyLab.unl"

    const response = await eveNgClient.get(`/api/labs/test.unl/topology`);
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка получения данных лаборатории:", error.message);
    res.status(500).json({ error: "Ошибка при получении данных лаборатории" });
  }
};

exports.getLabNodes = async (req, res) => {
  try {
    // const { labPath } = "/test.unl"; // Например: "/User1/MyLab.unl"

    const response = await eveNgClient.get(`/api/labs/test.unl/nodes`);
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка получения устройств:", error.message);
    res.status(500).json({ error: "Ошибка при получении устройств" });
  }
};

exports.getLabNetworks = async (req, res) => {
  try {
    // const { labPath } = "/test.unl"; // Например: "/User1/MyLab.unl"

    const response = await eveNgClient.get(`/api/labs/test.unl/networks`);
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка получения сетей:", error.message);
    res.status(500).json({ error: "Ошибка при получении сетей" });
  }
};

exports.startNode = async (req, res) => {
  try {
    const { nodeId } = req.params;
    if (!nodeId) {
      return res.status(400).json({ error: "Не указан ID узла" });
    }

    const response = await eveNgClient.get(
      `/api/labs/test.unl/nodes/${nodeId}/start`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка запуска узла:", error.message);
    res.status(500).json({ error: "Ошибка при запуске узла" });
  }
};

exports.stopNode = async (req, res) => {
  try {
    // const { labPath } = "/test.unl"; // Например: "/User1/MyLab.unl"
    // const { nodeId } = "1"; // Например: "/User1/MyLab.unl"

    const response = await eveNgClient.get(
      `/api/labs/test.unl/nodes/${nodeId}/stop`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка выключения узла:", error.message);
    res.status(500).json({ error: "Ошибка при выключении узла" });
  }
};

exports.stopAllNodes = async (req, res) => {
  try {
    // const { labPath } = "/test.unl"; // Например: "/User1/MyLab.unl"

    const response = await eveNgClient.get(`/api/labs/test.unl/nodes/stop`);
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка выключения узлов:", error.message);
    res.status(500).json({ error: "Ошибка при выключении узлов" });
  }
};


exports.getNodeInterfaces = async (req, res) => {
  try {
    const { nodeId } = req.params;
    if (!nodeId) {
      return res.status(400).json({ error: "Не указан ID узла" });
    }
    // const { labPath } = "/test.unl"; // Например: "/User1/MyLab.unl"

    const response = await eveNgClient.get(
      `/api/labs/test.unl/nodes/${nodeId}/interfaces`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Ошибка получения интерфейсов:", error.message);
    res.status(500).json({ error: "Ошибка при получении интерфейсов" });
  }
};

exports.createNetwork = async (req, res) => {
  const { name, left, top } = req.body;

  try {
    const response = await eveNgClient.post(`/api/labs/test.unl/networks`, {
      count: 2,
      name: name,
      type: "bridge",
      left: left,
      top: top,
      visibility: 1,
      postfix: 0,
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Ошибка создания сети:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Ошибка создания сети" });
  }
};

exports.createConnection = async (req, res) => {
  const { node1Id, node1Iface, node2Id, node2Iface, networkId } = req.body;

  try {
    await eveNgClient.put(`/api/labs/test.unl/nodes/${node1Id}/interfaces`, {
      [node1Iface]: networkId,
    });

    await eveNgClient.put(`/api/labs/test.unl/nodes/${node2Id}/interfaces`, {
      [node2Iface]: networkId,
    });

    await eveNgClient.put(`/api/labs/test.unl/networks/${networkId}`, {
      visibility: 0,
    });

    res.json({ status: "success", message: "Соединение создано" });
  } catch (error) {
    console.error(
      "Ошибка создания соединения:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Ошибка создания соединения" });
  }
};
