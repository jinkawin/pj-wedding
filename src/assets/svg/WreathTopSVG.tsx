import { SVGProps } from 'react'

/** Botanical top wreath — sage green leaves + dusty rose flowers */
export default function WreathTopSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 300 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      aria-hidden="true"
      {...props}
    >
      {/* Thin inner border rect (top line) */}
      <line x1="0" y1="44" x2="300" y2="44" stroke="#CEC5B0" strokeWidth="0.6" />

      {/* ── Left branch ── */}
      {/* Main stem */}
      <path d="M 148 38 Q 110 30 72 36" stroke="#7A8C6E" strokeWidth="1.2" fill="none" />
      <path d="M 148 38 Q 120 20 90 26" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      {/* Leaves */}
      <ellipse cx="112" cy="27" rx="7" ry="3.5" fill="#7A8C6E" opacity="0.55" transform="rotate(-18 112 27)" />
      <ellipse cx="90" cy="28" rx="6" ry="3" fill="#7A8C6E" opacity="0.5" transform="rotate(-10 90 28)" />
      <ellipse cx="128" cy="23" rx="5.5" ry="2.8" fill="#7A8C6E" opacity="0.45" transform="rotate(-25 128 23)" />
      {/* Small side sprigs */}
      <path d="M 100 33 Q 96 26 92 29" stroke="#7A8C6E" strokeWidth="0.7" fill="none" />
      <ellipse cx="91" cy="28" rx="4" ry="2" fill="#7A8C6E" opacity="0.4" transform="rotate(-15 91 28)" />
      {/* Flowers */}
      <circle cx="72" cy="36" r="5" fill="#C9A99A" opacity="0.7" />
      <circle cx="72" cy="36" r="2.5" fill="#B89080" opacity="0.6" />
      <circle cx="52" cy="38" r="4" fill="#C9A99A" opacity="0.55" />
      <circle cx="36" cy="36" r="3" fill="#7A8C6E" opacity="0.4" />
      <circle cx="20" cy="38" r="2.5" fill="#C9A99A" opacity="0.4" />
      {/* Connecting stem */}
      <path d="M 72 32 Q 52 30 20 38" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      {/* Small leaves on far left */}
      <ellipse cx="44" cy="32" rx="5" ry="2.5" fill="#7A8C6E" opacity="0.4" transform="rotate(10 44 32)" />

      {/* ── Right branch (mirror) ── */}
      <path d="M 152 38 Q 190 30 228 36" stroke="#7A8C6E" strokeWidth="1.2" fill="none" />
      <path d="M 152 38 Q 180 20 210 26" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      <ellipse cx="188" cy="27" rx="7" ry="3.5" fill="#7A8C6E" opacity="0.55" transform="rotate(18 188 27)" />
      <ellipse cx="210" cy="28" rx="6" ry="3" fill="#7A8C6E" opacity="0.5" transform="rotate(10 210 28)" />
      <ellipse cx="172" cy="23" rx="5.5" ry="2.8" fill="#7A8C6E" opacity="0.45" transform="rotate(25 172 23)" />
      <path d="M 200 33 Q 204 26 208 29" stroke="#7A8C6E" strokeWidth="0.7" fill="none" />
      <ellipse cx="209" cy="28" rx="4" ry="2" fill="#7A8C6E" opacity="0.4" transform="rotate(15 209 28)" />
      <circle cx="228" cy="36" r="5" fill="#C9A99A" opacity="0.7" />
      <circle cx="228" cy="36" r="2.5" fill="#B89080" opacity="0.6" />
      <circle cx="248" cy="38" r="4" fill="#C9A99A" opacity="0.55" />
      <circle cx="264" cy="36" r="3" fill="#7A8C6E" opacity="0.4" />
      <circle cx="280" cy="38" r="2.5" fill="#C9A99A" opacity="0.4" />
      <path d="M 228 32 Q 248 30 280 38" stroke="#7A8C6E" strokeWidth="0.9" fill="none" />
      <ellipse cx="256" cy="32" rx="5" ry="2.5" fill="#7A8C6E" opacity="0.4" transform="rotate(-10 256 32)" />

      {/* ── Centre diamond ── */}
      <rect x="146" y="34" width="8" height="8" transform="rotate(45 150 38)" fill="#C9A99A" opacity="0.5" />
    </svg>
  )
}

