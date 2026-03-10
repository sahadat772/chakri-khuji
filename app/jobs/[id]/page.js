'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function JobDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applyOpen, setApplyOpen] = useState(false);
    const [applying, setApplying] = useState(false);
    const [applied, setApplied] = useState(false);
    const [form, setForm] = useState({ coverLetter: '', expectedSalary: '' });
    const [error, setError] = useState('');

    useEffect(function () {
        async function fetchJob() {
            try {
                const res = await fetch('/api/jobs/' + id);
                const data = await res.json();
                setJob(data.job);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchJob();
    }, [id]);

    async function handleApply(e) {
        e.preventDefault();
        if (!session) {
            router.push('/login');
            return;
        }
        if (form.coverLetter.length < 50) {
            setError('Cover letter must be at least 50 characters');
            return;
        }
        setApplying(true);
        setError('');
        try {
            const res = await fetch('/api/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    jobId: id,
                    coverLetter: form.coverLetter,
                    expectedSalary: form.expectedSalary,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setApplied(true);
                setApplyOpen(false);
            } else {
                setError(data.message || 'Something went wrong');
            }
        } catch (err) {
            setError('Server error. Please try again.');
        }
        setApplying(false);
    }

    const typeColors = {
        'full-time': '#34d399',
        'part-time': '#fbbf24',
        'contract': '#f87171',
        'internship': '#a78bfa',
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', paddingTop: '6rem', padding: '6rem 1.5rem 2rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gap: '2rem' }} className="lg:grid-cols-[1fr_320px]">
                    <div>
                        <div className="skeleton" style={{ height: '40px', width: '70%', marginBottom: '1rem' }} />
                        <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '2rem' }} />
                        <div className="skeleton" style={{ height: '200px', marginBottom: '1rem' }} />
                    </div>
                    <div className="skeleton" style={{ height: '300px', borderRadius: '16px' }} />
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '4rem' }}>😕</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff' }}>Job Not Found</h2>
                <Link href="/jobs" style={{ color: '#a78bfa', textDecoration: 'none' }}>Browse all jobs →</Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', paddingTop: '5rem' }}>

            {/* Back */}
            <div style={{ borderBottom: '1px solid #2e2e4e', padding: '1rem 1.5rem', background: '#0d0d18' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <Link href="/jobs" style={{ fontSize: '14px', color: '#8080a8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        ← Back to Jobs
                    </Link>
                </div>
            </div>

            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gap: '2rem' }} className="lg:grid-cols-[1fr_320px]">

                {/* Main Content */}
                <div>

                    {/* Job Header */}
                    <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8b5cf6, #22d3ee)' }} />

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '14px', background: '#8b5cf620', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0, border: '1px solid #8b5cf640' }}>
                                🏢
                            </div>
                            <div style={{ flex: 1 }}>
                                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#f0f0ff', marginBottom: '8px' }}>{job.title}</h1>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '14px', color: '#a0a0c8', fontWeight: 600 }}>🏢 {job.company?.companyName || job.company?.name}</span>
                                    <span style={{ fontSize: '14px', color: '#8080a8' }}>📍 {job.location}</span>
                                    <span style={{ fontSize: '14px', color: '#34d399', fontWeight: 600 }}>💰 {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()} {job.salary?.currency}</span>
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: (typeColors[job.jobType] || '#8b5cf6') + '20', color: typeColors[job.jobType] || '#8b5cf6', border: '1px solid ' + (typeColors[job.jobType] || '#8b5cf6') + '40' }}>{job.jobType}</span>
                                    <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#22d3ee20', color: '#22d3ee', border: '1px solid #22d3ee40' }}>{job.locationType}</span>
                                    <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#fbbf2420', color: '#fbbf24', border: '1px solid #fbbf2440' }}>{job.category}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1rem', fontSize: '1.1rem' }}>Job Description</h2>
                        <p style={{ color: '#a0a0c8', lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{job.description}</p>
                    </div>

                    {/* Requirements */}
                    {job.requirements && (
                        <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1rem', fontSize: '1.1rem' }}>Requirements</h2>
                            <p style={{ color: '#a0a0c8', lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {job.skills && job.skills.length > 0 && (
                        <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1rem', fontSize: '1.1rem' }}>Required Skills</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {job.skills.map(function (skill) {
                                    return (
                                        <span key={skill} style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, background: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640' }}>{skill}</span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Apply Modal */}
                    {applyOpen && (
                        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                            <div style={{ width: '100%', maxWidth: '540px', background: '#13131f', borderRadius: '20px', border: '1px solid #2e2e4e', padding: '2rem', position: 'relative' }}>
                                <button onClick={function () { setApplyOpen(false); }}
                                    style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#8080a8', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>

                                <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, color: '#f0f0ff', marginBottom: '0.5rem' }}>Apply for this Job</h2>
                                <p style={{ color: '#8080a8', fontSize: '13px', marginBottom: '1.5rem' }}>{job.title} at {job.company?.companyName || job.company?.name}</p>

                                <form onSubmit={handleApply} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px' }}>Cover Letter <span style={{ color: '#f87171' }}>*</span></label>
                                        <textarea
                                            value={form.coverLetter}
                                            onChange={function (e) { setForm({ ...form, coverLetter: e.target.value }); }}
                                            placeholder="Tell us why you are the perfect fit for this role... (min 50 characters)"
                                            rows={6}
                                            required
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#1a1a2e', border: '1px solid #2e2e4e', color: '#e8e8f0', fontSize: '14px', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                                        />
                                        <span style={{ fontSize: '11px', color: form.coverLetter.length < 50 ? '#f87171' : '#34d399' }}>
                                            {form.coverLetter.length} / 50 minimum characters
                                        </span>
                                    </div>

                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px' }}>Expected Salary (BDT/month)</label>
                                        <input
                                            type="number"
                                            value={form.expectedSalary}
                                            onChange={function (e) { setForm({ ...form, expectedSalary: e.target.value }); }}
                                            placeholder="e.g. 50000"
                                            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', background: '#1a1a2e', border: '1px solid #2e2e4e', color: '#e8e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    {error && (
                                        <div style={{ padding: '12px', borderRadius: '10px', background: '#f8717120', border: '1px solid #f8717140', color: '#f87171', fontSize: '13px' }}>{error}</div>
                                    )}

                                    <button type="submit" disabled={applying}
                                        style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: applying ? 'not-allowed' : 'pointer', opacity: applying ? 0.7 : 1 }}>
                                        {applying ? 'Submitting...' : 'Submit Application'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div>
                    <div style={{ padding: '1.5rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', position: 'sticky', top: '90px' }}>

                        {applied ? (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#34d399', marginBottom: '0.5rem' }}>Applied!</h3>
                                <p style={{ fontSize: '13px', color: '#8080a8' }}>Your application has been submitted successfully.</p>
                            </div>
                        ) : (
                            <button onClick={function () { if (!session) { router.push('/login'); } else { setApplyOpen(true); } }}
                                style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer', marginBottom: '1rem' }}>
                                {session ? 'Apply Now →' : 'Login to Apply'}
                            </button>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                            {[
                                { icon: '📅', label: 'Deadline', value: new Date(job.deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
                                { icon: '👥', label: 'Vacancies', value: job.vacancies + ' positions' },
                                { icon: '🎓', label: 'Education', value: job.education },
                                { icon: '⏳', label: 'Experience', value: job.experience },
                                { icon: '👁️', label: 'Views', value: job.views + ' views' },
                            ].map(function (item) {
                                return (
                                    <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e1e3a' }}>
                                        <span style={{ fontSize: '13px', color: '#6060a0', display: 'flex', alignItems: 'center', gap: '8px' }}>{item.icon} {item.label}</span>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#c0c0e0' }}>{item.value}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {job.company?.companyWebsite && (
                            <a href={job.company.companyWebsite} target="_blank" rel="noopener noreferrer"
                                style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', padding: '10px', borderRadius: '10px', border: '1px solid #2e2e4e', color: '#a78bfa', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                                Visit Company Website →
                            </a>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}