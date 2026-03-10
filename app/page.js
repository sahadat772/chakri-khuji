'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Footer from './components/ui/Footer';
import Navbar from './components/ui/Navbar';

const stats = [
  { value: '10K+', label: 'Active Jobs' },
  { value: '5K+', label: 'Companies' },
  { value: '50K+', label: 'Job Seekers' },
  { value: '95%', label: 'Success Rate' },
];

const categories = [
  { icon: '💻', label: 'Technology', count: '2,450 jobs', color: '#8b5cf6' },
  { icon: '🎨', label: 'Design', count: '1,230 jobs', color: '#22d3ee' },
  { icon: '📈', label: 'Marketing', count: '980 jobs', color: '#fbbf24' },
  { icon: '💰', label: 'Finance', count: '756 jobs', color: '#34d399' },
  { icon: '🤝', label: 'Sales', count: '1,100 jobs', color: '#f87171' },
  { icon: '👥', label: 'HR', count: '430 jobs', color: '#a78bfa' },
];

const featuredJobs = [
  {
    title: 'Senior React Developer',
    company: 'TechCorp BD',
    location: 'Dhaka',
    type: 'Full-time',
    salary: '80K - 120K BDT',
    tags: ['React', 'Next.js', 'TypeScript'],
    color: '#8b5cf6',
    remote: true,
  },
  {
    title: 'UI/UX Designer',
    company: 'Creative Agency',
    location: 'Remote',
    type: 'Full-time',
    salary: '60K - 90K BDT',
    tags: ['Figma', 'Adobe XD', 'Prototyping'],
    color: '#22d3ee',
    remote: true,
  },
  {
    title: 'Digital Marketing Manager',
    company: 'GrowthHub',
    location: 'Chittagong',
    type: 'Full-time',
    salary: '50K - 75K BDT',
    tags: ['SEO', 'Social Media', 'Analytics'],
    color: '#fbbf24',
    remote: false,
  },
];

const roles = ['Dream Job', 'Next Career', 'Future Role', 'Perfect Match'];

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const current = roles[roleIndex];
    let t;
    if (typing) {
      if (displayed.length < current.length) {
        t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80);
      } else {
        t = setTimeout(() => setTyping(false), 2000);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40);
      } else {
        t = setTimeout(() => {
          setRoleIndex((roleIndex + 1) % roles.length);
          setTyping(true);
        }, 100);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, typing, roleIndex]);

  return (

    <>

      <Navbar />
      <div style={{ minHeight: '100vh' }}>

        {/* HERO */}
        <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 1rem 4rem', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.03, backgroundImage: 'linear-gradient(#f0f0ff 1px, transparent 1px), linear-gradient(90deg, #f0f0ff 1px, transparent 1px)', backgroundSize: '60px 60px', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '72rem', margin: '0 auto', width: '100%' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '9999px', fontSize: '13px', fontWeight: 600, marginBottom: '2rem', background: '#8b5cf620', border: '1px solid #8b5cf640', color: '#a78bfa' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                Bangladesh No.1 Job Platform
              </div>

              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '1.5rem', color: '#f0f0ff' }}>
                Find Your{' '}
                <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  {displayed}
                  <span style={{ opacity: 1 }}>|</span>
                </span>
                <br />
                in Bangladesh
              </h1>

              <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: '#a0a0c8', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
                Connect with top companies and land your dream job. Thousands of opportunities waiting for talented professionals like you.
              </p>

              {/* Search Box */}
              <div style={{ maxWidth: '680px', margin: '0 auto 3rem', background: '#13131f', border: '1px solid #2e2e4e', borderRadius: '16px', padding: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '1.2rem', padding: '0 12px' }}>🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={function (e) { setSearch(e.target.value); }}
                  placeholder="Job title, keyword or company..."
                  style={{ flex: 1, background: 'transparent', border: 'none', color: '#f0f0ff', fontSize: '15px', outline: 'none', padding: '10px 0' }}
                />
                <Link href={'/jobs?q=' + search}
                  style={{ padding: '12px 28px', borderRadius: '12px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>
                  Search Jobs
                </Link>
              </div>

              {/* Popular searches */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '4rem' }}>
                <span style={{ fontSize: '13px', color: '#6060a0' }}>Popular:</span>
                {['React Developer', 'UI Designer', 'Project Manager', 'Data Analyst', 'Internship'].map(function (tag) {
                  return (
                    <Link key={tag} href={'/jobs?q=' + tag}
                      style={{ padding: '6px 14px', borderRadius: '8px', fontSize: '13px', fontWeight: 500, background: '#1e1e3a', border: '1px solid #2e2e4e', color: '#a0a0c8', textDecoration: 'none' }}>
                      {tag}
                    </Link>
                  );
                })}
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', maxWidth: '600px', margin: '0 auto' }} className="md:grid-cols-4">
                {stats.map(function (stat, i) {
                  return (
                    <div key={i} style={{ padding: '1.25rem', borderRadius: '14px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.8rem', fontWeight: 900, background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
                      <div style={{ fontSize: '12px', color: '#6060a0', marginTop: '4px' }}>{stat.label}</div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section style={{ padding: '6rem 1rem', background: '#0d0d18' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: '1rem' }}>Browse by Category</div>
              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff' }}>
                Explore Job{' '}
                <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Categories</span>
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }} className="md:grid-cols-3 lg:grid-cols-6">
              {categories.map(function (cat) {
                return (
                  <Link key={cat.label} href={'/jobs?category=' + cat.label.toLowerCase()}
                    style={{ padding: '1.5rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center', textDecoration: 'none', transition: 'all 0.2s', display: 'block' }}
                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{cat.icon}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0f0ff', marginBottom: '4px' }}>{cat.label}</div>
                    <div style={{ fontSize: '12px', color: cat.color }}>{cat.count}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* FEATURED JOBS */}
        <section style={{ padding: '6rem 1rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: '0.5rem' }}>Latest Opportunities</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff' }}>
                  Featured{' '}
                  <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Jobs</span>
                </h2>
              </div>
              <Link href="/jobs" style={{ padding: '12px 24px', borderRadius: '12px', border: '1px solid #2e2e4e', color: '#a0a0c8', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
                View All Jobs →
              </Link>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {featuredJobs.map(function (job, i) {
                return (
                  <div key={i}
                    style={{ padding: '1.5rem 2rem', borderRadius: '16px', background: '#13131f', border: '1px solid #2e2e4e', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = job.color; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; e.currentTarget.style.transform = 'translateX(0)'; }}>

                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: job.color, borderRadius: '3px 0 0 3px' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: 800, color: '#f0f0ff' }}>{job.title}</h3>
                          {job.remote && (
                            <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: '#34d39920', color: '#34d399', border: '1px solid #34d39940' }}>Remote</span>
                          )}
                          <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, background: job.color + '20', color: job.color, border: '1px solid ' + job.color + '40' }}>{job.type}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                          <span style={{ fontSize: '13px', color: '#8080a8', display: 'flex', alignItems: 'center', gap: '4px' }}>🏢 {job.company}</span>
                          <span style={{ fontSize: '13px', color: '#8080a8', display: 'flex', alignItems: 'center', gap: '4px' }}>📍 {job.location}</span>
                          <span style={{ fontSize: '13px', color: '#34d399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>💰 {job.salary}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          {job.tags.map(function (tag) {
                            return (
                              <span key={tag} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: '#1e1e3a', color: '#8080c8', border: '1px solid #2e2e4e' }}>{tag}</span>
                            );
                          })}
                        </div>
                      </div>

                      <Link href="/jobs" style={{ padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '13px', textDecoration: 'none', whiteSpace: 'nowrap', alignSelf: 'center' }}>
                        Apply Now
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section style={{ padding: '6rem 1rem', background: '#0d0d18' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto', textAlign: 'center' }}>

            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#8b5cf6', marginBottom: '1rem' }}>Simple Process</div>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff', marginBottom: '1rem' }}>
              How It{' '}
              <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Works</span>
            </h2>
            <p style={{ color: '#8080a8', maxWidth: '500px', margin: '0 auto 4rem', lineHeight: 1.8 }}>Get started in minutes. Our streamlined process makes job hunting effortless.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '1.5rem' }} className="md:grid-cols-3">
              {[
                { step: '01', icon: '✍️', title: 'Create Account', desc: 'Sign up as a job seeker or company in under 2 minutes.', color: '#8b5cf6' },
                { step: '02', icon: '🔍', title: 'Find & Apply', desc: 'Browse thousands of jobs and apply with one click.', color: '#22d3ee' },
                { step: '03', icon: '🎉', title: 'Get Hired', desc: 'Land your dream job and kickstart your career.', color: '#fbbf24' },
              ].map(function (item) {
                return (
                  <div key={item.step} style={{ padding: '2rem', borderRadius: '20px', background: '#13131f', border: '1px solid #2e2e4e', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', fontFamily: 'Syne, sans-serif', fontSize: '3rem', fontWeight: 900, color: item.color, opacity: 0.1 }}>{item.step}</div>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: item.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1.5rem', border: '1px solid ' + item.color + '40' }}>{item.icon}</div>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 800, color: '#f0f0ff', marginBottom: '0.75rem' }}>{item.title}</h3>
                    <p style={{ fontSize: '14px', color: '#8080a8', lineHeight: 1.7 }}>{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '6rem 1rem' }}>
          <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
            <div style={{ borderRadius: '24px', padding: '4rem 2rem', textAlign: 'center', background: 'linear-gradient(135deg, #8b5cf615, #22d3ee15)', border: '1px solid #8b5cf630', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: '#8b5cf620', filter: 'blur(60px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: '#22d3ee20', filter: 'blur(60px)', pointerEvents: 'none' }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#f0f0ff', marginBottom: '1rem' }}>
                  Ready to Find Your
                  <span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginLeft: '12px' }}>Dream Job?</span>
                </h2>
                <p style={{ color: '#8080a8', maxWidth: '500px', margin: '0 auto 2.5rem', lineHeight: 1.8, fontSize: '15px' }}>
                  Join over 50,000 professionals who found their perfect career match on Chakri Khujhi.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/signup" style={{ padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                    Get Started Free
                  </Link>
                  <Link href="/jobs" style={{ padding: '14px 32px', borderRadius: '14px', border: '1px solid #2e2e4e', color: '#a0a0c8', fontWeight: 700, fontSize: '15px', textDecoration: 'none' }}>
                    Browse Jobs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}
