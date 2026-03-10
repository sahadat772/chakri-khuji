'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const statusColors = {
    pending: { bg: '#fbbf2420', color: '#fbbf24', border: '#fbbf2440', label: 'Pending' },
    reviewed: { bg: '#22d3ee20', color: '#22d3ee', border: '#22d3ee40', label: 'Reviewed' },
    shortlisted: { bg: '#8b5cf620', color: '#a78bfa', border: '#8b5cf640', label: 'Shortlisted' },
    accepted: { bg: '#34d39920', color: '#34d399', border: '#34d39940', label: 'Accepted' },
    rejected: { bg: '#f8717120', color: '#f87171', border: '#f8717140', label: 'Rejected' },
};

export default function CompanyDashboard() {
    const { data: session } = useSession();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('jobs');
    const [selectedJob, setSelectedJob] = useState(null);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [profileForm, setProfileForm] = useState({
        companyName: '', companyWebsite: '', companySize: '', bio: '', location: '',
    });
    const logoRef = useRef(null);

    useEffect(function () {
        async function fetchData() {
            try {
                const [jobsRes, userRes] = await Promise.all([
                    fetch('/api/company/jobs'),
                    fetch('/api/user'),
                ]);
                const jobsData = await jobsRes.json();
                const userData = await userRes.json();
                setJobs(jobsData.jobs || []);
                setProfile(userData.user);
                setProfileForm({
                    companyName: userData.user?.companyName || '',
                    companyWebsite: userData.user?.companyWebsite || '',
                    companySize: userData.user?.companySize || '',
                    bio: userData.user?.bio || '',
                    location: userData.user?.location || '',
                });
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    async function fetchApplicants(jobId) {
        setLoadingApplicants(true);
        try {
            const res = await fetch('/api/applications?jobId=' + jobId);
            const data = await res.json();
            setApplicants(data.applications || []);
        } catch (err) {
            console.error(err);
        }
        setLoadingApplicants(false);
    }

    async function updateStatus(appId, status) {
        try {
            await fetch('/api/applications/' + appId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
            setApplicants(function (prev) {
                return prev.map(function (a) { return a._id === appId ? { ...a, status } : a; });
            });
        } catch (err) {
            console.error(err);
        }
    }

    async function toggleJobStatus(jobId, isActive) {
        try {
            await fetch('/api/jobs/' + jobId, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !isActive }),
            });
            setJobs(function (prev) {
                return prev.map(function (j) { return j._id === jobId ? { ...j, isActive: !isActive } : j; });
            });
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteJob(jobId) {
        if (!confirm('Delete this job?')) return;
        try {
            await fetch('/api/jobs/' + jobId, { method: 'DELETE' });
            setJobs(function (prev) { return prev.filter(function (j) { return j._id !== jobId; }); });
        } catch (err) {
            console.error(err);
        }
    }

    async function handleLogoChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'logo');
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            const data = await res.json();
            if (res.ok) {
                await fetch('/api/user', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ companyLogo: data.url }),
                });
                setProfile(function (prev) { return { ...prev, companyLogo: data.url }; });
            } else {
                alert('Upload failed: ' + data.message);
            }
        } catch (err) {
            console.error(err);
        }
        setUploadingLogo(false);
    }

    async function handleSaveProfile(e) {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/user', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileForm),
        });
        if (res.ok) {
            setSaveMsg('Profile saved!');
            setTimeout(function () { setSaveMsg(''); }, 3000);
        }
        setSaving(false);
    }

    const totalApplications = jobs.reduce(function (sum, j) { return sum + (j.applications || 0); }, 0);
    const totalViews = jobs.reduce(function (sum, j) { return sum + (j.views || 0); }, 0);

    const stats = [
        { label: 'Active Jobs', value: jobs.filter(function (j) { return j.isActive; }).length, icon: '💼', color: '#8b5cf6' },
        { label: 'Total Jobs', value: jobs.length, icon: '📋', color: '#22d3ee' },
        { label: 'Applications', value: totalApplications, icon: '👥', color: '#fbbf24' },
        { label: 'Total Views', value: totalViews, icon: '👁️', color: '#34d399' },
    ];

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
        <div style={{ padding: '2rem 1.5rem' }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#f0f0ff', marginBottom: '4px' }}>
                            Company <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dashboard</span>
                        </h1>
                        <p style={{ color: '#8080a8', fontSize: '14px' }}>Manage your job listings and review applicants</p>
                    </div>
                    <Link href="/dashboard/post-job" style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                        + Post New Job
                    </Link>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="md:grid-cols-4">
                    {stats.map(function (stat) {
                        return (
                            <div key={stat.label} style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: stat.color }} />
                                </div>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                                <div style={{ fontSize: '12px', color: '#6060a0' }}>{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#13131f', padding: '4px', borderRadius: '12px', border: '1px solid #2e2e4e', width: 'fit-content', flexWrap: 'wrap' }}>
                    {['jobs', 'applicants', 'profile'].map(function (tab) {
                        return (
                            <button key={tab} onClick={function () { setActiveTab(tab); }}
                                style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === tab ? 'linear-gradient(135deg, #8b5cf6, #22d3ee)' : 'transparent', color: activeTab === tab ? 'white' : '#8080a8', transition: 'all 0.2s' }}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        );
                    })}
                </div>

                {/* Jobs Tab */}
                {activeTab === 'jobs' && (
                    <div>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[1, 2, 3].map(function (i) { return <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />; })}
                            </div>
                        ) : jobs.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#13131f', borderRadius: '20px', border: '1px solid #2e2e4e' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '0.5rem' }}>No jobs posted yet</h3>
                                <Link href="/dashboard/post-job" style={{ display: 'inline-block', marginTop: '1rem', padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
                                    Post Your First Job
                                </Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {jobs.map(function (job) {
                                    return (
                                        <div key={job._id} style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', fontSize: '1rem' }}>{job.title}</h3>
                                                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: job.isActive ? '#34d39920' : '#f8717120', color: job.isActive ? '#34d399' : '#f87171', border: '1px solid ' + (job.isActive ? '#34d39940' : '#f8717140') }}>
                                                            {job.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>👥 {job.applications || 0} applicants</span>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>👁️ {job.views || 0} views</span>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                    <button onClick={function () { setSelectedJob(job._id); setActiveTab('applicants'); fetchApplicants(job._id); }}
                                                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640', cursor: 'pointer' }}>
                                                        Applicants
                                                    </button>
                                                    <button onClick={function () { toggleJobStatus(job._id, job.isActive); }}
                                                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#22d3ee20', color: '#22d3ee', border: '1px solid #22d3ee40', cursor: 'pointer' }}>
                                                        {job.isActive ? 'Deactivate' : 'Activate'}
                                                    </button>
                                                    <button onClick={function () { deleteJob(job._id); }}
                                                        style={{ padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: '#f8717120', color: '#f87171', border: '1px solid #f8717140', cursor: 'pointer' }}>
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Applicants Tab */}
                {activeTab === 'applicants' && (
                    <div>
                        {!selectedJob ? (
                            <div style={{ textAlign: 'center', padding: '4rem', background: '#13131f', borderRadius: '20px', border: '1px solid #2e2e4e' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👆</div>
                                <p style={{ color: '#8080a8' }}>Select a job from the Jobs tab to view applicants</p>
                            </div>
                        ) : loadingApplicants ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[1, 2, 3].map(function (i) { return <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />; })}
                            </div>
                        ) : applicants.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem', background: '#13131f', borderRadius: '20px', border: '1px solid #2e2e4e' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                <p style={{ color: '#8080a8' }}>No applicants for this job yet</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {applicants.map(function (app) {
                                    const statusStyle = statusColors[app.status] || statusColors.pending;
                                    return (
                                        <div key={app._id} style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '6px' }}>{app.candidate?.name}</h3>
                                                    <p style={{ fontSize: '13px', color: '#8080a8', marginBottom: '8px' }}>✉️ {app.candidate?.email}</p>
                                                    <p style={{ fontSize: '13px', color: '#a0a0c8', lineHeight: 1.6, marginBottom: '8px' }}>
                                                        <strong style={{ color: '#c0c0e0' }}>Cover Letter:</strong> {app.coverLetter?.slice(0, 150)}...
                                                    </p>
                                                    {app.expectedSalary && (
                                                        <p style={{ fontSize: '13px', color: '#34d399' }}>💰 Expected: {app.expectedSalary?.toLocaleString()} BDT</p>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                                    <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, border: '1px solid ' + statusStyle.border }}>
                                                        {statusStyle.label}
                                                    </span>
                                                    <select value={app.status} onChange={function (e) { updateStatus(app._id, e.target.value); }}
                                                        style={{ padding: '8px 12px', borderRadius: '8px', background: '#1a1a2e', border: '1px solid #2e2e4e', color: '#e8e8f0', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                                                        <option value="pending">Pending</option>
                                                        <option value="reviewed">Reviewed</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="accepted">Accepted</option>
                                                        <option value="rejected">Rejected</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div style={{ display: 'grid', gap: '1.5rem' }} className="md:grid-cols-[280px_1fr]">

                        {/* Left — Logo */}
                        <div style={{ padding: '1.5rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.25rem', fontSize: '14px' }}>Company Logo</h3>

                            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                                <div style={{ width: '100px', height: '100px', borderRadius: '20px', background: 'linear-gradient(135deg, #8b5cf620, #22d3ee20)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', overflow: 'hidden', border: '2px solid #2e2e4e' }}>
                                    {profile?.companyLogo ? (
                                        <img src={profile.companyLogo} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : '🏢'}
                                </div>
                                <button onClick={function () { logoRef.current?.click(); }}
                                    style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', background: '#8b5cf6', border: '2px solid #0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}>
                                    ✏️
                                </button>
                            </div>

                            <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                            <button onClick={function () { logoRef.current?.click(); }} disabled={uploadingLogo}
                                style={{ padding: '10px 16px', borderRadius: '10px', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                                {uploadingLogo ? 'Uploading...' : profile?.companyLogo ? '🔄 Update Logo' : '⬆️ Upload Logo'}
                            </button>
                            <p style={{ fontSize: '11px', color: '#404060', marginTop: '8px' }}>PNG, JPG, SVG accepted</p>
                        </div>

                        {/* Right — Company Info Form */}
                        <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Company Information</h2>

                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-2">
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Company Name</label>
                                        <input type="text" value={profileForm.companyName} onChange={function (e) { setProfileForm({ ...profileForm, companyName: e.target.value }); }} placeholder="Your Company Ltd." style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Website</label>
                                        <input type="url" value={profileForm.companyWebsite} onChange={function (e) { setProfileForm({ ...profileForm, companyWebsite: e.target.value }); }} placeholder="https://yourcompany.com" style={inputStyle} />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-2">
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Company Size</label>
                                        <select value={profileForm.companySize} onChange={function (e) { setProfileForm({ ...profileForm, companySize: e.target.value }); }} style={inputStyle}>
                                            <option value="">Select size</option>
                                            {['1-10', '11-50', '51-200', '201-500', '500+'].map(function (s) {
                                                return <option key={s} value={s}>{s} employees</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Location</label>
                                        <input type="text" value={profileForm.location} onChange={function (e) { setProfileForm({ ...profileForm, location: e.target.value }); }} placeholder="Dhaka, Bangladesh" style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>About Company</label>
                                    <textarea value={profileForm.bio} onChange={function (e) { setProfileForm({ ...profileForm, bio: e.target.value }); }} placeholder="Tell candidates about your company culture, mission, and values..." rows={4} style={{ ...inputStyle, resize: 'none' }} />
                                </div>

                                {saveMsg && (
                                    <div style={{ padding: '12px', borderRadius: '10px', background: '#34d39920', border: '1px solid #34d39940', color: '#34d399', fontSize: '14px', textAlign: 'center' }}>
                                        ✅ {saveMsg}
                                    </div>
                                )}

                                <button type="submit" disabled={saving}
                                    style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saving...' : 'Save Company Profile'}
                                </button>
                            </form>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}