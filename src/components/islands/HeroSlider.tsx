import { useState, useEffect, useCallback } from 'react';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&q=85&auto=format&fit=crop',
    title: 'Escape to Paradise',
    subtitle: 'Overwater Villas',
    caption: 'Bora Bora, French Polynesia',
  },
  {
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&q=85&auto=format&fit=crop',
    title: 'Infinite Horizons',
    subtitle: 'Clifftop Suites',
    caption: 'Santorini, Greece',
  },
  {
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&q=85&auto=format&fit=crop',
    title: 'Timeless Elegance',
    subtitle: 'Grand Estate',
    caption: 'Tuscany, Italy',
  },
  {
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920&q=85&auto=format&fit=crop',
    title: 'Urban Sanctuary',
    subtitle: 'Penthouse Collection',
    caption: 'Dubai, UAE',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [loaded, setLoaded] = useState<boolean[]>(slides.map((_, i) => i === 0));

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      setAnimating(true);
      setTimeout(() => {
        setCurrent(idx);
        setLoaded((prev) => {
          const next = [...prev];
          next[idx] = true;
          return next;
        });
        setAnimating(false);
      }, 600);
    },
    [animating]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [current, goTo]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
      }}
    >
      {slides.map((slide, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: 0,
            transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)',
            opacity: i === current ? 1 : 0,
          }}
        >
          {loaded[i] && (
            <img
              src={slide.image}
              alt={slide.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
                transform: i === current ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 8s ease-out',
              }}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          )}
        </div>
      ))}

      {/* Gradient overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, rgba(8,8,8,0.65) 0%, rgba(8,8,8,0.2) 60%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(8,8,8,0.8) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Slide caption bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: '7rem',
          right: '2rem',
          textAlign: 'right',
        }}
      >
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.8)',
            marginBottom: '0.25rem',
          }}
        >
          {slides[current].subtitle}
        </p>
        <p
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.7rem',
            color: 'rgba(255,255,255,0.5)',
            letterSpacing: '0.1em',
          }}
        >
          {slides[current].caption}
        </p>
      </div>

      {/* Slide indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '0.5rem',
          alignItems: 'center',
        }}
      >
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === current ? '2rem' : '0.35rem',
              height: '0.35rem',
              background: i === current ? '#c9a84c' : 'rgba(255,255,255,0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              borderRadius: '2px',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Arrow controls */}
      {([
        { dir: -1, label: '←', side: 'left' },
        { dir: 1, label: '→', side: 'right' },
      ] as const).map(({ dir, label, side }) => (
        <button
          key={side}
          onClick={() => goTo((current + dir + slides.length) % slides.length)}
          aria-label={`${side} slide`}
          style={{
            position: 'absolute',
            top: '50%',
            [side]: '1.5rem',
            transform: 'translateY(-50%)',
            width: '2.75rem',
            height: '2.75rem',
            border: '1px solid rgba(201,168,76,0.4)',
            background: 'rgba(8,8,8,0.3)',
            backdropFilter: 'blur(8px)',
            color: '#c9a84c',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.2)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#c9a84c';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,8,8,0.3)';
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(201,168,76,0.4)';
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
