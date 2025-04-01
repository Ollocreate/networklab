const express = require("express");
const {
  getRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/requests", authMiddleware(["admin"]), getRequests);
router.post("/approve", authMiddleware(["admin"]), approveRequest);
router.post("/reject", authMiddleware(["admin"]), rejectRequest);

module.exports = router;
