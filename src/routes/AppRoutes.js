import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";

import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";

import PatientList from "../pages/patients/PatientList";
import PatientForm from "../pages/patients/PatientForm";
import PatientDetails from "../pages/patients/PatientDetails";

import DoctorList from "../pages/doctors/DoctorList";
import AppointmentCalendar from "../pages/appointments/AppointmentCalendar";
import MedicalRecords from "../pages/records/MedicalRecords";
import ReportsPage from "../pages/reports/ReportsPage";
import SettingsPage from "../pages/settings/SettingsPage";
import UserManagement from "../pages/admin/UserManagement";

import MyAppointments from "../pages/patient/MyAppointments";
import MyRecords from "../pages/patient/MyRecords";
import PatientPortalPage from "../pages/patient/PatientPortalPage";
import BillingPage from "../pages/patient/BillingPage";
import PrescriptionsPage from "../pages/patient/PrescriptionsPage";
import NotificationsPage from "../pages/patient/NotificationsPage";

const STAFF_ROLES = ["ADMIN", "DOCTOR", "STAFF"];

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Authenticated — all roles */}
      <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Patients module — admin/doctor/staff can view; only admin/staff manage demographics */}
      <Route path="/patients" element={<ProtectedRoute allowedRoles={STAFF_ROLES}><PatientList /></ProtectedRoute>} />
      <Route path="/patients/add" element={<ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}><PatientForm /></ProtectedRoute>} />
      <Route path="/patients/edit/:id" element={<ProtectedRoute allowedRoles={["ADMIN", "STAFF"]}><PatientForm /></ProtectedRoute>} />
      <Route path="/patients/:id" element={<ProtectedRoute allowedRoles={STAFF_ROLES}><PatientDetails /></ProtectedRoute>} />

      {/* Doctors — admin only */}
      <Route path="/doctors" element={<ProtectedRoute allowedRoles={["ADMIN"]}><DoctorList /></ProtectedRoute>} />

      {/* Appointments — staff-facing */}
      <Route path="/appointments" element={<ProtectedRoute allowedRoles={STAFF_ROLES}><AppointmentCalendar /></ProtectedRoute>} />

      {/* Medical records — doctor/staff */}
      <Route path="/records" element={<ProtectedRoute allowedRoles={["ADMIN", "DOCTOR", "STAFF"]}><MedicalRecords /></ProtectedRoute>} />

      {/* Reports — admin/doctor */}
      <Route path="/reports" element={<ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}><ReportsPage /></ProtectedRoute>} />

      {/* Admin only */}
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["ADMIN"]}><UserManagement /></ProtectedRoute>} />

      {/* Patient-only self-service views */}
      <Route path="/patient-portal" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PatientPortalPage /></ProtectedRoute>} />
      <Route path="/my-appointments" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyAppointments /></ProtectedRoute>} />
      <Route path="/my-records" element={<ProtectedRoute allowedRoles={["PATIENT"]}><MyRecords /></ProtectedRoute>} />
      <Route path="/prescriptions" element={<ProtectedRoute allowedRoles={["PATIENT"]}><PrescriptionsPage /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute allowedRoles={["PATIENT"]}><BillingPage /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute allowedRoles={["PATIENT"]}><NotificationsPage /></ProtectedRoute>} />

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;
