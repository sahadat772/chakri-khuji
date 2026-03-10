'use client';

import Link from 'next/link';

const stats = [
    { value: '10K+', label: 'Active Jobs', icon: '💼', color: '#8b5cf6' },
    { value: '5K+', label: 'Companies', icon: '🏢', color: '#22d3ee' },
    { value: '50K+', label: 'Job Seekers', icon: '👥', color: '#fbbf24' },
    { value: '95%', label: 'Success Rate', icon: '🎯', color: '#34d399' },
];

const team = [
    { name: 'Sahadat Hossain', role: 'Founder & Developer', emoji: '👨‍💻', color: '#8b5cf6' },
    { name: 'Tech Team', role: 'Backend Engineers', emoji: '⚙️', color: '#22d3ee' },
    { name: 'Design Team', role: 'UI/UX Designers', emoji: '🎨', color: '#fbbf24' },
];

const values = [
    { icon: '🎯', title: 'Mission', desc: 'To connect every talented professional in Bangladesh with their dream job opportunity.', color: '#8b5cf6' },
    { icon: '👁️', title: 'Vision', desc: 'To become the most trusted job platform in Bangladesh by 2026.', color: '#22d3ee' },
    { icon: '💎', title: 'Values', desc: 'Transparency, innovation, and empowering careers through technology.', color: '#fbbf24' },
];

export default function AboutPage() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '5rem' }}>

            {/* Hero */}
            <section style={{ padding: '5rem 1.5rem', textAlign: 'center', background: '#0d0d18', borderBottom: '1px solid #2e2e4e', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '500px', borderRadius: '50%', background: '#8b5cf610', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'relative', zIndex: 1, maxWidth: '48rem', margin: '0 auto' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, marginBottom: '1.5rem', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa' }}>
                        🚀 Our Story
                    </div>
                    <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: '#f0f0ff' }}>
                        Building Bangladesh&lsquo;s{' '}
                        <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Best Job Platform</span>
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#8080a8', lineHeight: 1.8, marginBottom: '2rem' }}>
                        Chakri Khujhi was born from a simple idea — every talented person in Bangladesh deserves access to the best career opportunities, and every great company deserves to find the perfect talent.
                    </p>
                    <Link href="/jobs" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                        Explore Jobs →
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section style={{ padding: '4rem 1.5rem' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md:grid-cols-4">
                    {stats.map(function (stat) {
                        return (
                            <div key={stat.label} style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{stat.icon}</div>
                                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.5rem', fontWeight: 900, color: stat.color, marginBottom: '4px' }}>{stat.value}</div>
                                <div style={{ fontSize: '13px', color: '#8080a8' }}>{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Mission Vision Values */}
            <section style={{ padding: '4rem 1.5rem', background: '#0d0d18' }}>
                <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: '0.75rem' }}>What Drives Us</div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff' }}>
                            Our{' '}
                            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Purpose</span>
                        </h2>
                    </div>
                    <div style={{ display: 'grid', gap: '1.5rem' }} className="md:grid-cols-3">
                        {values.map(function (item) {
                            return (
                                <div key={item.title} style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: item.color }} />
                                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: item.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', marginBottom: '1.25rem', border: '1px solid ' + item.color + '40' }}>
                                        {item.icon}
                                    </div>
                                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#f0f0ff', marginBottom: '0.75rem', fontSize: '1.1rem' }}>{item.title}</h3>
                                    <p style={{ fontSize: '14px', color: '#8080a8', lineHeight: 1.75 }}>{item.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section style={{ padding: '5rem 1.5rem' }}>
                <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: '0.75rem' }}>How It Started</div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff' }}>
                            The{' '}
                            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Story</span>
                        </h2>
                    </div>
                    <div style={{ padding: '2.5rem', borderRadius: '24px', background: '#13131f', border: '1px solid #2e2e4e' }}>
                        {[
                            { year: '2024', text: 'Chakri Khujhi was founded with a vision to revolutionize job hunting in Bangladesh. We noticed a gap — talented professionals struggling to find opportunities, and companies unable to reach the right candidates.' },
                            { year: '2025', text: 'We launched our platform with core features: job listings, company profiles, and an AI-powered career assistant to help candidates prepare for interviews and build better resumes.' },
                            { year: '2026', text: 'Today, we are growing rapidly with thousands of active users. Our AI chatbot has helped hundreds of candidates land their dream jobs across Bangladesh.' },
                        ].map(function (item, i) {
                            return (
                                <div key={i} style={{ display: 'flex', gap: '1.5rem', marginBottom: i < 2 ? '2rem' : 0, paddingBottom: i < 2 ? '2rem' : 0, borderBottom: i < 2 ? '1px solid #2e2e4e' : 'none' }}>
                                    <div style={{ flexShrink: 0 }}>
                                        <div style={{ padding: '6px 14px', borderRadius: '8px', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa', fontSize: '13px', fontWeight: 700, fontFamily: 'monospace' }}>{item.year}</div>
                                    </div>
                                    <p style={{ fontSize: '15px', color: '#a0a0c8', lineHeight: 1.8 }}>{item.text}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section style={{ padding: '5rem 1.5rem', background: '#0d0d18' }}>
                <div style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}>
                    <div style={{ padding: '3rem 2rem', borderRadius: '24px', background: 'linear-gradient(135deg, #8b5cf615, #22d3ee15)', border: '1px solid #8b5cf630' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 900, color: '#f0f0ff', marginBottom: '1rem' }}>
                            Join Our{' '}
                            <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Community</span>
                        </h2>
                        <p style={{ color: '#8080a8', marginBottom: '2rem', lineHeight: 1.8 }}>Whether you are looking for a job or hiring talent, Chakri Khujhi is your platform.</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <Link href="/signup" style={{ padding: '14px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none' }}>Get Started Free</Link>
                            <Link href="/contact" style={{ padding: '14px 28px', borderRadius: '12px', border: '1px solid #2e2e4e', color: '#a0a0c8', fontWeight: 700, textDecoration: 'none' }}>Contact Us</Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}