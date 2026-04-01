import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const CoatOfArms: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Fade in the whole composition
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  // Crown drops in from above
  const crownY = spring({ frame, fps, config: { damping: 14, mass: 0.6 } });
  const crownOffset = interpolate(crownY, [0, 1], [-80, 0]);

  // Shield scales up from center
  const shieldScale = spring({ frame: frame - 8, fps, config: { damping: 16, mass: 0.8 } });
  const scale = interpolate(shieldScale, [0, 1], [0.3, 1], { extrapolateLeft: "clamp" });

  // Mantling unfurls (fade in with slight delay)
  const mantlingOpacity = interpolate(frame, [15, 45], [0, 1], { extrapolateRight: "clamp" });

  // Cross draws in (scale from center)
  const crossProgress = spring({ frame: frame - 20, fps, config: { damping: 18 } });
  const crossScale = interpolate(crossProgress, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  // Banner slides up from bottom
  const bannerY = spring({ frame: frame - 35, fps, config: { damping: 14, mass: 0.7 } });
  const bannerOffset = interpolate(bannerY, [0, 1], [60, 0], { extrapolateLeft: "clamp" });

  // Subtle pulse on the center jewel
  const pulse = Math.sin(frame * 0.08) * 0.15 + 1;

  return (
    <div style={{ width: 600, height: 720, background: "transparent", opacity }}>
      <svg viewBox="0 0 600 720" width="600" height="720" xmlns="http://www.w3.org/2000/svg">
        {/* Mantling */}
        <g opacity={mantlingOpacity}>
          {/* Left mantling */}
          <path d="M 188,135 C 140,165 95,220 82,295 C 70,360 82,415 105,448 C 118,466 112,480 95,500 C 82,516 88,528 108,512 C 124,499 128,482 122,466 C 138,486 148,502 138,524 C 132,540 144,545 158,528 C 170,512 167,492 158,472 C 173,490 184,506 178,528 C 173,545 186,549 197,532 C 208,514 205,492 194,468 C 186,448 195,415 202,388 C 210,356 215,305 204,258 C 196,220 198,172 208,138 Z"
                fill="#111" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M 205,140 C 198,175 196,220 204,258 C 215,305 210,356 202,388 C 195,415 186,448 194,468 C 203,490 204,512 196,530"
                fill="none" stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round" opacity="0.75"/>
          {/* Right mantling */}
          <path d="M 412,135 C 460,165 505,220 518,295 C 530,360 518,415 495,448 C 482,466 488,480 505,500 C 518,516 512,528 492,512 C 476,499 472,482 478,466 C 462,486 452,502 462,524 C 468,540 456,545 442,528 C 430,512 433,492 442,472 C 427,490 416,506 422,528 C 427,545 414,549 403,532 C 392,514 395,492 406,468 C 414,448 405,415 398,388 C 390,356 385,305 396,258 C 404,220 402,172 392,138 Z"
                fill="#111" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M 395,140 C 402,175 404,220 396,258 C 385,305 390,356 398,388 C 405,415 414,448 406,468 C 397,490 396,512 404,530"
                fill="none" stroke="#c9a84c" strokeWidth="3.5" strokeLinecap="round" opacity="0.75"/>
        </g>

        {/* Shield */}
        <g transform={`translate(300,328) scale(${scale}) translate(-300,-328)`}>
          <path d="M 122,148 C 122,100 176,75 300,75 C 424,75 478,100 478,148 L 478,332 C 478,458 388,538 300,582 C 212,538 122,458 122,332 Z"
                fill="url(#shieldInner)" stroke="#c9a84c" strokeWidth="4.5"/>
          <path d="M 136,156 C 136,112 184,90 300,90 C 416,90 464,112 464,156 L 464,330 C 464,448 381,522 300,564 C 219,522 136,448 136,330 Z"
                fill="none" stroke="#c9a84c" strokeWidth="1.5" opacity="0.35"/>
        </g>

        {/* Cross */}
        <g transform={`translate(300,310) scale(${crossScale}) translate(-300,-310)`}>
          <rect x="261" y="110" width="78" height="453" rx="3" fill="#c9a84c"/>
          <rect x="146" y="272" width="308" height="78" rx="3" fill="#c9a84c"/>
          <rect x="268" y="117" width="64" height="439" rx="2" fill="#1b4332"/>
          <rect x="153" y="279" width="294" height="64" rx="2" fill="#1b4332"/>
          <rect x="268" y="117" width="10" height="439" rx="2" fill="#40916c" opacity="0.45"/>
          <rect x="153" y="279" width="294" height="10" rx="2" fill="#40916c" opacity="0.45"/>
          {/* Pulsing jewel */}
          <circle cx="300" cy="310" r="18" fill="#c9a84c" transform={`scale(${pulse}) translate(${(1 - pulse) * 300 / pulse}, ${(1 - pulse) * 310 / pulse})`}/>
          <circle cx="300" cy="310" r="11" fill="#1b4332"/>
          <circle cx="300" cy="310" r="5"  fill="#40916c" opacity="0.9"/>
        </g>

        {/* Quadrant small crosses */}
        <g opacity={interpolate(frame, [30, 60], [0, 1], { extrapolateRight: "clamp" })}>
          {[{ x: 202, y: 198 }, { x: 376, y: 198 }, { x: 202, y: 390 }, { x: 376, y: 390 }].map(({ x, y }, i) => (
            <g key={i} transform={`translate(${x + 24}, ${y + 24})`}>
              <polygon points="-8,-8 -7,-26 0,-18 7,-26 8,-8 26,-7 18,0 26,7 8,8 7,26 0,18 -7,26 -8,8 -26,7 -18,0 -26,-7"
                       fill="#1b4332" stroke="#c9a84c" strokeWidth="2.5" strokeLinejoin="round"/>
            </g>
          ))}
        </g>

        {/* Crown drops in */}
        <g transform={`translate(0, ${crownOffset})`}>
          <rect x="182" y="96" width="236" height="40" rx="6" fill="#c9a84c" stroke="#8a6514" strokeWidth="1.5"/>
          <polygon points="182,96 196,52 218,82 246,38 268,72 300,28 332,72 354,38 382,82 404,52 418,96"
                   fill="#c9a84c" stroke="#8a6514" strokeWidth="1.5" strokeLinejoin="round"/>
          <circle cx="246" cy="40" r="8" fill="#8B0000" stroke="#8a6514" strokeWidth="1.5"/>
          <circle cx="300" cy="30" r="10" fill="#006400" stroke="#8a6514" strokeWidth="1.5"/>
          <circle cx="354" cy="40" r="8" fill="#00008B" stroke="#8a6514" strokeWidth="1.5"/>
          <circle cx="218" cy="80" r="7" fill="#f5f0e8" stroke="#c9a84c" strokeWidth="1.5"/>
          <circle cx="382" cy="80" r="7" fill="#f5f0e8" stroke="#c9a84c" strokeWidth="1.5"/>
          <rect x="296" y="14" width="8" height="18" rx="2" fill="#c9a84c"/>
          <rect x="290" y="18" width="20" height="6" rx="2" fill="#c9a84c"/>
          <circle cx="300" cy="12" r="4" fill="#f7e08a" stroke="#8a6514" strokeWidth="1"/>
        </g>

        {/* Banner slides up */}
        <g transform={`translate(0, ${bannerOffset})`}>
          <path d="M 252,580 Q 276,592 300,596 Q 324,592 348,580 L 348,606 Q 324,618 300,622 Q 276,618 252,606 Z" fill="#c9a84c" opacity="0.9"/>
          <path d="M 152,614 Q 300,636 448,614 L 448,656 Q 300,678 152,656 Z" fill="#f5f0e8" stroke="#c9a84c" strokeWidth="2.5"/>
          <path d="M 152,614 L 138,607 L 136,663 L 152,656" fill="#e2d4b8" stroke="#c9a84c" strokeWidth="1.5"/>
          <path d="M 448,614 L 462,607 L 464,663 L 448,656" fill="#e2d4b8" stroke="#c9a84c" strokeWidth="1.5"/>
          <text x="300" y="640" textAnchor="middle" fontFamily="Georgia, serif" fontSize="17" fontWeight="bold" letterSpacing="5" fill="#1a1a2e">CRUX · AETERNA</text>
        </g>

        {/* Gradients (must be in defs) */}
        <defs>
          <radialGradient id="shieldInner" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#243580"/>
            <stop offset="100%" stopColor="#060d28"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};
