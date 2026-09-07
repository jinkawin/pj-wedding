import { WaxSealSVG } from '@/assets/svg'

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
      <WaxSealSVG />
    </button>
  )
}
