import { SVGProps } from 'react'

/** Small concentric circle divider dot SVG */
export default function CardDividerSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" {...props}>
      <circle cx="7" cy="7" r="2.5" fill="#C9A99A" opacity="0.8" />
      <circle cx="7" cy="7" r="5" stroke="#7A8C6E" strokeWidth="0.7" fill="none" opacity="0.5" />
    </svg>
  )
}

