'use client';

import { useState } from 'react';

const contactInfo = [
  { icon: '✉️', label: 'Email', value: 'support@chakrikhujhi.com', href: 'mailto:support@chakrikhujhi.com', color: '#8b5cf6' },
  { icon: '📍', label: 'Location', value: 'Dhaka, Bangladesh', href: '#', color: '#22d3ee' },
  { icon: '🕐', label: 'Support Hours', value: 'Sat - Thu, 9AM - 6PM', href: '#', color: '#fbbf24' },
];

const faqs = [
  { q: 'How do I post a job?', a: 'Sign up as a Company, go to your dashboard, and click "Post New Job". Fill in the details and your job will be live instantly.' },
  { q: 'Is Chakri Khujhi free to use?', a: 'Yes! Job seekers can browse and apply for free. Companies can post jobs and manage applications for free as well.' },
  { q: 'How do I apply for a job?', a: 'Create a Candidate account, browse jobs, click on any job, and hit the "Apply Now" button. Write a cover letter and submit!' },
  { q: 'Can I upload my resume?', a: 'Yes! Go to your Candidate dashboard, click the Profile tab, and upload your resume in PDF or DOC format.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(function(r) { setTimeout(r, 1500); });
    setSuccess(true);
    setLoading(false);
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: '#1a1a2e',
    border: '1px solid #2e2e4e',
    color: '#e8e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 700,
    color: '#a0a0c8',
    display: 'block',
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <div style={{ minHeight: '100vh', paddingTop: '5rem' }}>

      {/* Hero */}
      <section style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#0d0d18', borderBottom: '1px solid #2e2e4e' }}>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, marginBottom: '1.5rem', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa' }}>
            💬 Get In Touch
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem', color: '#f0f0ff' }}>
            We Would Love to{' '}
            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hear From You</span>
          </h1>
          <p style={{ fontSize: '1rem', color: '#8080a8', lineHeight: 1.8 }}>
            Have a question, suggestion, or need help? Our team is here to assist you.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gap: '2rem' }} className="lg:grid-cols-[320px_1fr]">

          {/* Left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {contactInfo.map(function(item) {
              return (
                <a key={item.label} href={item.href}
                  style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e', textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'center', transition: 'border-color 0.2s' }}
                  onMouseEnter={function(e) { e.currentTarget.style.borderColor = item.color; }}
                  onMouseLeave={function(e) { e.currentTarget.style.borderColor = '#2e2e4e'; }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: item.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, border: '1px solid ' + item.color + '40' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6060a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0f8' }}>{item.value}</div>
                  </div>
                </a>
              );
            })}

            {/* Social */}
            <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}>
              <div style={{ fontSize: '12px', color: '#6060a0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>Follow Us</div>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[
                  { icon: '🐦', label: 'Twitter' },
                  { icon: '💼', label: 'LinkedIn' },
                  { icon: '📘', label: 'Facebook' },
                ].map(function(s) {
                  return (
                    <button key={s.label}
                      style={{ padding: '10px 14px', borderRadius: '10px', background: '#1e1e3a', border: '1px solid #2e2e4e', color: '#a0a0c8', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {s.icon} {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e' }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, color: '#34d399', fontSize: '1.5rem', marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: '#8080a8' }}>We will get back to you within 24 hours.</p>
                <button onClick={function() { setSuccess(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  style={{ marginTop: '1.5rem', padding: '10px 24px', borderRadius: '10px', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa', cursor: 'pointer', fontWeight: 600 }}>
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1.2rem' }}>Send a Message</h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-2">
                    <div>
                      <label style={labelStyle}>Your Name</label>
                      <input type="text" value={form.name} onChange={function(e) { setForm({ ...form, name: e.target.value }); }} placeholder="John Doe" required style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email Address</label>
                      <input type="email" value={form.email} onChange={function(e) { setForm({ ...form, email: e.target.value }); }} placeholder="john@example.com" required style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Subject</label>
                    <select value={form.subject} onChange={function(e) { setForm({ ...form, subject: e.target.value }); }} required style={inputStyle}>
                      <option value="">Select a topic</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing</option>
                      <option value="partnership">Partnership</option>
                      <option value="report">Report an Issue</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Message</label>
                    <textarea value={form.message} onChange={function(e) { setForm({ ...form, message: e.target.value }); }} placeholder="Tell us how we can help you..." rows={5} required style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                  <button type="submit" disabled={loading}
                    style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Sending...' : 'Send Message →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '4rem 1.5rem', background: '#0d0d18' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: '0.75rem' }}>FAQ</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff' }}>
              Frequently Asked{' '}
              <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Questions</span>
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map(function(faq, i) {
              return (
                <div key={i} style={{ borderRadius: '16px', background: '#13131f', border: '1px solid', borderColor: openFaq === i ? '#8b5cf6' : '#2e2e4e', overflow: 'hidden', transition: 'border-color 0.2s' }}>
                  <button onClick={function() { setOpenFaq(openFaq === i ? null : i); }}
                    style={{ width: '100%', padding: '1.25rem 1.5rem', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '1rem' }}>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f0f0ff', fontSize: '15px' }}>{faq.q}</span>
                    <span style={{ color: '#8b5cf6', fontSize: '1.2rem', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s' }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: '0 1.5rem 1.25rem' }}>
                      <p style={{ fontSize: '14px', color: '#8080a8', lineHeight: 1.75 }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}