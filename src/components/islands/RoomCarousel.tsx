import { useState, useRef } from 'react';

const rooms = [
  {
    name: 'Overwater Villa',
    category: 'Signature Collection',
    price: 1480,
    size: '120 m²',
    guests: 2,
    image: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800&q=80&auto=format&fit=crop',
    amenities: ['Private Pool', 'Ocean Views', 'Butler Service', 'Sun Deck'],
    badge: 'Most Popular',
  },
  {
    name: 'Grand Suite',
    category: 'Premier Collection',
    price: 980,
    size: '90 m²',
    guests: 2,
    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80&auto=format&fit=crop',
    amenities: ['King Bed', 'Lounge Area', 'Marble Bathroom', 'City Views'],
    badge: 'Bestseller',
  },
  {
    name: 'Clifftop Suite',
    category: 'Horizon Collection',
    price: 1200,
    size: '105 m²',
    guests: 3,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80&auto=format&fit=crop',
    amenities: ['Infinity Pool', 'Panoramic Views', 'Terrace', 'Outdoor Shower'],
    badge: '',
  },
  {
    name: 'Presidential Suite',
    category: 'Elite Collection',
    price: 3200,
    size: '280 m²',
    guests: 4,
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80&auto=format&fit=crop',
    amenities: ['Private Terrace', 'Jacuzzi', 'Dining Room', 'Personal Chef'],
    badge: 'Exclusive',
  },
  {
    name: 'Garden Pavilion',
    category: 'Nature Collection',
    price: 760,
    size: '75 m²',
    guests: 2,
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80&auto=format&fit=crop',
    amenities: ['Private Garden', 'Rain Shower', 'Open-Air Bath', 'Forest Views'],
    badge: '',
  },
];

export default function RoomCarousel() {
  const [hovered, setHovered] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 380, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Scroll arrows */}
      {([-1, 1] as const).map((dir) => (
        <button
          key={dir}
          onClick={() => scroll(dir)}
          style={{
            position: 'absolute',
            top: '40%',
            [dir === -1 ? 'left' : 'right']: '-1.5rem',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '3rem',
            height: '3rem',
            border: '1px solid rgba(201,168,76,0.35)',
            background: 'rgba(8,8,8,0.85)',
            backdropFilter: 'blur(10px)',
            color: '#c9a84c',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(201,168,76,0.15)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(8,8,8,0.85)';
          }}
          aria-label={dir === -1 ? 'Previous rooms' : 'Next rooms'}
        >
          {dir === -1 ? '←' : '→'}
        </button>
      ))}

      {/* Cards container */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '1rem',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {rooms.map((room, i) => (
          <div
            key={room.name}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              flexShrink: 0,
              width: '340px',
              scrollSnapAlign: 'start',
              background: 'rgba(20,20,20,0.95)',
              border: `1px solid ${hovered === i ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.12)'}`,
              transition: 'border-color 0.35s, transform 0.35s',
              transform: hovered === i ? 'translateY(-4px)' : 'translateY(0)',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Image */}
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img
                src={room.image}
                alt={room.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.6s ease',
                  transform: hovered === i ? 'scale(1.06)' : 'scale(1)',
                }}
                loading="lazy"
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(8,8,8,0.6) 0%, transparent 60%)',
                }}
              />
              {room.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#080808',
                    background: '#c9a84c',
                    padding: '0.25rem 0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {room.badge}
                </span>
              )}
              <div style={{ position: 'absolute', bottom: '0.75rem', left: '1rem' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: 'rgba(201,168,76,0.8)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {room.category}
                </p>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '1.4rem',
                    fontWeight: 400,
                    color: '#fff',
                    lineHeight: 1.2,
                  }}
                >
                  {room.name}
                </h3>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: '#c9a84c', fontWeight: 400, lineHeight: 1 }}>
                    ${room.price.toLocaleString()}
                  </p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', color: '#555', letterSpacing: '0.1em' }}>
                    per night
                  </p>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                {[{ icon: '⊡', val: room.size }, { icon: '⊙', val: `${room.guests} guests` }].map(({ icon, val }) => (
                  <div key={val} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ color: '#c9a84c', fontSize: '0.8rem' }}>{icon}</span>
                    <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.7rem', color: '#888' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
                {room.amenities.map((a) => (
                  <span
                    key={a}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.6rem',
                      color: '#888',
                      background: 'rgba(201,168,76,0.06)',
                      border: '1px solid rgba(201,168,76,0.12)',
                      padding: '0.2rem 0.5rem',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>

              <button
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: hovered === i ? '#c9a84c' : 'transparent',
                  border: `1px solid ${hovered === i ? '#c9a84c' : 'rgba(201,168,76,0.35)'}`,
                  color: hovered === i ? '#080808' : '#c9a84c',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.68rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
              >
                Reserve Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
