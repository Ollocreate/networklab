const axios = require('axios');
const cookie = require('cookie');
require("dotenv").config();
const { eveNgClient } = require("../config/eveNgClient");

exports.apiStatus = async (req, res) => {
  try {
      const labListResponse = await eveNgClient.get(`/api/status`);

      console.log('Лаборатория клонирована успешно:');
      console.log(labListResponse.data);
      res.json(labListResponse.data);
  } catch (error) {
      console.error('Ошибка при клонировании лаборатории:', error.response ? error.response.data : error.message);
  }
}

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