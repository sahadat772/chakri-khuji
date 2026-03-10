'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const categories = ['tech', 'design', 'marketing', 'sales', 'finance', 'hr', 'other'];
const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
const locationTypes = ['onsite', 'remote', 'hybrid'];

export default function PostJobPage() {
    const router = useRouter();
    const { data: session } = useSession();

    const [form, setForm] = useState({
        title: '',
        description: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        location: '',
        locationType: 'onsite',
        jobType: 'full-time',
        category: 'tech',
        salaryMin: '',
        salaryMax: '',
        isNegotiable: false,
        skills: '',
        experience: '0-2 years',
        education: 'Bachelor',
        vacancies: 1,
        deadline: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

    async function handleSubmit(e) {
        e.preventDefault();
        if (!session) { router.push('/login'); return; }
        if (session.user.role !== 'company') { setError('Only companies can post jobs'); return; }

        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    description: form.description,
                    requirements: form.requirements,
                    responsibilities: form.responsibilities,
                    benefits: form.benefits,
                    location: form.location,
                    locationType: form.locationType,
                    jobType: form.jobType,
                    category: form.category,
                    salary: {
                        min: parseInt(form.salaryMin),
                        max: parseInt(form.salaryMax),
                        currency: 'BDT',
                        isNegotiable: form.isNegotiable,
                    },
                    skills: form.skills.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
                    experience: form.experience,
                    education: form.education,
                    vacancies: parseInt(form.vacancies),
                    deadline: new Date(form.deadline),
                    company: session.user.id,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setSuccess(true);
                setTimeout(function () { router.push('/dashboard/company'); }, 2000);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
        setLoading(false);
    }

    function update(field, value) {
        setForm(function (prev) { return { ...prev, [field]: value }; });
    }

    if (success) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '4rem' }}>🎉</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, color: '#f0f0ff', fontSize: '1.5rem' }}>Job Posted Successfully!</h2>
                <p style={{ color: '#8080a8' }}>Redirecting to dashboard...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem 1.5rem' }}>
            <div style={{ maxWidth: '56rem', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/dashboard/company" style={{ fontSize: '13px', color: '#8080a8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1rem' }}>
                        ← Back to Dashboard
                    </Link>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#f0f0ff' }}>
                        Post a{' '}
                        <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>New Job</span>
                    </h1>
                    <p style={{ color: '#8080a8', fontSize: '14px', marginTop: '4px' }}>Fill in the details to attract the best candidates</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Basic Info */}
                    <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#8b5cf620', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📋</span>
                            Basic Information
                        </h2>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>Job Title *</label>
                                <input type="text" value={form.title} onChange={function (e) { update('title', e.target.value); }} placeholder="e.g. Senior React Developer" required style={inputStyle} />
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-3">
                                <div>
                                    <label style={labelStyle}>Category *</label>
                                    <select value={form.category} onChange={function (e) { update('category', e.target.value); }} style={inputStyle}>
                                        {categories.map(function (c) {
                                            return <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Job Type *</label>
                                    <select value={form.jobType} onChange={function (e) { update('jobType', e.target.value); }} style={inputStyle}>
                                        {jobTypes.map(function (t) {
                                            return <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Work Mode *</label>
                                    <select value={form.locationType} onChange={function (e) { update('locationType', e.target.value); }} style={inputStyle}>
                                        {locationTypes.map(function (t) {
                                            return <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>;
                                        })}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-2">
                                <div>
                                    <label style={labelStyle}>Location *</label>
                                    <input type="text" value={form.location} onChange={function (e) { update('location', e.target.value); }} placeholder="e.g. Dhaka, Bangladesh" required style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Vacancies</label>
                                    <input type="number" value={form.vacancies} onChange={function (e) { update('vacancies', e.target.value); }} min="1" style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Salary */}
                    <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#34d39920', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>💰</span>
                            Salary Range (BDT/month)
                        </h2>

                        <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-2">
                            <div>
                                <label style={labelStyle}>Minimum Salary *</label>
                                <input type="number" value={form.salaryMin} onChange={function (e) { update('salaryMin', e.target.value); }} placeholder="e.g. 30000" required style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Maximum Salary *</label>
                                <input type="number" value={form.salaryMax} onChange={function (e) { update('salaryMax', e.target.value); }} placeholder="e.g. 60000" required style={inputStyle} />
                            </div>
                        </div>

                        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem', cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.isNegotiable} onChange={function (e) { update('isNegotiable', e.target.checked); }} style={{ width: '16px', height: '16px', accentColor: '#8b5cf6' }} />
                            <span style={{ fontSize: '13px', color: '#a0a0c8' }}>Salary is negotiable</span>
                        </label>
                    </div>

                    {/* Requirements */}
                    <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#22d3ee20', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>📝</span>
                            Job Details
                        </h2>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>Job Description *</label>
                                <textarea value={form.description} onChange={function (e) { update('description', e.target.value); }} placeholder="Describe the role, team, and what the candidate will be doing..." rows={5} required style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Requirements *</label>
                                <textarea value={form.requirements} onChange={function (e) { update('requirements', e.target.value); }} placeholder="List the skills, qualifications, and experience required..." rows={4} required style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Responsibilities</label>
                                <textarea value={form.responsibilities} onChange={function (e) { update('responsibilities', e.target.value); }} placeholder="Key responsibilities and duties..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={labelStyle}>Benefits</label>
                                <textarea value={form.benefits} onChange={function (e) { update('benefits', e.target.value); }} placeholder="What you offer: health insurance, flexible hours, etc..." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Experience */}
                    <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#fbbf2420', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>⚡</span>
                            Skills and Experience
                        </h2>

                        <div style={{ display: 'grid', gap: '1.25rem' }}>
                            <div>
                                <label style={labelStyle}>Required Skills</label>
                                <input type="text" value={form.skills} onChange={function (e) { update('skills', e.target.value); }} placeholder="React, Node.js, MongoDB (comma separated)" style={inputStyle} />
                                <p style={{ fontSize: '11px', color: '#6060a0', marginTop: '6px' }}>Separate skills with commas</p>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-3">
                                <div>
                                    <label style={labelStyle}>Experience Required</label>
                                    <select value={form.experience} onChange={function (e) { update('experience', e.target.value); }} style={inputStyle}>
                                        {['0-1 years', '0-2 years', '1-3 years', '2-4 years', '3-5 years', '5+ years'].map(function (e) {
                                            return <option key={e} value={e}>{e}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Education</label>
                                    <select value={form.education} onChange={function (e) { update('education', e.target.value); }} style={inputStyle}>
                                        {['SSC', 'HSC', 'Diploma', 'Bachelor', 'Master', 'PhD', 'Any'].map(function (e) {
                                            return <option key={e} value={e}>{e}</option>;
                                        })}
                                    </select>
                                </div>
                                <div>
                                    <label style={labelStyle}>Application Deadline *</label>
                                    <input type="date" value={form.deadline} onChange={function (e) { update('deadline', e.target.value); }} required min={new Date().toISOString().split('T')[0]} style={inputStyle} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: '14px 16px', borderRadius: '12px', background: '#f8717120', border: '1px solid #f8717140', color: '#f87171', fontSize: '14px', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <Link href="/dashboard/company" style={{ padding: '14px 28px', borderRadius: '12px', border: '1px solid #2e2e4e', color: '#8080a8', fontWeight: 700, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                            Cancel
                        </Link>
                        <button type="submit" disabled={loading}
                            style={{ padding: '14px 32px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Posting...' : 'Post Job →'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}