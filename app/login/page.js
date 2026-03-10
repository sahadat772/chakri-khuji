'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async function (e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        const res = await signIn('credentials', {
            email: form.email,
            password: form.password,
            redirect: false,
        });
        setLoading(false);
        if (res?.ok) {
            router.push('/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

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

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ width: '100%', maxWidth: '420px' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
                        Welcome <span style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Back</span>
                    </h1>
                    <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Sign in to your account</p>
                </div>

                <div style={{ padding: '2rem', borderRadius: '1.5rem', background: '#111118', border: '1px solid var(--border)' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Email Address</label>
                            <input type="email" value={form.email} onChange={function (e) { setForm({ ...form, email: e.target.value }); }} placeholder="john@example.com" required style={inputStyle} />
                        </div>
                        <div>
                            <label style={{ fontSize: '12px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>Password</label>
                            <input type="password" value={form.password} onChange={function (e) { setForm({ ...form, password: e.target.value }); }} placeholder="••••••••" required style={inputStyle} />
                        </div>

                        {error && (
                            <div style={{ padding: '12px 16px', borderRadius: '12px', background: '#ef444420', border: '1px solid #ef444440', color: '#ef4444', fontSize: '14px' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={loading} style={{ padding: '14px', borderRadius: '12px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '15px', opacity: loading ? 0.7 : 1, marginTop: '0.5rem' }}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--muted)' }}>
                        Don not have an account?{' '}
                        <Link href="/signup" style={{ color: 'var(--accent1)', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
                    </p>
                </div>

            </div>
        </div>
    );
}