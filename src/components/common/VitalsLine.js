import React from "react";

/**
 * VitalsLine — the app's signature motif.
 * An animated ECG trace used as a loading indicator,
 * section divider, and ambient accent. Ties directly
 * to the "patient monitoring" subject matter.
 *
 * variant: "loader" | "divider" | "ambient"
 */
function VitalsLine({ variant = "divider", color = "var(--teal)", height = 48 }) {
  const path =
    "M0,30 L40,30 L52,30 L58,10 L66,50 L74,4 L82,30 L94,30 L106,30 L118,18 L126,42 L134,30 L400,30";

  return (
    <div
      className={`vitals-line vitals-${variant}`}
      style={{ height, "--vitals-color": color }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 400 60" preserveAspectRatio="none" width="100%" height="100%">
        <path d={path} className="vitals-trace" />
      </svg>
    </div>
  );
}

export default VitalsLine;
