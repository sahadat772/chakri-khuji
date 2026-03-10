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

    useEffect(() => {
        const handleScroll = function () {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            padding: '0 1.5rem',
            background: scrolled ? 'rgba(10,10,15,0.9)' : 'transparent',
            backdropFilter: scrolled ? 'blur(12px)' : 'none',
            borderBottom: scrolled ? '1px solid #2e2e4e' : '1px solid transparent',
            transition: 'all 0.3s ease',
        }}>
            <div style={{ maxWidth: '72rem', margin: '0 auto', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

                {/* Logo */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>💼</div>
                    <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.2rem', color: '#f0f0ff' }}>
                        Chakri<span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Khujhi</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
                    {navLinks.map(function (link) {
                        return (
                            <Link key={link.href} href={link.href}
                                style={{ fontSize: '14px', fontWeight: 500, color: pathname === link.href ? '#a78bfa' : '#a0a0c8', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseEnter={function (e) { e.target.style.color = '#f0f0ff'; }}
                                onMouseLeave={function (e) { e.target.style.color = pathname === link.href ? '#a78bfa' : '#a0a0c8'; }}>
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Auth Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} className="hidden md:flex">
                    {session ? (
                        <>
                            <Link href="/dashboard"
                                style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#a78bfa', border: '1px solid #8b5cf640', textDecoration: 'none', background: '#8b5cf610' }}>
                                Dashboard
                            </Link>
                            <button onClick={function () { signOut({ callbackUrl: '/' }); }}
                                style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#8080a8', border: '1px solid #2e2e4e', background: 'transparent', cursor: 'pointer' }}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login"
                                style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, color: '#a0a0c8', border: '1px solid #2e2e4e', textDecoration: 'none' }}>
                                Sign In
                            </Link>
                            <Link href="/signup"
                                style={{ padding: '8px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', textDecoration: 'none' }}>
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button onClick={function () { setMenuOpen(!menuOpen); }}
                    style={{ display: 'none', background: 'none', border: 'none', color: '#f0f0ff', fontSize: '1.5rem', cursor: 'pointer' }}
                    className="md:hidden block">
                    {menuOpen ? '✕' : '☰'}
                </button>

            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div style={{ background: '#0d0d18', border: '1px solid #2e2e4e', borderRadius: '16px', padding: '1.5rem', margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {navLinks.map(function (link) {
                        return (
                            <Link key={link.href} href={link.href} onClick={function () { setMenuOpen(false); }}
                                style={{ fontSize: '15px', fontWeight: 500, color: '#a0a0c8', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #1e1e3a' }}>
                                {link.label}
                            </Link>
                        );
                    })}
                    {session ? (
                        <Link href="/dashboard" style={{ padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                            Dashboard
                        </Link>
                    ) : (
                        <Link href="/signup" style={{ padding: '12px', borderRadius: '10px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', color: 'white', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
                            Get Started
                        </Link>
                    )}
                </div>
            )}
        </nav>
    );
}