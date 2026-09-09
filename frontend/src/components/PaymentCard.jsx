import { Pencil, Trash2 } from "lucide-react";
import { getTypeConfig } from "../paymentTypes";

export default function PaymentCard({ payment, onEdit, onDelete }) {
  const config = getTypeConfig(payment.paymentType);
  if (!config) return null;
  const Icon = config.icon;

  return (
    <div className="payment-card">
      <div className="payment-card-icon" style={{ background: config.color }}>
        <Icon size={18} color="#0b0e14" />
      </div>
      <div className="payment-card-body">
        <div className="payment-card-type">{config.label}</div>
        <div className="payment-card-summary">{config.summary(payment)}</div>
      </div>
      <div className="payment-card-actions">
        <button
          type="button"
          className="icon-btn"
          aria-label={`Edit ${config.label} payment method`}
          onClick={() => onEdit(payment)}
        >
          <Pencil size={16} />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn-danger"
          aria-label={`Delete ${config.label} payment method`}
          onClick={() => onDelete(payment)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
