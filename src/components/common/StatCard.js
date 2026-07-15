import React from "react";

function StatCard({ label, value, hint, accent = "navy" }) {
  return (
    <div className="card card-pad stat-card">
      <div className={`stat-accent stat-accent-${accent}`} />
      <div className="stat-value mono">{value}</div>
      <div className="stat-label">{label}</div>
      {hint && <div className="stat-hint muted text-sm">{hint}</div>}
    </div>
  );
}

export default StatCard;
