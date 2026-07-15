import React from "react";
import { Link } from "react-router-dom";
import VitalsLine from "../components/common/VitalsLine";

function NotFoundPage() {
  return (
    <div className="notfound-page">
      <VitalsLine variant="divider" height={40} />
      <h1>404</h1>
      <p className="muted">This page went flatline — it doesn't exist, or you don't have access.</p>
      <Link to="/" className="btn btn-primary">Back to safety</Link>
    </div>
  );
}

export default NotFoundPage;
