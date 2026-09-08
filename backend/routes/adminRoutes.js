const express = require("express");
const { getAllPayments } = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/payments", protect, adminOnly, getAllPayments);

module.exports = router;
