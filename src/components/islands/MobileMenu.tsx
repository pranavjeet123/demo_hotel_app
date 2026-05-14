import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Rooms & Suites', href: '#rooms' },
  { label: 'Amenities', href: '#amenities' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Contact', href: '#contact' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: scrolled ? '0.85rem 2rem' : '1.5rem 2rem',
          background: scrolled
            ? 'rgba(8,8,8,0.92)'
            : 'linear-gradient(to bottom, rgba(8,8,8,0.7) 0%, transparent 100%)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.1)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1.6rem',
            fontWeight: 300,
            letterSpacing: '0.1em',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            lineHeight: 1,
          }}
        >
          <span style={{ color: '#c9a84c', fontSize: '0.6rem', letterSpacing: '0.3em', fontFamily: 'Inter, sans-serif', fontWeight: 500, textTransform: 'uppercase', marginBottom: '0.2rem' }}>
            Est. 1998
          </span>
          ISLAND ARCHITECTURE
        </a>

        {/* Desktop nav */}
        <ul
          style={{
            display: 'flex',
            gap: '2.5rem',
            listStyle: 'none',
            alignItems: 'center',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.72rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,240,232,0.8)',
                  transition: 'color 0.3s',
                  fontWeight: 400,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245,240,232,0.8)')}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#booking"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#080808',
                background: '#c9a84c',
                padding: '0.6rem 1.5rem',
                fontWeight: 500,
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#e8c96f')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#c9a84c')}
            >
              Book Now
            </a>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="hamburger"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '4px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                width: '24px',
                height: '1px',
                background: '#fff',
                transition: 'all 0.3s',
                transformOrigin: 'center',
                transform:
                  open
                    ? i === 0
                      ? 'rotate(45deg) translate(4px, 4px)'
                      : i === 2
                      ? 'rotate(-45deg) translate(4px, -4px)'
                      : 'scaleX(0)'
                    : 'none',
                opacity: open && i === 1 ? 0 : 1,
              }}
            />
          ))}
        </button>
      </nav>

      {/* Mobile drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 999,
          background: 'rgba(8,8,8,0.98)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2rem',
          transition: 'opacity 0.4s, transform 0.4s',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0)' : 'translateY(-100%)',
          pointerEvents: open ? 'all' : 'none',
        }}
      >
        {navLinks.map((link, i) => (
          <a
            key={link.label}
            href={link.href}
            onClick={() => setOpen(false)}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.5rem',
              fontWeight: 300,
              color: '#fff',
              letterSpacing: '0.05em',
              transition: 'color 0.3s',
              transitionDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#c9a84c')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#fff')}
          >
            {link.label}
          </a>
        ))}
        <a
          href="#booking"
          onClick={() => setOpen(false)}
          style={{
            marginTop: '1rem',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#080808',
            background: '#c9a84c',
            padding: '1rem 3rem',
            fontWeight: 500,
          }}
        >
          Book Your Stay
        </a>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
