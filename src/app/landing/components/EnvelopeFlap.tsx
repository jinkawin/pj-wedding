type EnvelopeFlapProps = {
  isOpen: boolean
}

export default function EnvelopeFlap({ isOpen }: EnvelopeFlapProps) {
  return (
    /*
     * The flap is a triangle pointing downward that sits at the top of the envelope.
     * We use a CSS clip-path triangle + rotateX for the 3D fold effect.
     * The parent must have  perspective + transform-style: preserve-3d.
     */
    <div
      className="absolute top-0 left-0 w-full z-20"
      style={{
        transformOrigin: 'top center',
        animation: isOpen ? 'flapOpen 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards' : undefined,
      }}
    >
      {/* Triangle flap shape using clip-path */}
      <div
        className="w-full"
        style={{
          height: '52%',
          background: 'linear-gradient(160deg, #D4B896 0%, #C8AB87 50%, #BFA07C 100%)',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.12))',
        }}
      >
        {/* Linen texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              transparent,
              transparent 2px,
              rgba(255,255,255,0.3) 2px,
              rgba(255,255,255,0.3) 4px
            )`,
          }}
        />
      </div>

      {/* Flap inner face (visible after rotation) */}
      <div
        className="absolute top-0 left-0 w-full backface-hidden"
        style={{
          height: '52%',
          background: 'linear-gradient(160deg, #FAF6EE 0%, #F0E9D8 100%)',
          clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          transform: 'rotateX(180deg)',
          transformOrigin: 'top center',
        }}
      />
    </div>
  )
}

