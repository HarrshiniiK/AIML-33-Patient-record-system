import React from "react";

function Topbar({ title, subtitle, actions }) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar-title">{title}</h1>
        {subtitle && <p className="topbar-subtitle muted text-sm mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="flex-gap">{actions}</div>}
    </header>
  );
}

export default Topbar;
