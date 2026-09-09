import { Landmark, Smartphone, QrCode, CircleDollarSign, Coins } from "lucide-react";

export const PAYMENT_TYPES = [
  {
    key: "Bank",
    label: "Bank",
    icon: Landmark,
    color: "var(--bank)",
    fields: [
      { name: "accountHolderName", label: "Account Holder's Name", type: "text" },
      { name: "bankName", label: "Bank Name", type: "text" },
      { name: "accountNumber", label: "Account Number", type: "text" },
      { name: "ifscCode", label: "IFSC Code", type: "text" },
      { name: "branchName", label: "Branch Name", type: "text" },
    ],
    summary: (p) =>
      `${p.bankName || "Bank"} · ${p.accountHolderName || ""} · ••••${String(
        p.accountNumber || ""
      ).slice(-4)}`,
  },
  {
    key: "Paytm",
    label: "Paytm",
    icon: Smartphone,
    color: "var(--paytm)",
    fields: [{ name: "paytmNumber", label: "Paytm Number", type: "tel" }],
    summary: (p) => p.paytmNumber || "",
  },
  {
    key: "UPI",
    label: "UPI",
    icon: QrCode,
    color: "var(--upi)",
    fields: [{ name: "upiId", label: "UPI ID", type: "text" }],
    summary: (p) => p.upiId || "",
  },
  {
    key: "PayPal",
    label: "PayPal",
    icon: CircleDollarSign,
    color: "var(--paypal)",
    fields: [{ name: "paypalEmail", label: "PayPal Email Address", type: "email" }],
    summary: (p) => p.paypalEmail || "",
  },
  {
    key: "USDT",
    label: "USDT",
    icon: Coins,
    color: "var(--usdt)",
    fields: [{ name: "usdtAddress", label: "USDT Wallet Address", type: "text" }],
    summary: (p) => p.usdtAddress || "",
  },
];

export function getTypeConfig(key) {
  return PAYMENT_TYPES.find((t) => t.key === key);
}
