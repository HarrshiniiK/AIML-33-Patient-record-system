import React from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";

const prescriptions = [
  {
    name: "Amlodipine",
    dosage: "5mg",
    duration: "Daily for 30 days",
    notes: "Take with food. Monitor blood pressure regularly.",
  },
  {
    name: "Atorvastatin",
    dosage: "20mg",
    duration: "Every evening for 14 days",
    notes: "Doctor's note: continue until follow-up review.",
  },
];

function PrescriptionsPage() {
  return (
    <AppLayout>
      <Topbar title="Prescriptions" subtitle="Current medication plans, dosage details, and refill requests." />

      <div className="records-list">
        {prescriptions.map((item) => (
          <div key={item.name} className="card card-pad">
            <div className="section-header">
              <h3 className="mb-0">{item.name}</h3>
              <button className="btn btn-outline btn-sm">Request refill</button>
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
    </AppLayout>
  );
}

export default PrescriptionsPage;
