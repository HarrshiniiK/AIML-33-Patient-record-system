import React from "react";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="app-content">
        <div className="app-content-inner">{children}</div>
      </main>
    </div>
  );
}

export default AppLayout;
