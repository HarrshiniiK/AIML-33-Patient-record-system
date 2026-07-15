import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import VitalsLine from "../components/common/VitalsLine";

/* ───────── Data ───────── */

const FEATURES = [
  {
    title: "Unified patient records",
    body: "Every chart, prescription, and lab result in one place — searchable, current, and never duplicated across departments.",
    icon: "M9 12h6M12 9v6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z",
  },
  {
    title: "Role-aware access",
    body: "Admins, doctors, staff, and patients each see exactly what their role needs — nothing more, nothing hidden that they need.",
    icon: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z",
  },
  {
    title: "Appointment coordination",
    body: "Doctors and staff share one live calendar, so double-bookings and missed follow-ups stop happening.",
    icon: "M4 7h16M6 4v3M18 4v3M5 7h14v13H5zM5 11h14",
  },
  {
    title: "Reporting at a glance",
    body: "Admission trends, case-mix, and doctor workload rendered as charts your team will actually read.",
    icon: "M4 20V10M11 20V4M18 20v-7",
  },
];

const STATS = [
  { label: "Patients managed", value: 12400, suffix: "+" },
  { label: "Doctors onboard", value: 350, suffix: "+" },
  { label: "Appointments scheduled", value: 48000, suffix: "+" },
  { label: "System uptime", value: 99.9, suffix: "%", decimal: true },
];

const STEPS = [
  {
    num: "01",
    title: "Create your account",
    body: "Sign up in seconds — patients register themselves, staff are onboarded by an admin.",
    icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-4 3.5-6 8-6s8 2 8 6",
  },
  {
    num: "02",
    title: "Book or manage appointments",
    body: "Pick a doctor, choose a time slot, and get instant confirmation — all from one calendar view.",
    icon: "M4 7h16M6 4v3M18 4v3M5 7h14v13H5zM5 11h14",
  },
  {
    num: "03",
    title: "Access records anywhere",
    body: "View prescriptions, lab results, and visit history from any device — everything stays in sync.",
    icon: "M6 3h8l4 4v14H6zM14 3v4h4",
  },
];

const TESTIMONIALS = [
  {
    quote: "Vitalis has transformed how we manage patient charts. We cut duplicate entries by 80% in the first month.",
    name: "Dr. Ananya Sharma",
    role: "Senior Physician",
    avatar: "A",
  },
  {
    quote: "I can view my appointments and records without calling the hospital. It's simple and actually works.",
    name: "Rajan Mehra",
    role: "Patient",
    avatar: "R",
  },
  {
    quote: "User management is a breeze. Onboarding new staff takes minutes instead of days.",
    name: "Priya Nair",
    role: "Hospital Admin",
    avatar: "P",
  },
];

const TRUST_ITEMS = [
  { icon: "M12 3l7 3v6c0 5-3.5 8-7 9-3.5-1-7-4-7-9V6z", label: "Role-based access control" },
  { icon: "M4 6h16M4 12h16M4 18h16", label: "Encrypted data at rest" },
  { icon: "M9 12l2 2 4-4M12 3a9 9 0 110 18 9 9 0 010-18z", label: "HIPAA-ready architecture" },
  { icon: "M12 8v4l3 3M12 3a9 9 0 110 18 9 9 0 010-18z", label: "99.9% uptime SLA" },
];

/* ───────── Hooks ───────── */

function useCountUp(target, duration = 2000, start = false, decimal = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime = null;
    let raf;

    function step(ts) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      setValue(decimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start, decimal]);

  return value;
}

function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

/* ───────── Sub-components ───────── */

function FeatureIcon({ d }) {
  return (
    <div className="feature-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d={d} />
      </svg>
    </div>
  );
}

function StatCounter({ stat, animate }) {
  const val = useCountUp(stat.value, 2200, animate, stat.decimal);
  return (
    <div className="landing-stat-item">
      <div className="landing-stat-value mono">
        {stat.decimal ? val.toFixed(1) : val.toLocaleString()}{stat.suffix}
      </div>
      <div className="landing-stat-label">{stat.label}</div>
    </div>
  );
}

/* ───────── Main ───────── */

function LandingPage() {
  const [statsRef, statsInView] = useInView(0.3);
  const [stepsRef, stepsInView] = useInView(0.2);
  const [testimonialsRef, testimonialsInView] = useInView(0.2);
  const [trustRef, trustInView] = useInView(0.2);

  /* Testimonial rotation */
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="landing">
      {/* ── Nav ── */}
      <header className="landing-nav">
        <div className="brand-mark-lg">V</div>
        <span className="landing-brand">Vitalis</span>
        <nav className="landing-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <Link to="/login">Log in</Link>
          <Link to="/register" className="btn btn-accent btn-sm">Get started</Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="eyebrow">Patient record system</span>
          <h1>
            One record, <em>read correctly</em>,
            <br />every time.
          </h1>
          <p className="landing-lede">
            Vitalis brings patients, doctors, and staff onto a single chart so nothing gets
            re-entered, re-explained, or missed at handoff.
          </p>
          <div className="flex-gap">
            <Link to="/register" className="btn btn-primary">Create an account</Link>
            <Link to="/login" className="btn btn-outline">Sign in</Link>
          </div>
          <div className="landing-demo-hint muted text-sm">
            No setup needed — demo accounts are pre-loaded on the login page.
          </div>
        </div>
        <div className="landing-hero-visual">
          <VitalsLine variant="loader" height={64} />
          <div className="landing-hero-card card card-pad">
            <div className="flex-between">
              <span className="text-sm muted">Live monitor</span>
              <span className="badge badge-teal">Stable</span>
            </div>
            <div className="landing-hero-stat mono">72 <span className="muted text-sm">bpm</span></div>
          </div>
        </div>
      </section>

      <VitalsLine variant="divider" height={32} />

      {/* ── Stats Counter ── */}
      <section className={`landing-stats fade-section ${statsInView ? "visible" : ""}`} ref={statsRef}>
        <h2 className="landing-section-title">Trusted by numbers</h2>
        <p className="landing-section-sub muted">Real-world impact across hospitals and clinics</p>
        <div className="landing-stats-grid">
          {STATS.map((stat) => (
            <StatCounter key={stat.label} stat={stat} animate={statsInView} />
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="landing-features" id="features">
        <h2>Built around how a ward actually runs</h2>
        <div className="landing-features-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card card-pad feature-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <FeatureIcon d={f.icon} />
              <h3>{f.title}</h3>
              <p className="muted mb-0">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        className={`landing-steps fade-section ${stepsInView ? "visible" : ""}`}
        id="how-it-works"
        ref={stepsRef}
      >
        <h2 className="landing-section-title">How it works</h2>
        <p className="landing-section-sub muted">Get started in three simple steps</p>
        <div className="landing-steps-grid">
          {STEPS.map((s, i) => (
            <div key={s.num} className="step-card" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className="step-num">{s.num}</div>
              <div className="step-icon-wrap">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d={s.icon} />
                </svg>
              </div>
              <h3>{s.title}</h3>
              <p className="muted mb-0">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        className={`landing-testimonials fade-section ${testimonialsInView ? "visible" : ""}`}
        ref={testimonialsRef}
      >
        <h2 className="landing-section-title">What people say</h2>
        <p className="landing-section-sub muted">Voices from doctors, patients, and administrators</p>
        <div className="testimonials-carousel">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className={`testimonial-card card card-pad ${i === activeTestimonial ? "active" : ""}`}
            >
              <div className="testimonial-quote">&ldquo;{t.quote}&rdquo;</div>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role muted text-sm">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="testimonial-dots">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === activeTestimonial ? "active" : ""}`}
              onClick={() => setActiveTestimonial(i)}
              aria-label={`Show testimonial ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Trust / Security ── */}
      <section className={`landing-trust fade-section ${trustInView ? "visible" : ""}`} ref={trustRef}>
        <div className="landing-trust-inner">
          <h2 className="landing-section-title">Enterprise-grade security</h2>
          <p className="landing-section-sub muted">Your data is protected at every layer</p>
          <div className="trust-grid">
            {TRUST_ITEMS.map((t) => (
              <div key={t.label} className="trust-item">
                <div className="trust-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d={t.icon} />
                  </svg>
                </div>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="landing-cta card card-pad">
        <div>
          <h2>Ready to see it running?</h2>
          <p className="muted mb-0">Log in with a demo role — admin, doctor, staff, or patient — in under a minute.</p>
        </div>
        <Link to="/login" className="btn btn-accent">Go to login</Link>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer-full">
        <div className="footer-grid">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <div className="brand-mark-lg">V</div>
              <span className="landing-brand">Vitalis</span>
            </div>
            <p className="muted text-sm">
              A modern patient record system built for clarity, speed, and collaboration across healthcare teams.
            </p>
          </div>
          <div className="footer-link-col">
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <Link to="/login">Sign in</Link>
            <Link to="/register">Register</Link>
          </div>
          <div className="footer-link-col">
            <h4>Resources</h4>
            <span className="muted text-sm">Documentation</span>
            <span className="muted text-sm">API Reference</span>
            <span className="muted text-sm">Release Notes</span>
          </div>
          <div className="footer-link-col">
            <h4>Company</h4>
            <span className="muted text-sm">About</span>
            <span className="muted text-sm">Contact</span>
            <span className="muted text-sm">Privacy Policy</span>
          </div>
        </div>
        <div className="footer-bottom muted text-sm">
          <span>© {new Date().getFullYear()} Vitalis — a demo patient record system. No real patient data.</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
