import React from 'react'

export function CornerFloralDecoration({ className = '', position = 'top-left' }: { className?: string; position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const getTransform = () => {
    switch (position) {
      case 'top-right': return 'scaleX(-1)'
      case 'bottom-left': return 'scaleY(-1)'
      case 'bottom-right': return 'scale(-1)'
      default: return 'none'
    }
  }

  return (
    <svg
      viewBox="0 0 170 170"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-32 sm:w-40 md:w-48 h-auto pointer-events-none select-none opacity-90 ${className}`}
      style={{ transform: getTransform() }}
      aria-hidden="true"
    >
      {/* Curved vine stems */}
      <path d="M 5 5 C 40 25, 70 60, 95 135" stroke="#7A8C6E" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 5 5 C 25 40, 60 70, 135 95" stroke="#7A8C6E" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 30 30 Q 75 45 150 50" stroke="#7A8C6E" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
      <path d="M 30 30 Q 45 75 50 150" stroke="#7A8C6E" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />

      {/* Sage green leaves */}
      <ellipse cx="48" cy="22" rx="10" ry="4.5" fill="#7A8C6E" opacity="0.75" transform="rotate(25 48 22)" />
      <ellipse cx="22" cy="48" rx="10" ry="4.5" fill="#7A8C6E" opacity="0.75" transform="rotate(65 22 48)" />
      <ellipse cx="88" cy="58" rx="12" ry="5" fill="#889C7B" opacity="0.7" transform="rotate(-15 88 58)" />
      <ellipse cx="58" cy="88" rx="12" ry="5" fill="#889C7B" opacity="0.7" transform="rotate(105 58 88)" />
      <ellipse cx="125" cy="82" rx="9" ry="4" fill="#7A8C6E" opacity="0.6" transform="rotate(20 125 82)" />
      <ellipse cx="82" cy="125" rx="9" ry="4" fill="#7A8C6E" opacity="0.6" transform="rotate(70 82 125)" />

      {/* ── HYDRANGEA CLUSTER (Soft Blue, Lavender, & Periwinkle 4-petal florets) ── */}
      <g transform="translate(42, 42)">
        {/* Hydrangea Background Shadow Cluster */}
        <circle cx="0" cy="0" r="26" fill="#8EA8D8" opacity="0.25" />
        <circle cx="-8" cy="-6" r="22" fill="#A4B9E4" opacity="0.3" />
        <circle cx="8" cy="6" r="22" fill="#B39DDB" opacity="0.25" />

        {/* Individual 4-Petal Hydrangea Florets */}
        {/* Floret 1 (Top Left) */}
        <g transform="translate(-14, -14)">
          <circle cx="-4" cy="0" r="4.5" fill="#8EA8D8" />
          <circle cx="4" cy="0" r="4.5" fill="#8EA8D8" />
          <circle cx="0" cy="-4" r="4.5" fill="#A4B9E4" />
          <circle cx="0" cy="4" r="4.5" fill="#A4B9E4" />
          <circle cx="0" cy="0" r="1.5" fill="#FFF" />
        </g>
        {/* Floret 2 (Top Center) */}
        <g transform="translate(4, -18)">
          <circle cx="-4" cy="0" r="4.5" fill="#9FAEE5" />
          <circle cx="4" cy="0" r="4.5" fill="#9FAEE5" />
          <circle cx="0" cy="-4" r="4.5" fill="#B8C5F2" />
          <circle cx="0" cy="4" r="4.5" fill="#B8C5F2" />
          <circle cx="0" cy="0" r="1.5" fill="#FFF" />
        </g>
        {/* Floret 3 (Left Center) */}
        <g transform="translate(-18, 4)">
          <circle cx="-4" cy="0" r="4.5" fill="#B39DDB" />
          <circle cx="4" cy="0" r="4.5" fill="#B39DDB" />
          <circle cx="0" cy="-4" r="4.5" fill="#C5CAE9" />
          <circle cx="0" cy="4" r="4.5" fill="#C5CAE9" />
          <circle cx="0" cy="0" r="1.5" fill="#FFF" />
        </g>
        {/* Floret 4 (Center Focal) */}
        <g transform="translate(0, 0)">
          <circle cx="-5" cy="0" r="5" fill="#7B92D1" />
          <circle cx="5" cy="0" r="5" fill="#7B92D1" />
          <circle cx="0" cy="-5" r="5" fill="#97A9DE" />
          <circle cx="0" cy="5" r="5" fill="#97A9DE" />
          <circle cx="0" cy="0" r="1.8" fill="#FAF4EB" />
        </g>
        {/* Floret 5 (Right Center) */}
        <g transform="translate(16, -4)">
          <circle cx="-4" cy="0" r="4.5" fill="#8EA8D8" />
          <circle cx="4" cy="0" r="4.5" fill="#8EA8D8" />
          <circle cx="0" cy="-4" r="4.5" fill="#A4B9E4" />
          <circle cx="0" cy="4" r="4.5" fill="#A4B9E4" />
          <circle cx="0" cy="0" r="1.5" fill="#FFF" />
        </g>
        {/* Floret 6 (Bottom Left) */}
        <g transform="translate(-8, 16)">
          <circle cx="-4" cy="0" r="4.5" fill="#9FAEE5" />
          <circle cx="4" cy="0" r="4.5" fill="#9FAEE5" />
          <circle cx="0" cy="-4" r="4.5" fill="#D1C4E9" />
          <circle cx="0" cy="4" r="4.5" fill="#D1C4E9" />
          <circle cx="0" cy="0" r="1.5" fill="#FFF" />
        </g>
        {/* Floret 7 (Bottom Right) */}
        <g transform="translate(12, 14)">
          <circle cx="-4" cy="0" r="4.5" fill="#A4B9E4" />
          <circle cx="4" cy="0" r="4.5" fill="#A4B9E4" />
          <circle cx="0" cy="-4" r="4.5" fill="#B39DDB" />
          <circle cx="0" cy="4" r="4.5" fill="#B39DDB" />
          <circle cx="0" cy="0" r="1.5" fill="#FFF" />
        </g>
      </g>

      {/* Terracotta Rose Accent Blossom 1 (Along right branch) */}
      <g transform="translate(135, 52)">
        <circle cx="-6" cy="-4" r="6" fill="#E28965" opacity="0.9" />
        <circle cx="6" cy="-4" r="6" fill="#E28965" opacity="0.9" />
        <circle cx="6" cy="4" r="6" fill="#D97A53" opacity="0.9" />
        <circle cx="-6" cy="4" r="6" fill="#D97A53" opacity="0.9" />
        <circle cx="0" cy="0" r="4" fill="#FAF4EB" />
        <circle cx="0" cy="0" r="2" fill="#C4714A" />
      </g>

      {/* Terracotta Rose Accent Blossom 2 (Along bottom branch) */}
      <g transform="translate(52, 135)">
        <circle cx="-4" cy="-6" r="6" fill="#E28965" opacity="0.9" />
        <circle cx="4" cy="-6" r="6" fill="#E28965" opacity="0.9" />
        <circle cx="4" cy="6" r="6" fill="#D97A53" opacity="0.9" />
        <circle cx="-4" cy="6" r="6" fill="#D97A53" opacity="0.9" />
        <circle cx="0" cy="0" r="4" fill="#FAF4EB" />
        <circle cx="0" cy="0" r="2" fill="#C4714A" />
      </g>

      {/* Golden Yellow Accent Buds */}
      <circle cx="102" cy="32" r="4.5" fill="#E6B86A" opacity="0.95" />
      <circle cx="102" cy="32" r="2" fill="#C89643" />
      <circle cx="32" cy="102" r="4.5" fill="#E6B86A" opacity="0.95" />
      <circle cx="32" cy="102" r="2" fill="#C89643" />

      {/* Soft Blue & Golden Berry Clusters */}
      <circle cx="152" cy="76" r="3" fill="#8EA8D8" />
      <circle cx="158" cy="70" r="2.5" fill="#E6B86A" />
      <circle cx="76" cy="152" r="3" fill="#8EA8D8" />
      <circle cx="70" cy="158" r="2.5" fill="#E6B86A" />
    </svg>
  )
}

export function FloatingPetals({ count = 8 }: { count?: number }) {
  // Pre-calculated position/animation variations including Hydrangea blue & lavender petals
  const petalStyles = [
    { top: '10%', left: '8%', size: 16, color: '#A4B9E4', delay: '0s', duration: '7s' },
    { top: '15%', right: '12%', size: 14, color: '#E28965', delay: '1.5s', duration: '9s' },
    { top: '40%', left: '5%', size: 18, color: '#B39DDB', delay: '3s', duration: '8s' },
    { top: '65%', right: '8%', size: 15, color: '#8EA8D8', delay: '0.8s', duration: '10s' },
    { top: '80%', left: '15%', size: 13, color: '#E6B86A', delay: '4s', duration: '7.5s' },
    { top: '85%', right: '18%', size: 17, color: '#9FAEE5', delay: '2s', duration: '8.5s' },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {petalStyles.slice(0, count).map((p, i) => (
        <div
          key={i}
          className="absolute animate-breathe opacity-70"
          style={{
            top: p.top,
            left: p.left,
            right: p.right,
            width: `${p.size}px`,
            height: `${p.size * 1.5}px`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        >
          <svg viewBox="0 0 20 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <path
              d="M 10 0 C 20 10, 18 25, 10 30 C 2 25, 0 10, 10 0 Z"
              fill={p.color}
              opacity="0.8"
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
