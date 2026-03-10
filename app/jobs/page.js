'use client';

import { useState, useEffect, } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

const jobTypes = ['full-time', 'part-time', 'contract', 'internship'];
const locationTypes = ['onsite', 'remote', 'hybrid'];
const categories = ['tech', 'design', 'marketing', 'sales', 'finance', 'hr', 'other'];

const typeColors = {
    'full-time': '#34d399',
    'part-time': '#fbbf24',
    'contract': '#f87171',
    'internship': '#a78bfa',
};

const locationColors = {
    'remote': '#22d3ee',
    'hybrid': '#fbbf24',
    'onsite': '#8080a8',
};

export default function JobsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [pages, setPages] = useState(1);

    const [search, setSearch] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [jobType, setJobType] = useState('');
    const [locationType, setLocationType] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const controller = new AbortController();

        async function load() {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (search) params.set('q', search);
                if (category) params.set('category', category);
                if (jobType) params.set('jobType', jobType);
                if (locationType) params.set('locationType', locationType);
                params.set('page', page.toString());

                const res = await fetch('/api/jobs?' + params.toString(), { signal: controller.signal });
                const data = await res.json();
                setJobs(data.jobs || []);
                setTotal(data.total || 0);
                setPages(data.pages || 1);
            } catch (err) {
                if (err.name !== 'AbortError') console.error(err);
            }
            setLoading(false);
        }

        load();
        return () => controller.abort();
    }, [search, category, jobType, locationType, page]);

    const inputStyle = {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '10px',
        background: '#1a1a2e',
        border: '1px solid #2e2e4e',
        color: '#e8e8f0',
        fontSize: '13px',
        outline: 'none',
    };

    const filterBtnStyle = function (active) {
        return {
            padding: '7px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: active ? '#8b5cf6' : '#2e2e4e',
            background: active ? '#8b5cf620' : 'transparent',
            color: active ? '#a78bfa' : '#8080a8',
            transition: 'all 0.2s',
        };
    };

    return (
        <div style={{ minHeight: '100vh', paddingTop: '5rem' }}>

            {/* Header */}
            <div style={{ background: '#0d0d18', borderBottom: '1px solid #2e2e4e', padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff', marginBottom: '0.5rem' }}>
                        Find Your{' '}
                        <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Perfect Job</span>
                    </h1>
                    <p style={{ color: '#8080a8', marginBottom: '1.5rem' }}>{total} jobs available right now</p>

                    {/* Search */}
                    <div style={{ display: 'flex', gap: '12px', maxWidth: '600px', background: '#13131f', border: '1px solid #2e2e4e', borderRadius: '14px', padding: '8px' }}>
                        <span style={{ fontSize: '1.1rem', padding: '0 8px', display: 'flex', alignItems: 'center' }}>🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={function (e) { setSearch(e.target.value); setPage(1); }}
                            placeholder="Job title, keyword or company..."
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#f0f0ff', fontSize: '14px', outline: 'none', padding: '8px 0' }}
                        />
                        {search && (
                            <button onClick={function () { setSearch(''); setPage(1); }}
                                style={{ background: 'none', border: 'none', color: '#8080a8', cursor: 'pointer', fontSize: '1.2rem', padding: '0 8px' }}>✕</button>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: '72rem', margin: '0 auto', padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="lg:grid-cols-[280px_1fr]">

                {/* Filters Sidebar */}
                <aside>
                    <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e', position: 'sticky', top: '90px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', fontSize: '1rem' }}>Filters</h3>
                            {(category || jobType || locationType) && (
                                <button onClick={function () { setCategory(''); setJobType(''); setLocationType(''); setPage(1); }}
                                    style={{ fontSize: '12px', color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                                    Clear All
                                </button>
                            )}
                        </div>

                        {/* Category */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6060a0', display: 'block', marginBottom: '10px' }}>Category</label>
                            <select value={category} onChange={function (e) { setCategory(e.target.value); setPage(1); }} style={inputStyle}>
                                <option value="">All Categories</option>
                                {categories.map(function (c) {
                                    return <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>;
                                })}
                            </select>
                        </div>

                        {/* Job Type */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6060a0', display: 'block', marginBottom: '10px' }}>Job Type</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {jobTypes.map(function (t) {
                                    return (
                                        <button key={t} onClick={function () { setJobType(jobType === t ? '' : t); setPage(1); }}
                                            style={filterBtnStyle(jobType === t)}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Location Type */}
                        <div>
                            <label style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6060a0', display: 'block', marginBottom: '10px' }}>Work Mode</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {locationTypes.map(function (t) {
                                    return (
                                        <button key={t} onClick={function () { setLocationType(locationType === t ? '' : t); setPage(1); }}
                                            style={filterBtnStyle(locationType === t)}>
                                            {t.charAt(0).toUpperCase() + t.slice(1)}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Jobs List */}
                <div>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {[1, 2, 3, 4, 5].map(function (i) {
                                return (
                                    <div key={i} style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                                        <div className="skeleton" style={{ height: '24px', width: '60%', marginBottom: '12px' }} />
                                        <div className="skeleton" style={{ height: '16px', width: '40%', marginBottom: '8px' }} />
                                        <div className="skeleton" style={{ height: '16px', width: '80%' }} />
                                    </div>
                                );
                            })}
                        </div>
                    ) : jobs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#13131f', borderRadius: '16px', border: '1px solid #2e2e4e' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '0.5rem' }}>No jobs found</h3>
                            <p style={{ color: '#8080a8', fontSize: '14px' }}>Try different keywords or remove some filters</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {jobs.map(function (job) {
                                return (
                                    <Link key={job._id} href={'/jobs/' + job._id} style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
                                            onMouseEnter={function (e) { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                            onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                        <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: 800, color: '#f0f0ff' }}>{job.title}</h3>
                                                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: (typeColors[job.jobType] || '#8080a8') + '20', color: typeColors[job.jobType] || '#8080a8', border: '1px solid ' + (typeColors[job.jobType] || '#8080a8') + '40' }}>
                                                            {job.jobType}
                                                        </span>
                                                        <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: (locationColors[job.locationType] || '#8080a8') + '20', color: locationColors[job.locationType] || '#8080a8', border: '1px solid ' + (locationColors[job.locationType] || '#8080a8') + '40' }}>
                                                            {job.locationType}
                                                        </span>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>🏢 {job.company?.companyName || job.company?.name}</span>
                                                        <span style={{ fontSize: '13px', color: '#8080a8' }}>📍 {job.location}</span>
                                                        <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 600 }}>💰 {job.salary?.min?.toLocaleString()} - {job.salary?.max?.toLocaleString()} {job.salary?.currency}</span>
                                                    </div>

                                                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                        {(job.skills || []).slice(0, 4).map(function (skill) {
                                                            return (
                                                                <span key={skill} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: '#1e1e3a', color: '#8080c8', border: '1px solid #2e2e4e' }}>{skill}</span>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                                                    <span style={{ fontSize: '11px', color: '#6060a0' }}>
                                                        {new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                    <span style={{ padding: '8px 18px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '12px' }}>
                                                        Apply →
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Pagination */}
                            {pages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '1rem' }}>
                                    {Array.from({ length: pages }, function (_, i) { return i + 1; }).map(function (p) {
                                        return (
                                            <button key={p} onClick={function () { setPage(p); }}
                                                style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid', borderColor: page === p ? '#8b5cf6' : '#2e2e4e', background: page === p ? '#8b5cf620' : 'transparent', color: page === p ? '#a78bfa' : '#8080a8', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>
                                                {p}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}