'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
// import Image from 'next/image';

const statusColors = {
    pending: { bg: '#fbbf2420', color: '#fbbf24', border: '#fbbf2440', label: 'Pending' },
    reviewed: { bg: '#22d3ee20', color: '#22d3ee', border: '#22d3ee40', label: 'Reviewed' },
    shortlisted: { bg: '#8b5cf620', color: '#a78bfa', border: '#8b5cf640', label: 'Shortlisted' },
    accepted: { bg: '#34d39920', color: '#34d399', border: '#34d39940', label: 'Accepted' },
    rejected: { bg: '#f8717120', color: '#f87171', border: '#f8717140', label: 'Rejected' },
};

export default function CandidateDashboard() {
    const { data: session, update } = useSession();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('applications');
    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [uploadingResume, setUploadingResume] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');
    const [profileForm, setProfileForm] = useState({ name: '', bio: '', phone: '', location: '', skills: '' });
    const avatarRef = useRef(null);
    const resumeRef = useRef(null);

    useEffect(function () {
        async function fetchData() {
            try {
                const [appRes, userRes] = await Promise.all([
                    fetch('/api/applications'),
                    fetch('/api/user'),
                ]);
                const appData = await appRes.json();
                const userData = await userRes.json();
                setApplications(appData.applications || []);
                setProfile(userData.user);
                setProfileForm({
                    name: userData.user?.name || '',
                    bio: userData.user?.bio || '',
                    phone: userData.user?.phone || '',
                    location: userData.user?.location || '',
                    skills: (userData.user?.skills || []).join(', '),
                });
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    async function uploadFile(file, type, onSuccess) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) onSuccess(data.url);
        else alert('Upload failed: ' + data.message);
    }

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingAvatar(true);
        await uploadFile(file, 'avatar', async function (url) {
            await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: url }),
            });
            setProfile(function (prev) { return { ...prev, image: url }; });
        });
        setUploadingAvatar(false);
    }

    async function handleResumeChange(e) {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingResume(true);
        await uploadFile(file, 'resume', async function (url) {
            await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ resume: url }),
            });
            setProfile(function (prev) { return { ...prev, resume: url }; });
        });
        setUploadingResume(false);
    }

    async function handleSaveProfile(e) {
        e.preventDefault();
        setSaving(true);
        const res = await fetch('/api/user', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: profileForm.name,
                bio: profileForm.bio,
                phone: profileForm.phone,
                location: profileForm.location,
                skills: profileForm.skills.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
            }),
        });
        if (res.ok) {
            setSaveMsg('Profile saved!');
            setTimeout(function () { setSaveMsg(''); }, 3000);
        }
        setSaving(false);
    }

    const stats = [
        { label: 'Total Applied', value: applications.length, icon: '📝', color: '#8b5cf6' },
        { label: 'Pending', value: applications.filter(function (a) { return a.status === 'pending'; }).length, icon: '⏳', color: '#fbbf24' },
        { label: 'Shortlisted', value: applications.filter(function (a) { return a.status === 'shortlisted'; }).length, icon: '⭐', color: '#22d3ee' },
        { label: 'Accepted', value: applications.filter(function (a) { return a.status === 'accepted'; }).length, icon: '🎉', color: '#34d399' },
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
                            Welcome back, <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{session?.user?.name?.split(' ')[0]}</span> 👋
                        </h1>
                        <p style={{ color: '#8080a8', fontSize: '14px' }}>Track your applications and manage your profile</p>
                    </div>
                    <Link href="/jobs" style={{ padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                        Browse Jobs →
                    </Link>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '2rem' }} className="md:grid-cols-4">
                    {stats.map(function (stat) {
                        return (
                            <div key={stat.label} style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
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
                <div style={{ display: 'flex', gap: '4px', marginBottom: '1.5rem', background: '#13131f', padding: '4px', borderRadius: '12px', border: '1px solid #2e2e4e', width: 'fit-content' }}>
                    {['applications', 'profile'].map(function (tab) {
                        return (
                            <button key={tab} onClick={function () { setActiveTab(tab); }}
                                style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', background: activeTab === tab ? 'linear-gradient(135deg, #8b5cf6, #22d3ee)' : 'transparent', color: activeTab === tab ? 'white' : '#8080a8', transition: 'all 0.2s' }}>
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        );
                    })}
                </div>

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div>
                        {loading ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {[1, 2, 3].map(function (i) { return <div key={i} className="skeleton" style={{ height: '100px', borderRadius: '16px' }} />; })}
                            </div>
                        ) : applications.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#13131f', borderRadius: '20px', border: '1px solid #2e2e4e' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '0.5rem' }}>No applications yet</h3>
                                <p style={{ color: '#8080a8', fontSize: '14px', marginBottom: '1.5rem' }}>Start applying to your dream jobs!</p>
                                <Link href="/jobs" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>Browse Jobs</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {applications.map(function (app) {
                                    const statusStyle = statusColors[app.status] || statusColors.pending;
                                    return (
                                        <div key={app._id} style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}
                                            onMouseEnter={function (e) { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                                            onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ flex: 1 }}>
                                                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '6px', fontSize: '1rem' }}>{app.job?.title || 'Job Deleted'}</h3>
                                                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>🏢 {app.job?.company?.companyName || 'Unknown'}</span>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>📅 {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>
                                                    {app.job && <Link href={'/jobs/' + app.job._id} style={{ fontSize: '12px', color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}>View Job →</Link>}
                                                </div>
                                                <span style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, border: '1px solid ' + statusStyle.border, whiteSpace: 'nowrap' }}>
                                                    {statusStyle.label}
                                                </span>
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

                        {/* Left — Avatar + Resume */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                            {/* Avatar */}
                            <div style={{ padding: '1.5rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center' }}>
                                <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1rem' }}>
                                    <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', overflow: 'hidden', border: '3px solid #2e2e4e' }}>
                                        {profile?.image ? (
                                            <img src={profile.image} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            session?.user?.name?.charAt(0)?.toUpperCase() || '👤'
                                        )}
                                    </div>
                                    <button onClick={function () { avatarRef.current?.click(); }}
                                        style={{ position: 'absolute', bottom: 0, right: 0, width: '28px', height: '28px', borderRadius: '50%', background: '#8b5cf6', border: '2px solid #0a0a0f', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}>
                                        ✏️
                                    </button>
                                </div>
                                <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
                                <button onClick={function () { avatarRef.current?.click(); }} disabled={uploadingAvatar}
                                    style={{ padding: '8px 16px', borderRadius: '10px', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                                    {uploadingAvatar ? 'Uploading...' : 'Change Photo'}
                                </button>
                            </div>

                            {/* Resume */}
                            <div style={{ padding: '1.5rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1rem', fontSize: '14px' }}>Resume / CV</h3>
                                {profile?.resume ? (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <a href={profile.resume} target="_blank" rel="noopener noreferrer"
                                            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', background: '#34d39920', border: '1px solid #34d39940', color: '#34d399', textDecoration: 'none', fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>
                                            📄 View Current Resume
                                        </a>
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '12px', color: '#6060a0', marginBottom: '1rem' }}>No resume uploaded yet</p>
                                )}
                                <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} style={{ display: 'none' }} />
                                <button onClick={function () { resumeRef.current?.click(); }} disabled={uploadingResume}
                                    style={{ padding: '10px 14px', borderRadius: '10px', background: '#22d3ee20', border: '1px solid #22d3ee40', color: '#22d3ee', fontSize: '13px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
                                    {uploadingResume ? 'Uploading...' : profile?.resume ? '🔄 Update Resume' : '⬆️ Upload Resume'}
                                </button>
                                <p style={{ fontSize: '11px', color: '#4040608', marginTop: '8px', textAlign: 'center' }}>PDF, DOC, DOCX accepted</p>
                            </div>
                        </div>

                        {/* Right — Profile Form */}
                        <div style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '1.5rem', fontSize: '1.1rem' }}>Edit Profile</h2>

                            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div style={{ display: 'grid', gap: '1rem' }} className="md:grid-cols-2">
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Full Name</label>
                                        <input type="text" value={profileForm.name} onChange={function (e) { setProfileForm({ ...profileForm, name: e.target.value }); }} style={inputStyle} />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Phone</label>
                                        <input type="text" value={profileForm.phone} onChange={function (e) { setProfileForm({ ...profileForm, phone: e.target.value }); }} placeholder="+880 1XXX XXXXXX" style={inputStyle} />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Location</label>
                                    <input type="text" value={profileForm.location} onChange={function (e) { setProfileForm({ ...profileForm, location: e.target.value }); }} placeholder="Dhaka, Bangladesh" style={inputStyle} />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bio</label>
                                    <textarea value={profileForm.bio} onChange={function (e) { setProfileForm({ ...profileForm, bio: e.target.value }); }} placeholder="Tell employers about yourself..." rows={3} style={{ ...inputStyle, resize: 'none' }} />
                                </div>

                                <div>
                                    <label style={{ fontSize: '12px', color: '#a0a0c8', display: 'block', marginBottom: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Skills</label>
                                    <input type="text" value={profileForm.skills} onChange={function (e) { setProfileForm({ ...profileForm, skills: e.target.value }); }} placeholder="React, Node.js, MongoDB (comma separated)" style={inputStyle} />
                                    {profileForm.skills && (
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                            {profileForm.skills.split(',').map(function (s) { return s.trim(); }).filter(Boolean).map(function (skill) {
                                                return (
                                                    <span key={skill} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', background: '#8b5cf620', color: '#a78bfa', border: '1px solid #8b5cf640' }}>{skill}</span>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {saveMsg && (
                                    <div style={{ padding: '12px', borderRadius: '10px', background: '#34d39920', border: '1px solid #34d39940', color: '#34d399', fontSize: '14px', textAlign: 'center' }}>
                                        ✅ {saveMsg}
                                    </div>
                                )}

                                <button type="submit" disabled={saving}
                                    style={{ padding: '14px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
                                    {saving ? 'Saving...' : 'Save Profile'}
                                </button>
                            </form>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}