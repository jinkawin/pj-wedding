import { SVGProps } from 'react'

/** Closed envelope SVG — ivory with diamond fold lines */
export default function ClosedEnvelopeSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 300 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.28))' }}
      aria-hidden="true"
      {...props}
    >
      {/* Base */}
      <rect x="0.5" y="0.5" width="299" height="199" rx="4" fill="#F5F0E8" />

      {/* Bottom flap */}
      <polygon points="0,200 300,200 150,108" fill="#EBE4D4" />
      {/* Left flap */}
      <polygon points="0,0 0,200 150,108" fill="#EEE8DC" />
      {/* Right flap */}
      <polygon points="300,0 300,200 150,108" fill="#EEE8DC" />
      {/* Top flap (folded over centre) */}
      <polygon points="0,0 300,0 150,95" fill="#E8E1D0" />

      {/* Fold lines */}
      <line x1="0" y1="0" x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.55" />
      <line x1="300" y1="0" x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.55" />
      <line x1="0" y1="200" x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.4" />
      <line x1="300" y1="200" x2="150" y2="108" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.4" />

      {/* Outer border */}
      <rect x="0.5" y="0.5" width="299" height="199" rx="4" stroke="#CEC5B0" strokeWidth="1" fill="none" />
    </svg>
  )
}

