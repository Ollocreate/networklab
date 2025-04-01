const express = require("express");
const {
  apiStatus,
  getLabTopology,
  getLabNodes,
  getLabNetworks,
  startNode,
  stopNode,
  stopAllNodes,
  createConnection,
  createNetwork,
  getNodeInterfaces
} = require("../controllers/labController");

const router = express.Router();

router.get("/status", apiStatus);
router.get("/topology", getLabTopology);
router.get("/nodes", getLabNodes);
router.get("/networks", getLabNetworks);
router.get("/node/:nodeId/start", startNode);
router.get("/node/:nodeId/stop", stopNode);
router.get("/nodes/stop", stopAllNodes);
router.get("/node/:nodeId/interfaces", getNodeInterfaces);

router.post("/connection/create", createConnection);
router.post("/network/create", createNetwork);

module.exports = router;
