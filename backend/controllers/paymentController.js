const PaymentMethod = require("../models/PaymentMethod");

const { PAYMENT_TYPES, FIELDS_BY_TYPE } = PaymentMethod;

function pickTypeFields(body, paymentType) {
  const fields = FIELDS_BY_TYPE[paymentType] || [];
  const result = {};
  for (const field of fields) {
    if (body[field] !== undefined) result[field] = body[field];
  }
  return result;
}

async function addPayment(req, res) {
  try {
    const { paymentType } = req.body;

    if (!PAYMENT_TYPES.includes(paymentType)) {
      return res.status(400).json({
        message: `paymentType must be one of: ${PAYMENT_TYPES.join(", ")}`,
      });
    }

    const doc = await PaymentMethod.create({
      user: req.user._id,
      paymentType,
      ...pickTypeFields(req.body, paymentType),
    });

    return res.status(201).json({ payment: doc });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Could not add payment method", error: err.message });
  }
}

async function getMyPayments(req, res) {
  try {
    const payments = await PaymentMethod.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.json({ payments });
  } catch (err) {
    return res.status(500).json({ message: "Could not fetch payment methods", error: err.message });
  }
}

async function updatePayment(req, res) {
  try {
    const existing = await PaymentMethod.findOne({ _id: req.params.id, user: req.user._id });
    if (!existing) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    const updates = pickTypeFields(req.body, existing.paymentType);
    Object.assign(existing, updates);
    await existing.save();

    return res.json({ payment: existing });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    return res.status(500).json({ message: "Could not update payment method", error: err.message });
  }
}

async function deletePayment(req, res) {
  try {
    const deleted = await PaymentMethod.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) {
      return res.status(404).json({ message: "Payment method not found" });
    }
    return res.json({ message: "Payment method deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Could not delete payment method", error: err.message });
  }
}

module.exports = { addPayment, getMyPayments, updatePayment, deletePayment };
