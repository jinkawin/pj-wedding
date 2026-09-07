import { SVGProps } from 'react'

/** Open envelope SVG — flap pointing upward, interior liner visible */
export default function OpenEnvelopeSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 360 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      {...props}
    >
      {/* Envelope body */}
      <rect x="0" y="50" width="360" height="210" rx="4" fill="#F5F0E8" />

      {/* Cream interior liner */}
      <rect x="6" y="56" width="348" height="198" rx="2" fill="#FAF7F1" />

      {/* Side and bottom flaps drawn on top for depth */}
      {/* Left flap */}
      <polygon points="0,50 0,258 180,158" fill="rgba(230,221,205,0.7)" />
      {/* Right flap */}
      <polygon points="360,50 360,258 180,158" fill="rgba(230,221,205,0.7)" />
      {/* Bottom flap */}
      <polygon points="0,258 360,258 180,158" fill="rgba(220,211,194,0.75)" />

      {/* Open top flap — points upward */}
      <polygon points="0,50 360,50 180,-24" fill="#E8E1D0" />
      {/* Flap border line */}
      <line x1="0" y1="50" x2="180" y2="-24" stroke="#CEC5B0" strokeWidth="0.8" opacity="0.5" />
      <line x1="360" y1="50" x2="180" y2="-24" stroke="#CEC5B0" strokeWidth="0.8" opacity="0.5" />

      {/* Fold lines */}
      <line x1="0" y1="50" x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.6" opacity="0.35" />
      <line x1="360" y1="50" x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.6" opacity="0.35" />
      <line x1="0" y1="258" x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.45" />
      <line x1="360" y1="258" x2="180" y2="158" stroke="#BDB4A2" strokeWidth="0.7" opacity="0.45" />

      {/* Outer border */}
      <rect x="0" y="50" width="360" height="210" rx="4" stroke="#CEC5B0" strokeWidth="1" fill="none" />
    </svg>
  )
}

