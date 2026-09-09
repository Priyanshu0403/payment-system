import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, ShieldCheck, Lightbulb, Wallet } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { PAYMENT_TYPES, getTypeConfig } from "../paymentTypes";
import PaymentCard from "../components/PaymentCard.jsx";
import PaymentFormModal from "../components/PaymentFormModal.jsx";
import "../styles/dashboard.css";

export default function PaymentDashboard() {
  const { user, logout } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); 

  useEffect(() => {
    loadPayments();
  }, []);

  async function loadPayments() {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/payments");
      setPayments(res.data.payments);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load your payment methods.");
    } finally {
      setLoading(false);
    }
  }

  function openAdd(typeKey) {
    setModal({ typeConfig: getTypeConfig(typeKey), payment: null });
  }

  function openEdit(payment) {
    setModal({ typeConfig: getTypeConfig(payment.paymentType), payment });
  }

  async function handleSubmit(values) {
    if (modal.payment) {
      const res = await api.put(`/payments/${modal.payment._id}`, values);
      setPayments((prev) =>
        prev.map((p) => (p._id === res.data.payment._id ? res.data.payment : p))
      );
    } else {
      const res = await api.post("/payments", {
        paymentType: modal.typeConfig.key,
        ...values,
      });
      setPayments((prev) => [res.data.payment, ...prev]);
    }
    setModal(null);
  }

  async function handleDelete(payment) {
    const config = getTypeConfig(payment.paymentType);
    const ok = window.confirm(`Remove this ${config.label} payment method?`);
    if (!ok) return;
    try {
      await api.delete(`/payments/${payment._id}`);
      setPayments((prev) => prev.filter((p) => p._id !== payment._id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete this payment method.");
    }
  }

  return (
    <div className="dash-screen">
      <header className="dash-header">
        <div className="dash-header-title">
          <Wallet size={20} />
          <h1>My Payments</h1>
        </div>
        <div className="dash-header-actions">
          {user?.role === "admin" && (
            <Link to="/admin" className="btn-ghost">
              <ShieldCheck size={16} />
              Admin
            </Link>
          )}
          <span className="dash-username">{user?.username}</span>
          <button type="button" className="icon-btn" aria-label="Log out" onClick={logout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main className="dash-main">
        <section>
          <h2 className="section-title">Add Payment Options</h2>
          <div className="type-grid">
            {PAYMENT_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.key}
                  type="button"
                  className="type-pill"
                  onClick={() => openAdd(t.key)}
                >
                  <span className="type-pill-icon" style={{ background: t.color }}>
                    <Icon size={16} color="#0b0e14" />
                  </span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="section-title">Your payment methods</h2>

          {loading && <p className="dash-hint">Loading your payment methods...</p>}
          {error && <div className="auth-error">{error}</div>}

          {!loading && !error && payments.length === 0 && (
            <div className="empty-state">
              <p>You haven't added any payment methods yet.</p>
              <p className="dash-hint">Pick an option above to add your first one.</p>
            </div>
          )}

          <div className="payment-list">
            {payments.map((p) => (
              <PaymentCard
                key={p._id}
                payment={p}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </section>

        <section className="disclaimer-card">
          <div className="disclaimer-title">
            <Lightbulb size={18} color="var(--accent-gold)" />
            Disclaimer
          </div>
          <ol className="disclaimer-list">
            <li>Only add accounts and wallets that belong to you.</li>
            <li>Double-check details before saving — payouts use exactly what's on file.</li>
            <li>Remove any payment method you no longer use.</li>
          </ol>
        </section>
      </main>

      {modal && (
        <PaymentFormModal
          typeConfig={modal.typeConfig}
          initialData={modal.payment}
          onClose={() => setModal(null)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
