import { useState } from 'react';

const roomTypes = [
  'Deluxe Room',
  'Superior Suite',
  'Junior Suite',
  'Grand Suite',
  'Overwater Villa',
  'Presidential Suite',
];

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export default function BookingWidget() {
  const today = new Date();
  const [checkIn, setCheckIn] = useState(addDays(today, 1));
  const [checkOut, setCheckOut] = useState(addDays(today, 4));
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [roomType, setRoomType] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nights = Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
    }, 1200);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.25)',
    color: '#f5f0e8',
    padding: '0.65rem 0.85rem',
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.8rem',
    outline: 'none',
    transition: 'border-color 0.3s',
    borderRadius: '1px',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Inter, sans-serif',
    fontSize: '0.6rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#c9a84c',
    marginBottom: '0.4rem',
    display: 'block',
  };

  return (
    <div
      id="booking"
      style={{
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(201,168,76,0.2)',
        padding: '2rem',
        maxWidth: '1100px',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: '#c9a84c', marginBottom: '0.3rem' }}>
            — Reserve Your Stay
          </p>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              fontWeight: 300,
              color: '#fff',
            }}
          >
            Check Availability
          </h3>
        </div>
        {nights > 0 && (
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', color: '#777', letterSpacing: '0.1em' }}>
              Duration
            </p>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.5rem', color: '#c9a84c', fontWeight: 400 }}>
              {nights} <span style={{ fontSize: '0.9rem', color: 'rgba(201,168,76,0.7)' }}>night{nights !== 1 ? 's' : ''}</span>
            </p>
          </div>
        )}
      </div>

      <form onSubmit={handleSearch}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          {/* Check-in */}
          <div>
            <label style={labelStyle}>Check In</label>
            <input
              type="date"
              value={checkIn.toISOString().slice(0, 10)}
              min={addDays(today, 1).toISOString().slice(0, 10)}
              onChange={(e) => {
                const d = new Date(e.target.value + 'T00:00:00');
                setCheckIn(d);
                if (d >= checkOut) setCheckOut(addDays(d, 1));
              }}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
            <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.25rem' }}>
              {formatDate(checkIn)}
            </p>
          </div>

          {/* Check-out */}
          <div>
            <label style={labelStyle}>Check Out</label>
            <input
              type="date"
              value={checkOut.toISOString().slice(0, 10)}
              min={addDays(checkIn, 1).toISOString().slice(0, 10)}
              onChange={(e) => setCheckOut(new Date(e.target.value + 'T00:00:00'))}
              style={{ ...inputStyle, colorScheme: 'dark' }}
            />
            <p style={{ fontSize: '0.65rem', color: '#555', marginTop: '0.25rem' }}>
              {formatDate(checkOut)}
            </p>
          </div>

          {/* Guests */}
          <div>
            <label style={labelStyle}>Guests</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: 'transparent',
                  color: '#c9a84c',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <input
                type="number"
                value={guests}
                min={1}
                max={8}
                onChange={(e) => setGuests(Math.max(1, Math.min(8, +e.target.value)))}
                style={{ ...inputStyle, textAlign: 'center', padding: '0.65rem 0.25rem' }}
              />
              <button
                type="button"
                onClick={() => setGuests(Math.min(8, guests + 1))}
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: 'transparent',
                  color: '#c9a84c',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Rooms */}
          <div>
            <label style={labelStyle}>Rooms</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: 'transparent',
                  color: '#c9a84c',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                −
              </button>
              <input
                type="number"
                value={rooms}
                min={1}
                max={5}
                onChange={(e) => setRooms(Math.max(1, Math.min(5, +e.target.value)))}
                style={{ ...inputStyle, textAlign: 'center', padding: '0.65rem 0.25rem' }}
              />
              <button
                type="button"
                onClick={() => setRooms(Math.min(5, rooms + 1))}
                style={{
                  width: '2rem',
                  height: '2rem',
                  border: '1px solid rgba(201,168,76,0.3)',
                  background: 'transparent',
                  color: '#c9a84c',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Room type */}
          <div>
            <label style={labelStyle}>Room Type</label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              <option value="">Any Type</option>
              {roomTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: submitted ? '#2d5a27' : '#c9a84c',
              color: submitted ? '#a8d5a2' : '#080808',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.72rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              fontWeight: 600,
              padding: '0.9rem 2.5rem',
              border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              minWidth: '180px',
              justifyContent: 'center',
            }}
          >
            {loading ? (
              <>
                <span
                  style={{
                    width: '14px',
                    height: '14px',
                    border: '2px solid rgba(8,8,8,0.3)',
                    borderTopColor: '#080808',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                    display: 'inline-block',
                  }}
                />
                Searching…
              </>
            ) : submitted ? (
              '✓ Availability Found'
            ) : (
              'Search Availability'
            )}
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(0.7) sepia(1) saturate(3) hue-rotate(10deg);
          cursor: pointer;
        }
        select option { background: #111; color: #f5f0e8; }
      `}</style>
    </div>
  );
}
