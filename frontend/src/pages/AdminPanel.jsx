import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, X } from "lucide-react";
import api from "../api/axios";
import { PAYMENT_TYPES, getTypeConfig } from "../paymentTypes";
import "../styles/admin.css";

// Only the fields the spec calls out as filterable per payment type.
const DETAIL_FILTERS = {
  Bank: [
    { name: "bankName", label: "Bank Name" },
    { name: "ifscCode", label: "IFSC Code" },
  ],
  Paytm: [{ name: "paytmNumber", label: "Paytm Number" }],
  UPI: [{ name: "upiId", label: "UPI ID" }],
  PayPal: [{ name: "paypalEmail", label: "PayPal Email" }],
  USDT: [{ name: "usdtAddress", label: "USDT Address" }],
};

const EMPTY_FILTERS = {
  username: "",
  paymentType: "",
  bankName: "",
  ifscCode: "",
  paytmNumber: "",
  upiId: "",
  paypalEmail: "",
  usdtAddress: "",
};

export default function AdminPanel() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    runSearch(EMPTY_FILTERS);
  }, []);

  async function runSearch(activeFilters) {
    setLoading(true);
    setError("");
    try {
      const params = Object.fromEntries(
        Object.entries(activeFilters).filter(([, v]) => v)
      );
      const res = await api.get("/admin/payments", { params });
      setPayments(res.data.payments);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load payment records.");
    } finally {
      setLoading(false);
    }
  }

  function updateFilter(name, value) {
    setFilters((f) => ({ ...f, [name]: value }));
  }

  function handleTypeChange(value) {
    // clear detail fields from the previous type when switching
    setFilters((f) => ({ ...EMPTY_FILTERS, username: f.username, paymentType: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    runSearch(filters);
  }

  function handleClear() {
    setFilters(EMPTY_FILTERS);
    runSearch(EMPTY_FILTERS);
  }

  const detailFields = DETAIL_FILTERS[filters.paymentType] || [];

  return (
    <div className="admin-screen">
      <header className="admin-header">
        <Link to="/" className="btn-ghost">
          <ArrowLeft size={16} />
          Back
        </Link>
        <h1>Admin · All payment methods</h1>
      </header>

      <main className="admin-main">
        <form className="admin-filters" onSubmit={handleSubmit}>
          <div className="admin-filters-row">
            <div className="field">
              <label htmlFor="f-username">Username</label>
              <input
                id="f-username"
                value={filters.username}
                onChange={(e) => updateFilter("username", e.target.value)}
                placeholder="Search by username"
              />
            </div>
            <div className="field">
              <label htmlFor="f-type">Payment Type</label>
              <select
                id="f-type"
                value={filters.paymentType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <option value="">All types</option>
                {PAYMENT_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {detailFields.length > 0 && (
            <div className="admin-filters-row">
              {detailFields.map((f) => (
                <div className="field" key={f.name}>
                  <label htmlFor={`f-${f.name}`}>{f.label}</label>
                  <input
                    id={`f-${f.name}`}
                    value={filters[f.name]}
                    onChange={(e) => updateFilter(f.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="admin-filters-actions">
            <button className="btn-primary admin-search-btn" type="submit">
              <Search size={15} />
              Apply filters
            </button>
            <button type="button" className="btn-secondary admin-clear-btn" onClick={handleClear}>
              <X size={15} />
              Clear
            </button>
          </div>
        </form>

        {error && <div className="auth-error">{error}</div>}
        {loading && <p className="dash-hint">Loading...</p>}

        {!loading && !error && (
          <>
            <p className="admin-count">{payments.length} result{payments.length === 1 ? "" : "s"}</p>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th>Details</th>
                    <th>Added</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => {
                    const config = getTypeConfig(p.paymentType);
                    return (
                      <tr key={p._id}>
                        <td>{p.user?.username || "—"}</td>
                        <td>{p.user?.email || "—"}</td>
                        <td>
                          <span className="type-tag" style={{ background: config?.color }}>
                            {p.paymentType}
                          </span>
                        </td>
                        <td>{config ? config.summary(p) : "—"}</td>
                        <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                  {payments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="admin-empty">
                        No payment records match these filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
