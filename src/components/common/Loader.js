import React from "react";
import VitalsLine from "./VitalsLine";

function Loader({ label = "Loading" }) {
  return (
    <div className="loader-wrap">
      <VitalsLine variant="loader" height={40} />
      <span className="muted text-sm">{label}…</span>
    </div>
  );
}

export default Loader;
