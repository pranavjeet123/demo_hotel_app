import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
    }, 1000);
  }

  return (
    <div>
      {status === 'success' ? (
        <div
          style={{
            textAlign: 'center',
            padding: '1rem',
            border: '1px solid rgba(201,168,76,0.3)',
            background: 'rgba(201,168,76,0.05)',
          }}
        >
          <p
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.2rem',
              color: '#c9a84c',
            }}
          >
            Welcome to LuxStay
          </p>
          <p
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.72rem',
              color: '#777',
              marginTop: '0.35rem',
            }}
          >
            Exclusive offers will be sent to {email}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0', maxWidth: '500px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRight: 'none',
              color: '#f5f0e8',
              padding: '0.85rem 1rem',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.8rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              background: '#c9a84c',
              border: '1px solid #c9a84c',
              color: '#080808',
              padding: '0.85rem 1.5rem',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: status === 'loading' ? 'wait' : 'pointer',
              whiteSpace: 'nowrap',
              transition: 'background 0.3s',
            }}
          >
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </form>
      )}
    </div>
  );
}
