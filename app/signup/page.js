'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async function (e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push('/login?registered=true');
    } else {
      setError(data.message || 'Something went wrong');
    }
  };

  const handleOAuth = async function (provider) {
    setOauthLoading(provider);
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: '#111118',
    border: '1px solid var(--border)',
    color: 'var(--text)',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const oauthBtnStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    background: '#1a1a2e',
    border: '1px solid #2e2e4e',
    color: '#e8e8f0',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            Create{' '}
            <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Account
            </span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Join thousands of job seekers and companies</p>
        </div>

        <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#111118', border: '1px solid var(--border)' }}>

          {/* OAuth Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>

            {/* Google */}
            <button
              onClick={() => handleOAuth('google')}
              disabled={oauthLoading === 'google'}
              style={oauthBtnStyle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {oauthLoading === 'google' ? 'Connecting...' : 'Sign up with Google'}
            </button>

            {/* GitHub */}
            <button
              onClick={() => handleOAuth('github')}
              disabled={oauthLoading === 'github'}
              style={oauthBtnStyle}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#e8e8f0">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              {oauthLoading === 'github' ? 'Connecting...' : 'Sign up with GitHub'}
            </button>

          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ flex: 1, height: '1px', background: '#2e2e4e' }} />
            <span style={{ fontSize: '12px', color: 'var(--muted)' }}>or sign up with email</span>
            <div style={{ flex: 1, height: '1px', background: '#2e2e4e' }} />
          </div>

          {/* Role Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
            {[
              { value: 'candidate', label: 'Job Seeker', icon: '👤', desc: 'Find your dream job' },
              { value: 'company', label: 'Company', icon: '🏢', desc: 'Hire top talent' },
            ].map(function (role) {
              return (
                <button key={role.value} type="button"
                  onClick={function () { setForm({ ...form, role: role.value }); }}
                  style={{ padding: '1rem', borderRadius: '12px', border: '2px solid', borderColor: form.role === role.value ? 'var(--accent1)' : 'var(--border)', background: form.role === role.value ? '#7c3aed15' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{role.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: form.role === role.value ? 'var(--accent1)' : 'var(--text)' }}>{role.label}</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{role.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Full Name</label>
              <input type="text" value={form.name}
                onChange={function (e) { setForm({ ...form, name: e.target.value }); }}
                placeholder="John Doe" required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Email Address</label>
              <input type="email" value={form.email}
                onChange={function (e) { setForm({ ...form, email: e.target.value }); }}
                placeholder="john@example.com" required style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Password</label>
              <input type="password" value={form.password}
                onChange={function (e) { setForm({ ...form, password: e.target.value }); }}
                placeholder="Min 8 characters" required minLength={8} style={inputStyle} />
            </div>

            {error && (
              <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ef444420', border: '1px solid #ef444440', color: '#ef4444', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ padding: '14px', borderRadius: '12px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--accent1)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}