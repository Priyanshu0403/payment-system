const mongoose = require("mongoose");

const PAYMENT_TYPES = ["Bank", "Paytm", "UPI", "PayPal", "USDT"];

const paymentMethodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentType: {
      type: String,
      enum: PAYMENT_TYPES,
      required: [true, "paymentType is required"],
    },

    // Bank fields
    ifscCode: {
      type: String,
      trim: true,
      uppercase: true,
      required: function () {
        return this.paymentType === "Bank";
      },
    },
    branchName: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "Bank";
      },
    },
    bankName: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "Bank";
      },
    },
    accountNumber: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "Bank";
      },
    },
    accountHolderName: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "Bank";
      },
    },

    // Paytm
    paytmNumber: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "Paytm";
      },
    },

    // UPI
    upiId: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "UPI";
      },
    },

    // PayPal
    paypalEmail: {
      type: String,
      trim: true,
      lowercase: true,
      required: function () {
        return this.paymentType === "PayPal";
      },
    },

    // USDT
    usdtAddress: {
      type: String,
      trim: true,
      required: function () {
        return this.paymentType === "USDT";
      },
    },
  },
  { timestamps: true }
);

// Strip out fields that don't belong to the selected paymentType before saving,
// so only relevant fields are ever stored (as required by the spec).
const FIELDS_BY_TYPE = {
  Bank: ["ifscCode", "branchName", "bankName", "accountNumber", "accountHolderName"],
  Paytm: ["paytmNumber"],
  UPI: ["upiId"],
  PayPal: ["paypalEmail"],
  USDT: ["usdtAddress"],
};
const ALL_TYPE_FIELDS = Object.values(FIELDS_BY_TYPE).flat();

paymentMethodSchema.pre("validate", function (next) {
  const keep = new Set(FIELDS_BY_TYPE[this.paymentType] || []);
  for (const field of ALL_TYPE_FIELDS) {
    if (!keep.has(field)) {
      this[field] = undefined;
    }
  }
  next();
});

paymentMethodSchema.statics.PAYMENT_TYPES = PAYMENT_TYPES;
paymentMethodSchema.statics.FIELDS_BY_TYPE = FIELDS_BY_TYPE;

module.exports = mongoose.model("PaymentMethod", paymentMethodSchema);
