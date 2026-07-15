import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import AppLayout from "../../components/common/AppLayout";
import Topbar from "../../components/common/Topbar";
import Loader from "../../components/common/Loader";
import StatCard from "../../components/common/StatCard";
import { getPatients } from "../../services/patientService";
import { getDoctors } from "../../services/doctorService";
import { getAppointments } from "../../services/appointmentService";

const PIE_COLORS = ["#1f7a6c", "#0f2a47", "#c98a1a", "#e4572e", "#7c8aa0"];

function ReportsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([getPatients(), getDoctors(), getAppointments()]).then(([patients, doctors, appointments]) => {
      setData({ patients, doctors, appointments });
    });
  }, []);

  if (!data) return <AppLayout><Loader label="Crunching the numbers" /></AppLayout>;

  const statusCounts = data.patients.reduce((acc, p) => {
    acc[p.status || "Unknown"] = (acc[p.status || "Unknown"] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));

  const doctorLoad = data.doctors.map((d) => ({
    name: d.name.replace("Dr. ", ""),
    patients: data.patients.filter((p) => p.assignedDoctor === d.name).length,
    appointments: data.appointments.filter((a) => a.doctorId === d.id).length,
  }));

  const diseaseCounts = data.patients.reduce((acc, p) => {
    if (!p.disease) return acc;
    acc[p.disease] = (acc[p.disease] || 0) + 1;
    return acc;
  }, {});
  const diseaseData = Object.entries(diseaseCounts).map(([name, value]) => ({ name, value }));

  return (
    <AppLayout>
      <Topbar title="Reports" subtitle="Ward activity at a glance" />

      <div className="stats-grid">
        <StatCard label="Total patients" value={data.patients.length} accent="navy" />
        <StatCard label="Active doctors" value={data.doctors.length} accent="teal" />
        <StatCard label="Total appointments" value={data.appointments.length} accent="amber" />
        <StatCard label="Distinct diagnoses" value={diseaseData.length} accent="coral" />
      </div>

      <div className="reports-grid">
        <div className="card card-pad">
          <h3>Patients by status</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((entry, i) => <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad">
          <h3>Doctor workload</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={doctorLoad}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="patients" fill="#0f2a47" radius={[4, 4, 0, 0]} name="Patients" />
              <Bar dataKey="appointments" fill="#1f7a6c" radius={[4, 4, 0, 0]} name="Appointments" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card card-pad reports-full">
          <h3>Diagnoses on record</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={diseaseData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={140} />
              <Tooltip />
              <Bar dataKey="value" fill="#c98a1a" radius={[0, 4, 4, 0]} name="Patients" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AppLayout>
  );
}

export default ReportsPage;
