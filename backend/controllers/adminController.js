const mongoose = require("mongoose");
const PaymentMethod = require("../models/PaymentMethod");
const User = require("../models/User");

// GET /api/admin/payments
// Supports query params: username, paymentType, bankName, ifscCode,
// paytmNumber, upiId, paypalEmail, usdtAddress
async function getAllPayments(req, res) {
  try {
    const {
      username,
      paymentType,
      bankName,
      ifscCode,
      paytmNumber,
      upiId,
      paypalEmail,
      usdtAddress,
    } = req.query;

    const match = {};

    if (paymentType) match.paymentType = paymentType;
    if (bankName) match.bankName = { $regex: bankName, $options: "i" };
    if (ifscCode) match.ifscCode = { $regex: ifscCode, $options: "i" };
    if (paytmNumber) match.paytmNumber = { $regex: paytmNumber, $options: "i" };
    if (upiId) match.upiId = { $regex: upiId, $options: "i" };
    if (paypalEmail) match.paypalEmail = { $regex: paypalEmail, $options: "i" };
    if (usdtAddress) match.usdtAddress = { $regex: usdtAddress, $options: "i" };

    let userIds = null;
    if (username) {
      const matchingUsers = await User.find({
        username: { $regex: username, $options: "i" },
      }).select("_id");
      userIds = matchingUsers.map((u) => u._id);
      match.user = { $in: userIds };
    }

    const payments = await PaymentMethod.find(match)
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    return res.json({ count: payments.length, payments });
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch payments", error: err.message });
  }
}

module.exports = { getAllPayments };
