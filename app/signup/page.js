'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
    const [loading, setLoading] = useState(false);
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

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '480px' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                        Create <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Account</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Join thousands of job seekers and companies</p>
                </div>

                <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#111118', border: '1px solid var(--border)' }}>

                    {/* Role Selection */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '1.5rem' }}>
                        {[
                            { value: 'candidate', label: 'Job Seeker', icon: '👤', desc: 'Find your dream job' },
                            { value: 'company', label: 'Company', icon: '🏢', desc: 'Hire top talent' },
                        ].map(function (role) {
                            return (
                                <button key={role.value} type="button" onClick={function () { setForm({ ...form, role: role.value }); }}
                                    style={{ padding: '1rem', borderRadius: '12px', border: '2px solid', borderColor: form.role === role.value ? 'var(--accent1)' : 'var(--border)', background: form.role === role.value ? '#7c3aed15' : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
                                    <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>{role.icon}</div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: form.role === role.value ? 'var(--accent1)' : 'var(--text)' }}>{role.label}</div>
                                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '2px' }}>{role.desc}</div>
                                </button>
                            );
                        })}
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Full Name</label>
                            <input type="text" value={form.name} onChange={function (e) { setForm({ ...form, name: e.target.value }); }} placeholder="John Doe" required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <input type="email" value={form.email} onChange={function (e) { setForm({ ...form, email: e.target.value }); }} placeholder="john@example.com" required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Password</label>
                            <input type="password" value={form.password} onChange={function (e) { setForm({ ...form, password: e.target.value }); }} placeholder="Min 8 characters" required minLength={8} style={inputStyle} />
                        </div>

                        {error && (
                            <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ef444420', border: '1px solid #ef444440', color: '#ef4444', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '12px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--muted)' }}>
                        Already have an account?{' '}
                        <Link href="/login" style={{ color: 'var(--accent1)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}