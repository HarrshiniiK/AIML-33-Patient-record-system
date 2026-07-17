import React, { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import { useAuth } from "../../context/AuthContext";
import { createRefillRequest, getPrescriptions, getRefillRequests, updateRefillRequest } from "../../services/prescriptionService";
import { createNotification } from "../../services/notificationService";

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

  // State for editing prescription details (doctor side)
  const [editName, setEditName] = useState("");
  const [editDosage, setEditDosage] = useState("");
  const [editDuration, setEditDuration] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const formRef = useRef(null);
  const textareaRef = useRef(null);

  const canReview = user?.role === "DOCTOR" || user?.role === "STAFF";

  useEffect(() => {
    if (canReview) {
      getRefillRequests().then((refillRequests) => {
        setRequests(refillRequests);
      }).catch((err) => console.error("Error fetching refill requests:", err));
    } else if (user?.patientId) {
      Promise.all([
        getPrescriptions(user.patientId),
        getRefillRequests(user.patientId)
      ]).then(([items, refillRequests]) => {
        setPrescriptions(items);
        setRequests(refillRequests);
      }).catch((err) => console.error("Error fetching patient data:", err));
    }
  }, [user, submitted, canReview]);

  // Load prescription details when reviewingId changes (for doctor to edit)
  useEffect(() => {
    if (reviewingId) {
      const req = requests.find((r) => r.id === reviewingId);
      if (req && req.prescriptionId) {
        getPrescriptions(req.patientId).then((list) => {
          const found = list.find((p) => p.id === req.prescriptionId);
          if (found) {
            setEditName(found.name || "");
            setEditDosage(found.dosage || "");
            setEditDuration(found.duration || "30 days");
            setEditNotes(found.notes || "");
          } else {
            setEditName(req.medication || "");
            setEditDosage(req.dosage || "");
            setEditDuration("30 days");
            setEditNotes("");
          }
        }).catch(() => {
          setEditName(req.medication || "");
          setEditDosage(req.dosage || "");
          setEditDuration("30 days");
          setEditNotes("");
        });
      } else if (req) {
        setEditName(req.medication || "");
        setEditDosage(req.dosage || "");
        setEditDuration("30 days");
        setEditNotes("");
      }
    }
  }, [reviewingId, requests]);

  useEffect(() => {
    if (selectedMedication && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [selectedMedication]);

  async function handleRequestSubmit(e) {
    e.preventDefault();
    if (!user?.patientId || !selectedMedication) return;

    await createRefillRequest({
      prescriptionId: selectedMedication.id,
      patientId: user.patientId,
      patientName: user.name,
      medication: selectedMedication.name,
      dosage: selectedMedication.dosage,
      requestNotes: notes,
      status: "PENDING",
      createdAt: new Date().toISOString(),
      decisionNotes: "",
      patientMessage: notes,
    });

    await createNotification({
      targetRoles: ["DOCTOR", "STAFF"],
      title: "New refill request",
      message: `New refill request received from ${user.name}.`,
      path: "/prescriptions",
      tone: "amber"
    });

    await createNotification({
      targetUserId: user.patientId,
      title: "Refill requested",
      message: `Your refill request for ${selectedMedication.name} has been sent to the care team.`,
      path: "/prescriptions",
      tone: "teal"
    });

    setNotes("");
    setSelectedMedication(null);
    setSubmitted(true);
    window.alert("Refill request has been sent to your doctor and hospital staff.");
    setTimeout(() => setSubmitted(false), 1800);
  }

  function handleCancelRefill() {
    setNotes("");
    setSelectedMedication(null);
  }

  async function handleReviewDecision(id) {
    const request = requests.find((r) => r.id === id);
    const finalNotes = reviewNotes || `${decision} by ${user?.name}`;

    const updates = {
      status: decision,
      decisionNotes: finalNotes,
      reviewedBy: user?.name,
      reviewedAt: new Date().toISOString(),
    };

    if (user.role === "DOCTOR" && decision === "Approved") {
      updates.status = "APPROVED";
      updates.medication = editName;
      updates.dosage = editDosage;
      updates.duration = editDuration;
      updates.doctorMessage = editNotes;
    }

    await updateRefillRequest(id, updates);

    let notificationTitle = "Refill update";
    let notificationTone = "teal";
    let notificationMessage = `Your refill request for ${request?.medication} was updated.`;

    if (updates.status === "APPROVED" || updates.status === "Approved") {
      notificationTitle = "Refill approved";
      notificationTone = "teal";
      notificationMessage = `Doctor ${user?.name} approved your refill for ${request?.medication}.`;
    } else if (decision === "Book appointment") {
      notificationTitle = "Appointment required";
      notificationTone = "amber";
      notificationMessage = `Doctor ${user?.name} wants you to make an appointment before refilling ${request?.medication}.`;
    }

    if (request?.patientId) {
      await createNotification({
        targetUserId: request.patientId,
        title: notificationTitle,
        message: notificationMessage,
        path: decision === "Book appointment" ? "/my-appointments" : "/prescriptions",
        tone: notificationTone
      });
    }

    if (user.role === "DOCTOR" && decision === "Approved") {
      window.alert("Prescription updated successfully. Notifications have been sent to the patient and staff.");
    } else {
      window.alert("Decision saved successfully!");
    }

    setReviewingId(null);
    setDecision("Approved");
    setReviewNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 1800);
  }

  const pendingRequests = useMemo(() => requests.filter((request) => request.status?.toUpperCase() === "PENDING"), [requests]);

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
        <div ref={formRef} className="card card-pad" style={{ marginTop: "var(--space-4)" }}>
          <h3 style={{ marginTop: 0 }}>Request refill for {selectedMedication.name}</h3>
          <p className="muted mb-0">Your request will be routed to the care team for review.</p>
          <form onSubmit={handleRequestSubmit} style={{ marginTop: "var(--space-3)" }}>
            <div className="field">
              <label>Describe your request</label>
              <textarea ref={textareaRef} value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Mention how long you have left, symptoms, and any concerns." />
            </div>
            <div className="flex-gap" style={{ display: "flex", gap: "var(--space-2)" }}>
              <button type="submit" className="btn btn-primary btn-sm">Send refill request</button>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleCancelRefill}>Cancel Refill</button>
              {submitted && <span className="badge badge-teal" style={{ alignSelf: "center" }}>Request sent</span>}
            </div>
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
                    <span className={`badge ${request.status?.toUpperCase() === "PENDING" ? "badge-amber" : request.status?.toUpperCase() === "APPROVED" ? "badge-teal" : "badge-slate"}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm mb-0">{request.requestNotes || request.patientMessage || "No additional notes provided."}</p>
                  {request.decisionNotes && <p className="muted text-sm mb-0" style={{ marginTop: 6 }}>{request.decisionNotes}</p>}
                  {request.status?.toUpperCase() === "PENDING" && reviewingId !== request.id ? (
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

                      {user.role === "DOCTOR" && decision === "Approved" && (
                        <div style={{ border: "1px solid var(--accent)", padding: "1rem", borderRadius: "8px", margin: "1rem 0" }}>
                          <h4 style={{ marginTop: 0 }}>Edit Prescription Details</h4>
                          <div className="field">
                            <label>Medication Name</label>
                            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} required />
                          </div>
                          <div className="field">
                            <label>Dosage</label>
                            <input type="text" value={editDosage} onChange={(e) => setEditDosage(e.target.value)} required />
                          </div>
                          <div className="field">
                            <label>Duration</label>
                            <input type="text" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} required />
                          </div>
                          <div className="field">
                            <label>Doctor's Note</label>
                            <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} rows={2} />
                          </div>
                        </div>
                      )}

                      <div className="field">
                        <label>Care-team notes</label>
                        <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={3} placeholder="Add instructions, follow-up plan, or appointment recommendation." />
                      </div>
                      <div className="flex-gap">
                        <button className="btn btn-primary btn-sm" onClick={() => handleReviewDecision(request.id)}>
                          {user.role === "DOCTOR" && decision === "Approved" ? "Approve & Update Prescription" : "Save decision"}
                        </button>
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
