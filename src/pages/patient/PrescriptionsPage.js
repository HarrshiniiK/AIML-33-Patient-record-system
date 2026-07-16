import React, { useEffect, useMemo, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";
import { createRefillRequest, getPrescriptions, getRefillRequests, updateRefillRequest } from "../../services/prescriptionService";

function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reviewingId, setReviewingId] = useState(null);
  const [decision, setDecision] = useState("Approved");
  const [reviewNotes, setReviewNotes] = useState("");

  useEffect(() => {
    if (!user?.patientId) return;
    Promise.all([getPrescriptions(user.patientId), getRefillRequests()]).then(([items, refillRequests]) => {
      setPrescriptions(items);
      setRequests(refillRequests.filter((request) => request.patientId === user.patientId));
    });
  }, [user?.patientId, submitted]);

  const canReview = user?.role === "DOCTOR" || user?.role === "STAFF";

  async function handleRequestSubmit(e) {
    e.preventDefault();
    if (!user?.patientId || !selectedMedication) return;

    await createRefillRequest({
      patientId: user.patientId,
      patientName: user.name,
      medication: selectedMedication.name,
      dosage: selectedMedication.dosage,
      requestNotes: notes,
      status: "Pending",
      createdAt: new Date().toISOString(),
      decisionNotes: "",
    });

    setNotes("");
    setSelectedMedication(null);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1800);
  }

  async function handleReviewDecision(id) {
    await updateRefillRequest(id, {
      status: decision,
      decisionNotes: reviewNotes || `${decision} by ${user?.name}`,
      reviewedBy: user?.name,
      reviewedAt: new Date().toISOString(),
    });
    setReviewingId(null);
    setDecision("Approved");
    setReviewNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1800);
  }

  const pendingRequests = useMemo(() => requests.filter((request) => request.status === "Pending"), [requests]);

  return (
    <AppLayout>
      <Topbar title="Prescriptions" subtitle="Current medication plans, refill requests, and care-team review." />

      <div className="records-list">
        {prescriptions.map((item) => (
          <div key={item.id} className="card card-pad">
            <div className="section-header">
              <h3 className="mb-0">{item.name}</h3>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedMedication(item)}
                disabled={!user?.patientId}
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
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Mention how long you have left, symptoms, and any concerns." />
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
                      <div className="muted text-sm">{request.patientName} · {request.dosage}</div>
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
                      <button className="btn btn-outline btn-sm" onClick={() => { setReviewingId(request.id); setDecision("Book appointment"); }}>Request appointment</button>
                    </div>
                  ) : null}

                  {reviewingId === request.id && (
                    <div style={{ marginTop: "var(--space-3)" }}>
                      <div className="field">
                        <label>Decision</label>
                        <select value={decision} onChange={(e) => setDecision(e.target.value)}>
                          <option value="Approved">Approve refill</option>
                          <option value="Needs review">Needs review</option>
                          <option value="Book appointment">Book appointment</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>Care-team notes</label>
                        <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={3} placeholder="Add instructions, follow-up plan, or appointment recommendation." />
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
