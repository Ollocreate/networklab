const express = require("express");
const { apiStatus, getLabTopology, getLabNodes, getLabNetworks } = require("../controllers/labController");

const router = express.Router();

router.get("/status", apiStatus);
router.get("/topology", getLabTopology);
router.get("/nodes", getLabNodes);
router.get("/networks", getLabNetworks);


module.exports = router;