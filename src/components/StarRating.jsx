// import { useState } from 'react';

// Distinct avatar colors for variety
const COLORS = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
  'linear-gradient(135deg, #43e97b, #38f9d7)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #a18cd1, #fbc2eb)',
  'linear-gradient(135deg, #ffecd2, #fcb69f)',
  'linear-gradient(135deg, #ff9a9e, #fad0c4)',
];

export function getAvatarColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

import { useState } from 'react';

// ─── Star SVG ─────────────────────────────────────────────────────────────────
// Renders one star in three states: empty | half | full
// Uses a clipPath to reveal exactly the left 50% for half-fill.

function StarIcon({ state = 'empty', size = 32 }) {
  const id = `half-clip-${Math.random().toString(36).slice(2)}`;
  const YELLOW = '#FFCC00';
  const GREY   = '#D1D1D1';

  if (state === 'full') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={YELLOW}
          stroke={YELLOW}
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (state === 'half') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        {/* Grey base (full star) */}
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={GREY}
          stroke={GREY}
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* Yellow left half on top */}
        <polygon
          points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
          fill={YELLOW}
          stroke={YELLOW}
          strokeWidth="1"
          strokeLinejoin="round"
          clipPath={`url(#${id})`}
        />
      </svg>
    );
  }

  // empty
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <polygon
        points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
        fill={GREY}
        stroke={GREY}
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── StarRating ────────────────────────────────────────────────────────────────
// value: 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 4.5 | 5
// onChange: (newValue: number) => void   — omit to make read-only

export default function StarRating({ value = 0, onChange, size = 32, gap = 6 }) {
  const [hoverValue, setHoverValue] = useState(null);
  const interactive = typeof onChange === 'function';
  const display = hoverValue !== null ? hoverValue : value;

  // Determine state of star at position `pos` (1-based) given a rating
  function stateForStar(pos, rating) {
    if (rating >= pos)       return 'full';
    if (rating >= pos - 0.5) return 'half';
    return 'empty';
  }

  // From mouse x position inside the star element → 0.5 or 1.0 increment
  function valueFromEvent(e, pos) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    return x < rect.width / 2 ? pos - 0.5 : pos;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: gap,
        cursor: interactive ? 'pointer' : 'default',
        userSelect: 'none',
      }}
      onMouseLeave={interactive ? () => setHoverValue(null) : undefined}
    >
      {[1, 2, 3, 4, 5].map((pos) => (
        <span
          key={pos}
          style={{ display: 'flex', alignItems: 'center' }}
          onMouseMove={
            interactive
              ? (e) => setHoverValue(valueFromEvent(e, pos))
              : undefined
          }
          onClick={
            interactive
              ? (e) => onChange(valueFromEvent(e, pos))
              : undefined
          }
          role={interactive ? 'button' : undefined}
          aria-label={interactive ? `Rate ${pos} stars` : undefined}
        >
          <StarIcon state={stateForStar(pos, display)} size={size} />
        </span>
      ))}
    </div>
  );
}

