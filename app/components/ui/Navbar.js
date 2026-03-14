'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const navLinks = [
    { label: 'Find Jobs', href: '/jobs' },
    { label: 'Companies', href: '/companies' },
    { label: 'About', href: '/about' },
];

export default function Navbar() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(function () {
        function onScroll() { setScrolled(window.scrollY > 20); }
        function onResize() {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setMenuOpen(false);
        }
        onResize();
        window.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);
        return function () {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0 1.5rem',
            background: scrolled ? 'rgba(10,10,15,0.92)' : 'transparent',
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderBottom: scrolled ? '1px solid #2e2e4e' : '1px solid transparent',
            transition: 'all 0.3s ease',
        }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>💼</div>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#f0f0ff' }}>
                        Chakri<span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Khujhi</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {navLinks.map(function (link) {
                            const isActive = pathname === link.href;
                            return (
                                <Link key={link.href} href={link.href}
                                    style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#a78bfa' : '#a0a0c8', textDecoration: 'none', transition: 'color 0.2s', position: 'relative', paddingBottom: '4px' }}
                                    onMouseEnter={function (e) { e.currentTarget.style.color = '#f0f0ff'; }}
                                    onMouseLeave={function (e) { e.currentTarget.style.color = isActive ? '#a78bfa' : '#a0a0c8'; }}>
                                    {link.label}
                                    {isActive && (
                                        <span style={{ position: 'absolute', bottom: '-2px', left: 0, right: 0, height: '2px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', borderRadius: '99px' }} />
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                )}

                {/* Desktop Auth */}
                {!isMobile && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {session ? (
                            <>
                                <Link href="/dashboard"
                                    style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#a78bfa', border: '1px solid #8b5cf640', textDecoration: 'none', background: '#8b5cf610', transition: 'all 0.2s' }}
                                    onMouseEnter={function (e) { e.currentTarget.style.background = '#8b5cf620'; e.currentTarget.style.borderColor = '#8b5cf680'; }}
                                    onMouseLeave={function (e) { e.currentTarget.style.background = '#8b5cf610'; e.currentTarget.style.borderColor = '#8b5cf640'; }}>
                                    Dashboard
                                </Link>
                                <button onClick={function () { signOut({ callbackUrl: '/' }); }}
                                    style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#8080a8', border: '1px solid #2e2e4e', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
                                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; e.currentTarget.style.color = '#8080a8'; }}>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login"
                                    style={{ padding: '8px 18px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#a0a0c8', border: '1px solid #2e2e4e', textDecoration: 'none', transition: 'all 0.2s' }}
                                    onMouseEnter={function (e) { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#a78bfa'; }}
                                    onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; e.currentTarget.style.color = '#a0a0c8'; }}>
                                    Sign In
                                </Link>
                                <Link href="/signup"
                                    style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', textDecoration: 'none', transition: 'all 0.2s' }}
                                    onMouseEnter={function (e) { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                    onMouseLeave={function (e) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                )}

                {/* Mobile Hamburger */}
                {isMobile && (
                    <button onClick={function () { setMenuOpen(function (o) { return !o; }); }}
                        style={{ background: '#1a1a2e', border: '1px solid #2e2e4e', borderRadius: '10px', width: '40px', height: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                        onMouseEnter={function (e) { e.currentTarget.style.borderColor = '#8b5cf6'; }}
                        onMouseLeave={function (e) { e.currentTarget.style.borderColor = '#2e2e4e'; }}>
                        <span style={{ width: '16px', height: '2px', background: menuOpen ? '#a78bfa' : '#a0a0c8', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                        <span style={{ width: '16px', height: '2px', background: '#a0a0c8', borderRadius: '2px', transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
                        <span style={{ width: '16px', height: '2px', background: menuOpen ? '#a78bfa' : '#a0a0c8', borderRadius: '2px', transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
                    </button>
                )}
            </div>

            {/* Mobile Dropdown */}
            {isMobile && menuOpen && (
                <div style={{
                    background: 'rgba(13,13,24,0.97)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid #2e2e4e',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    margin: '0 0 1rem',
                    display: 'flex', flexDirection: 'column', gap: '4px',
                    animation: 'fadeInDown 0.2s ease',
                }}>
                    {navLinks.map(function (link) {
                        const isActive = pathname === link.href;
                        return (
                            <Link key={link.href} href={link.href} onClick={function () { setMenuOpen(false); }}
                                style={{ fontSize: '14px', fontWeight: 600, color: isActive ? '#a78bfa' : '#a0a0c8', textDecoration: 'none', padding: '11px 14px', borderRadius: '10px', background: isActive ? '#8b5cf615' : 'transparent', transition: 'all 0.15s' }}
                                onMouseEnter={function (e) { if (!isActive) e.currentTarget.style.background = '#ffffff08'; }}
                                onMouseLeave={function (e) { if (!isActive) e.currentTarget.style.background = 'transparent'; }}>
                                {link.label}
                            </Link>
                        );
                    })}

                    <div style={{ borderTop: '1px solid #2e2e4e', marginTop: '8px', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {session ? (
                            <>
                                <Link href="/dashboard" onClick={function () { setMenuOpen(false); }}
                                    style={{ padding: '12px', borderRadius: '10px', background: '#8b5cf615', border: '1px solid #8b5cf640', color: '#a78bfa', fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                                    Dashboard
                                </Link>
                                <button onClick={function () { signOut({ callbackUrl: '/' }); setMenuOpen(false); }}
                                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #2e2e4e', color: '#8080a8', fontWeight: 600, background: 'transparent', cursor: 'pointer', fontSize: '14px' }}>
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <Link href="/login" onClick={function () { setMenuOpen(false); }}
                                    style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #2e2e4e', color: '#a0a0c8', fontWeight: 600, textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                                    Sign In
                                </Link>
                                <Link href="/signup" onClick={function () { setMenuOpen(false); }}
                                    style={{ flex: 1, padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none', textAlign: 'center', fontSize: '14px' }}>
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}