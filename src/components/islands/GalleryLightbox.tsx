import { useState } from 'react';

const photos = [
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80&auto=format&fit=crop', alt: 'Luxury pool at sunset', span: 'wide' },
  { src: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80&auto=format&fit=crop', alt: 'Hotel lobby', span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80&auto=format&fit=crop', alt: 'Fine dining', span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=600&q=80&auto=format&fit=crop', alt: 'Spa treatment', span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&q=80&auto=format&fit=crop', alt: 'Suite interior', span: 'normal' },
  { src: 'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=900&q=80&auto=format&fit=crop', alt: 'Beach cabana', span: 'wide' },
];

export default function GalleryLightbox() {
  const [active, setActive] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  function prev() {
    if (active === null) return;
    setActive((active - 1 + photos.length) % photos.length);
  }
  function next() {
    if (active === null) return;
    setActive((active + 1) % photos.length);
  }

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
        }}
      >
        {photos.map((photo, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              gridColumn: photo.span === 'wide' ? 'span 2' : 'span 1',
              height: photo.span === 'wide' ? '260px' : '200px',
              overflow: 'hidden',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
                transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(8,8,8,0.4)',
                opacity: hovered === i ? 1 : 0,
                transition: 'opacity 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: '1.5rem', color: '#c9a84c' }}>⊕</span>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                left: '0.75rem',
                opacity: hovered === i ? 1 : 0,
                transition: 'opacity 0.3s',
              }}
            >
              <p
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.65rem',
                  color: 'rgba(255,255,255,0.85)',
                  letterSpacing: '0.1em',
                }}
              >
                {photo.alt}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          onClick={(e) => e.target === e.currentTarget && setActive(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(4,4,4,0.97)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <button
            onClick={() => setActive(null)}
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '1.5rem',
              background: 'none',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#c9a84c',
              width: '2.5rem',
              height: '2.5rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>

          <button
            onClick={prev}
            style={{
              position: 'absolute',
              left: '1.5rem',
              background: 'rgba(8,8,8,0.5)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#c9a84c',
              width: '3rem',
              height: '3rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>

          <div style={{ maxWidth: '85vw', maxHeight: '85vh', position: 'relative' }}>
            <img
              src={photos[active].src.replace('w=600', 'w=1400').replace('w=900', 'w=1400')}
              alt={photos[active].alt}
              style={{
                maxWidth: '100%',
                maxHeight: '80vh',
                objectFit: 'contain',
                boxShadow: '0 0 80px rgba(0,0,0,0.8)',
              }}
            />
            <p
              style={{
                marginTop: '1rem',
                textAlign: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.7rem',
                color: '#777',
                letterSpacing: '0.1em',
              }}
            >
              {photos[active].alt} — {active + 1} / {photos.length}
            </p>
          </div>

          <button
            onClick={next}
            style={{
              position: 'absolute',
              right: '1.5rem',
              background: 'rgba(8,8,8,0.5)',
              border: '1px solid rgba(201,168,76,0.3)',
              color: '#c9a84c',
              width: '3rem',
              height: '3rem',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            →
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(3"] {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </>
  );
}
