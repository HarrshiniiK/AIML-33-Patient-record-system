import React, { useState } from "react";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";

const initialInvoices = [
  { id: "INV-1042", date: "2026-07-05", amount: "$84.00", status: "Paid", description: "Consultation fee" },
  { id: "INV-1043", date: "2026-07-20", amount: "$120.00", status: "Unpaid", description: "Lab work and follow-up" },
  { id: "INV-1044", date: "2026-07-28", amount: "$45.00", status: "Pending", description: "Medication refill" },
];

function BillingPage() {
  const [invoices, setInvoices] = useState(initialInvoices);

  function handlePay(invoiceId) {
    setInvoices((current) => current.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status: "Paid" } : invoice)));
  }

  function handleDownload(invoice) {
    const content = `Receipt\nInvoice: ${invoice.id}\nDate: ${invoice.date}\nAmount: ${invoice.amount}\nDescription: ${invoice.description}`;
    const blob = new Blob([content], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${invoice.id.toLowerCase()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AppLayout>
      <Topbar title="Billing" subtitle="Review invoices, pay online, and download receipts." />

      <div className="card card-pad">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td className="mono">{invoice.date}</td>
                  <td>{invoice.description}</td>
                  <td className="mono">{invoice.amount}</td>
                  <td>
                    <span className={`badge ${invoice.status === "Paid" ? "badge-teal" : invoice.status === "Pending" ? "badge-amber" : "badge-slate"}`}>{invoice.status}</span>
                  </td>
                  <td>
                    <div className="flex-gap">
                      {invoice.status !== "Paid" && (
                        <button className="btn btn-accent btn-sm" onClick={() => handlePay(invoice.id)}>
                          Pay now
                        </button>
                      )}
                      <button className="btn btn-outline btn-sm" onClick={() => handleDownload(invoice)}>
                        Download receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}

export default BillingPage;
