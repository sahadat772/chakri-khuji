'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(function () {
        async function fetchCompanies() {
            try {
                const res = await fetch('/api/companies');
                const data = await res.json();
                setCompanies(data.companies || []);
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        }
        fetchCompanies();
    }, []);

    const filtered = companies.filter(function (c) {
        return c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
            c.location?.toLowerCase().includes(search.toLowerCase());
    });

    const colors = ['#8b5cf6', '#22d3ee', '#fbbf24', '#34d399', '#f87171', '#a78bfa'];

    return (
        <div style={{ minHeight: '100vh', paddingTop: '5rem' }}>

            {/* Header */}
            <div style={{ background: '#0d0d18', borderBottom: '1px solid #2e2e4e', padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, marginBottom: '1.5rem', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa' }}>
                        🏢 Top Companies
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, marginBottom: '1rem', color: '#f0f0ff' }}>
                        Discover Amazing{' '}
                        <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Companies</span>
                    </h1>
                    <p style={{ color: '#8080a8', marginBottom: '2rem', fontSize: '15px' }}>
                        Explore top companies hiring in Bangladesh right now
                    </p>

                    {/* Search */}
                    <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', gap: '8px', background: '#13131f', border: '1px solid #2e2e4e', borderRadius: '14px', padding: '8px' }}>
                        <span style={{ fontSize: '1.1rem', padding: '0 8px', display: 'flex', alignItems: 'center' }}>🔍</span>
                        <input
                            type="text"
                            value={search}
                            onChange={function (e) { setSearch(e.target.value); }}
                            placeholder="Search companies..."
                            style={{ flex: 1, background: 'transparent', border: 'none', color: '#f0f0ff', fontSize: '14px', outline: 'none', padding: '8px 0' }}
                        />
                    </div>
                </div>
            </div>

            {/* Companies Grid */}
            <section style={{ padding: '3rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="md:grid-cols-3 lg:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
                                return <div key={i} className="skeleton" style={{ height: '200px', borderRadius: '20px' }} />;
                            })}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '0.5rem' }}>
                                {search ? 'No companies found' : 'No companies yet'}
                            </h3>
                            <p style={{ color: '#8080a8', fontSize: '14px', marginBottom: '1.5rem' }}>
                                {search ? 'Try a different search term' : 'Be the first company to join!'}
                            </p>
                            {!search && (
                                <Link href="/signup" style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
                                    Register Your Company
                                </Link>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }} className="md:grid-cols-3 lg:grid-cols-4">
                            {filtered.map(function (company, i) {
                                const color = colors[i % colors.length];
                                return (
                                    <Link key={company._id} href={'/jobs?company=' + company._id} style={{ textDecoration: 'none' }}>
                                        <div style={{ padding: '1.75rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                                            onMouseEnter={function (e) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                                            onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; e.currentTarget.style.transform = 'translateY(0)'; }}>

                                            <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem', border: '1px solid ' + color + '40', overflow: 'hidden' }}>
                                                {company.companyLogo ? (
                                                    <img src={company.companyLogo} alt={company.companyName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : '🏢'}
                                            </div>

                                            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '6px', fontSize: '15px' }}>
                                                {company.companyName || company.name}
                                            </h3>

                                            {company.location && (
                                                <p style={{ fontSize: '12px', color: '#8080a8', marginBottom: '8px' }}>📍 {company.location}</p>
                                            )}

                                            {company.companySize && (
                                                <p style={{ fontSize: '12px', color: '#6060a0', marginBottom: '10px' }}>👥 {company.companySize} employees</p>
                                            )}

                                            <div style={{ display: 'inline-block', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: color + '20', color: color, border: '1px solid ' + color + '40' }}>
                                                View Jobs →
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA for companies */}
            <section style={{ padding: '4rem 1.5rem', background: '#0d0d18' }}>
                <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ padding: '3rem 2rem', borderRadius: '24px', background: 'linear-gradient(135deg, #8b5cf615, #22d3ee15)', border: '1px solid #8b5cf630' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#f0f0ff', marginBottom: '1rem' }}>
                            Is Your Company{' '}
                            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Hiring?</span>
                        </h2>
                        <p style={{ color: '#8080a8', marginBottom: '2rem', lineHeight: 1.8, fontSize: '14px' }}>
                            Post your jobs and reach thousands of talented professionals across Bangladesh.
                        </p>
                        <Link href="/signup" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                            Register Your Company →
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}