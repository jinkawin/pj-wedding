type WaxSealProps = {
  isOpen: boolean
  onClick: () => void
}

export default function WaxSeal({ isOpen, onClick }: WaxSealProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation() // parent div also handles click, prevent double fire
        onClick()
      }}
      disabled={isOpen}
      aria-label="Open the wedding invitation"
      className={[
        'relative flex items-center justify-center rounded-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2',
        isOpen ? 'pointer-events-none' : 'cursor-pointer hover:scale-105 active:scale-95',
        !isOpen ? 'animate-sealShimmer' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        width: '72px',
        height: '72px',
        transition: 'transform 150ms ease',
      }}
    >
      <svg
        viewBox="0 0 72 72"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.35))' }}
        aria-hidden="true"
      >
        {/* Outer blob — slightly irregular for organic wax look */}
        <path
          d="M36 4 C46 4 62 14 66 26 C70 38 64 56 52 64 C40 72 20 70 12 60 C4 50 6 30 14 18 C22 6 26 4 36 4Z"
          fill="#C4714A"
        />
        {/* Mid ring */}
        <path
          d="M36 10 C44 10 58 18 62 28 C66 38 60 54 50 60 C40 66 22 64 15 55 C8 46 10 28 18 18 C26 8 28 10 36 10Z"
          fill="#B5623C"
        />
        {/* Inner disc */}
        <circle cx="36" cy="37" r="22" fill="#C4714A" />

        {/* Scalloped inner edge */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 360) / 12
          const rad = (angle * Math.PI) / 180
          const x = 36 + 21 * Math.cos(rad)
          const y = 37 + 21 * Math.sin(rad)

return <circle key={i} cx={x} cy={y} r="3.5" fill="#C4714A" />
        })}

        {/* Inner cream disc */}
        <circle cx="36" cy="37" r="16" fill="none" stroke="#FAF4EB" strokeWidth="0.6" opacity="0.4" />

        {/* Monogram "J & P" */}
        <text
          x="36"
          y="34"
          textAnchor="middle"
          fontSize="8.5"
          fontFamily="Georgia, 'Times New Roman', serif"
          fontStyle="italic"
          fill="#FAF4EB"
          letterSpacing="0.5"
        >
          J &amp; P
        </text>

        {/* Dividing line */}
        <line x1="26" y1="39" x2="46" y2="39" stroke="#FAF4EB" strokeWidth="0.7" opacity="0.5" />

        {/* Year */}
        <text
          x="36"
          y="48"
          textAnchor="middle"
          fontSize="6"
          fontFamily="Georgia, 'Times New Roman', serif"
          fill="#FAF4EB"
          opacity="0.7"
          letterSpacing="0.5"
        >
          2025
        </text>

        {/* Highlight spot */}
        <ellipse cx="30" cy="28" rx="5" ry="3" fill="white" opacity="0.07" transform="rotate(-20 30 28)" />
      </svg>
    </button>
  )
}
