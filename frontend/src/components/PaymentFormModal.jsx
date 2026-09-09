import { useState } from "react";
import { X } from "lucide-react";

export default function PaymentFormModal({ typeConfig, initialData, onClose, onSubmit }) {
  const isEdit = Boolean(initialData);
  const [values, setValues] = useState(() => {
    const initial = {};
    for (const f of typeConfig.fields) {
      initial[f.name] = initialData?.[f.name] || "";
    }
    return initial;
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const Icon = typeConfig.icon;

  function handleChange(name, value) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this payment method.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon" style={{ background: typeConfig.color }}>
              <Icon size={16} color="#0b0e14" />
            </span>
            {isEdit ? `Edit ${typeConfig.label}` : `Add ${typeConfig.label}`}
          </div>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {typeConfig.fields.map((f) => (
            <div className="field" key={f.name}>
              <label htmlFor={f.name}>{f.label}</label>
              <input
                id={f.name}
                type={f.type}
                value={values[f.name]}
                onChange={(e) => handleChange(f.name, e.target.value)}
                required
              />
            </div>
          ))}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Saving..." : isEdit ? "Save changes" : "Add payment method"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
