import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #2e2e4e', padding: '3rem 1.5rem', background: '#0d0d18' }}>
      <div style={{ maxWidth: '72rem', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>💼</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 900, fontSize: '1.1rem', color: '#f0f0ff' }}>
            Chakri<span style={{ background: 'linear-gradient(135deg, #8b5cf6, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Khujhi</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Find Jobs', href: '/jobs' },
            { label: 'Post a Job', href: '/signup' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ].map(function (link) {
            return (
              <Link key={link.label} href={link.href}
                style={{ fontSize: '13px', color: '#6060a0', textDecoration: 'none' }}>
                {link.label}
              </Link>
            );
          })}
        </div>

        <p style={{ fontSize: '12px', color: '#3a3a5a' }}>
          © 2024 ChhakriKhujhi. Built with ❤️ for Bangladesh.
        </p>
      </div>
    </footer>
  );
}