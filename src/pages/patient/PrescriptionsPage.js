import React, { useMemo, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";

const initialPrescriptions = [
  {
    id: 1,
    name: "Amlodipine",
    dosage: "5 mg",
    duration: "Daily for 30 days",
    notes: "Take with food and monitor blood pressure.",
    patient: "Daniel Osei",
    status: "Active",
  },
  {
    id: 2,
    name: "Metformin XR",
    dosage: "500 mg",
    duration: "Every evening for 14 days",
    notes: "Continue until follow-up review.",
    patient: "Jane Smith",
    status: "Pending review",
  },
];

const initialRequests = [
  {
    id: 101,
    patientName: "Daniel Osei",
    medication: "Amlodipine",
    dosage: "5 mg",
    requestNotes: "I have one week left and would like a refill.",
    status: "Pending",
  },
];

function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions] = useState(initialPrescriptions);
  const [requests, setRequests] = useState(initialRequests);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [decision, setDecision] = useState("Approved");
  const [reviewNotes, setReviewNotes] = useState("");

  const canReview = user?.role === "DOCTOR" || user?.role === "STAFF" || user?.role === "ADMIN";
  const pendingRequests = useMemo(() => requests.filter((request) => request.status === "Pending"), [requests]);

  function handleRequestSubmit(event) {
    event.preventDefault();
    if (!selectedMedication) return;

    const newRequest = {
      id: Date.now(),
      patientName: user?.name || "Patient",
      medication: selectedMedication.name,
      dosage: selectedMedication.dosage,
      requestNotes: notes || "No additional notes provided.",
      status: "Pending",
    };

    setRequests((current) => [newRequest, ...current]);
    setNotes("");
    setSelectedMedication(null);
    setSubmitted(true);
    window.alert("Refill request sent successfully.");
    setTimeout(() => setSubmitted(false), 1800);
  }

  function handleReviewDecision(id) {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: decision,
              decisionNotes: reviewNotes || `${decision} by ${user?.name}`,
            }
          : request
      )
    );
    setReviewingId(null);
    setDecision("Approved");
    setReviewNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1800);
  }

  return (
    <AppLayout>
      <Topbar title="Prescriptions" subtitle="Create prescriptions, review refill requests, and track medication plans." />

      {canReview && (
        <div className="card card-pad" style={{ marginBottom: "var(--space-4)" }}>
          <div className="section-header">
            <h3 className="mb-0">Create new prescription</h3>
            <button className="btn btn-outline btn-sm">Add prescription</button>
          </div>
          <div className="doctor-portal-search-row">
            <select className="search-input" defaultValue="">
              <option value="" disabled>Select patient</option>
              <option value="daniel">Daniel Osei</option>
              <option value="jane">Jane Smith</option>
              <option value="amara">Amara Diallo</option>
            </select>
            <input className="search-input" placeholder="Medication" defaultValue="" />
            <input className="search-input" placeholder="Dosage" defaultValue="" />
            <input className="search-input" placeholder="Duration" defaultValue="" />
          </div>
        </div>
      )}

      <div className="records-list">
        {prescriptions.map((item) => (
          <div key={item.id} className="card card-pad">
            <div className="section-header">
              <div>
                <h3 className="mb-0">{item.name}</h3>
                <div className="muted text-sm">{item.patient}</div>
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedMedication(item)}
                disabled={!user?.patientId && user?.role !== "PATIENT"}
              >
                Request refill
              </button>
            </div>
            <div className="detail-list">
              <div>
                <dt>Dosage</dt>
                <dd>{item.dosage}</dd>
              </div>
              <div>
                <dt>Duration</dt>
                <dd>{item.duration}</dd>
              </div>
              <div>
                <dt>Doctor's note</dt>
                <dd>{item.notes}</dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedMedication && (
        <div className="card card-pad" style={{ marginTop: "var(--space-4)" }}>
          <h3 style={{ marginTop: 0 }}>Request refill for {selectedMedication.name}</h3>
          <p className="muted mb-0">Your request will be routed to the care team for review.</p>
          <form onSubmit={handleRequestSubmit} style={{ marginTop: "var(--space-3)" }}>
            <div className="field">
              <label>Describe your request</label>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} placeholder="Mention how long you have left, symptoms, and any concerns." />
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Send refill request</button>
            {submitted && <span className="badge badge-teal" style={{ marginLeft: 8 }}>Request sent</span>}
          </form>
        </div>
      )}

      {canReview && (
        <div className="card card-pad" style={{ marginTop: "var(--space-4)" }}>
          <div className="section-header">
            <h3 className="mb-0">Refill review queue</h3>
            <span className="badge badge-amber">{pendingRequests.length} pending</span>
          </div>
          {requests.length === 0 ? (
            <p className="muted mb-0">No refill requests yet.</p>
          ) : (
            <div className="records-list">
              {requests.map((request) => (
                <div key={request.id} className="card card-pad" style={{ marginBottom: "var(--space-3)" }}>
                  <div className="section-header">
                    <div>
                      <strong>{request.medication}</strong>
                      <div className="muted text-sm">{request.patientName} • {request.dosage}</div>
                    </div>
                    <span className={`badge ${request.status === "Pending" ? "badge-amber" : request.status === "Approved" ? "badge-teal" : "badge-slate"}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm mb-0">{request.requestNotes || "No additional notes provided."}</p>
                  {request.decisionNotes && <p className="muted text-sm mb-0" style={{ marginTop: 6 }}>{request.decisionNotes}</p>}
                  {request.status === "Pending" && reviewingId !== request.id ? (
                    <div className="flex-gap" style={{ marginTop: "var(--space-3)" }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setReviewingId(request.id)}>Review request</button>
                      <button className="btn btn-outline btn-sm" onClick={() => {
                        setReviewingId(request.id);
                        setDecision("Book appointment");
                      }}>Request appointment</button>
                    </div>
                  ) : null}

                  {reviewingId === request.id && (
                    <div style={{ marginTop: "var(--space-3)" }}>
                      <div className="field">
                        <label>Decision</label>
                        <select value={decision} onChange={(event) => setDecision(event.target.value)}>
                          <option value="Approved">Approve refill</option>
                          <option value="Needs review">Needs review</option>
                          <option value="Book appointment">Book appointment</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Care-team notes</label>
                        <textarea value={reviewNotes} onChange={(event) => setReviewNotes(event.target.value)} rows={3} placeholder="Add instructions, follow-up plan, or appointment recommendation." />
                      </div>
                      <div className="flex-gap">
                        <button className="btn btn-primary btn-sm" onClick={() => handleReviewDecision(request.id)}>Save decision</button>
                        <button className="btn btn-outline btn-sm" onClick={() => setReviewingId(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

export default PrescriptionsPage;
