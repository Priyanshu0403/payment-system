const express = require("express");
const {
  addPayment,
  getMyPayments,
  updatePayment,
  deletePayment,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect); // every route below requires a logged-in user

router.post("/", addPayment);
router.get("/", getMyPayments);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

module.exports = router;
