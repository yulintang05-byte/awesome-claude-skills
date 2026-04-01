import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

export const LionCross: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Full fade in
  const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });

  // Cross rotates in from 0 scale
  const crossSpring = spring({ frame, fps, config: { damping: 14, mass: 0.9 } });
  const crossScale = interpolate(crossSpring, [0, 1], [0, 1]);

  // Outer ring expands
  const ringScale = spring({ frame: frame - 5, fps, config: { damping: 18 } });
  const rScale = interpolate(ringScale, [0, 1], [0.4, 1], { extrapolateLeft: "clamp" });

  // Lions fade in sequentially
  const l1 = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp" });
  const l2 = interpolate(frame, [35, 60], [0, 1], { extrapolateRight: "clamp" });
  const l3 = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: "clamp" });
  const l4 = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: "clamp" });

  // Center medallion pops in with spring
  const medalSpring = spring({ frame: frame - 60, fps, config: { damping: 10, mass: 0.5 } });
  const medalScale = interpolate(medalSpring, [0, 1], [0, 1], { extrapolateLeft: "clamp" });

  // Slow rotation of outer ring
  const ringRot = frame * 0.12;

  // Jewel pulse
  const pulse = Math.sin(frame * 0.1) * 0.08 + 1;

  return (
    <div style={{ width: 600, height: 600, background: "#080808", opacity }}>
      <svg viewBox="0 0 600 600" width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bgGlowA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#3d0000" stopOpacity="0.45"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="crossGradA" cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#9b1a1a"/>
            <stop offset="100%" stopColor="#4a0000"/>
          </radialGradient>
          <linearGradient id="goldGradA" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f7e08a"/>
            <stop offset="45%" stopColor="#c9a84c"/>
            <stop offset="100%" stopColor="#8a6514"/>
          </linearGradient>
          <radialGradient id="centerGradA" cx="45%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f7e08a"/>
            <stop offset="100%" stopColor="#8a6514"/>
          </radialGradient>
        </defs>

        {/* Ambient glow */}
        <circle cx="300" cy="300" r="290" fill="url(#bgGlowA)"/>

        {/* Rotating outer ring */}
        <g transform={`rotate(${ringRot}, 300, 300)`} opacity="0.5">
          <circle cx="300" cy="300" r={276 * rScale} fill="none" stroke="#c9a84c" strokeWidth="8"/>
          <circle cx="300" cy="300" r={265 * rScale} fill="none" stroke="#8a6514" strokeWidth="2"/>
        </g>

        {/* Cross pattée */}
        <g transform={`translate(300,300) scale(${crossScale}) translate(-300,-300)`}>
          {/* Gold border */}
          <polygon points="237,237 190,56 241,50 300,102 359,50 410,56 363,237 544,191 550,241 498,300 550,359 544,409 363,363 410,544 359,550 300,498 241,550 190,544 237,363 56,409 50,359 102,300 50,241 56,191"
                   fill="url(#goldGradA)"/>
          {/* Crimson body */}
          <polygon points="243,243 198,64 248,59 300,108 352,59 402,64 357,243 536,198 541,248 492,300 541,352 536,402 357,357 402,536 352,541 300,492 248,541 198,536 243,357 64,402 59,352 108,300 59,248 64,198"
                   fill="url(#crossGradA)"/>

          {/* Tip roundels */}
          {[{x:300,y:83},{x:300,y:517},{x:83,y:300},{x:517,y:300}].map(({x,y},i)=>(
            <circle key={i} cx={x} cy={y} r="10" fill="url(#goldGradA)" stroke="#8a6514" strokeWidth="1.5"/>
          ))}
          {[{x:247,y:56},{x:353,y:56},{x:247,y:544},{x:353,y:544},{x:56,y:247},{x:56,y:353},{x:544,y:247},{x:544,y:353}].map(({x,y},i)=>(
            <circle key={i} cx={x} cy={y} r="7" fill="url(#goldGradA)" stroke="#8a6514" strokeWidth="1"/>
          ))}
        </g>

        {/* Lions - fade in sequentially */}
        <g opacity={l1}>
          <g transform="translate(255,120) scale(0.56)">
            <LionSVG fill="#c9a84c" eyeFill="#4a0000"/>
          </g>
        </g>
        <g opacity={l2}>
          <g transform="translate(345,395) scale(-0.56,0.56)">
            <LionSVG fill="#c9a84c" eyeFill="#4a0000"/>
          </g>
        </g>
        <g opacity={l3}>
          <g transform="translate(435,260) rotate(90) scale(0.56) translate(-45,-55)">
            <LionSVG fill="#c9a84c" eyeFill="#4a0000"/>
          </g>
        </g>
        <g opacity={l4}>
          <g transform="translate(165,340) rotate(-90) scale(0.56) translate(-45,-55)">
            <LionSVG fill="#c9a84c" eyeFill="#4a0000"/>
          </g>
        </g>

        {/* Central medallion */}
        <g transform={`translate(300,300) scale(${medalScale * pulse}) translate(-300,-300)`}>
          <circle cx="300" cy="300" r="70" fill="url(#centerGradA)" stroke="#8a6514" strokeWidth="3"/>
          <circle cx="300" cy="300" r="62" fill="#4a0000" stroke="#c9a84c" strokeWidth="1.5"/>
          <circle cx="300" cy="300" r="58" fill="#5a0a0a"/>
          <g transform="translate(265,255) scale(0.42)">
            <LionSVG fill="#c9a84c" eyeFill="#4a0000"/>
          </g>
          <circle cx="300" cy="300" r="74" fill="none" stroke="#c9a84c" strokeWidth="1" strokeDasharray="4 6" opacity="0.7"/>
        </g>
      </svg>
    </div>
  );
};

// Inline lion SVG component
const LionSVG: React.FC<{ fill: string; eyeFill: string }> = ({ fill, eyeFill }) => (
  <g>
    <path d="M 18,88 Q 4,68 6,48 Q 8,30 18,26 Q 24,22 21,14" stroke={fill} strokeWidth="5.5" fill="none" strokeLinecap="round"/>
    <path d="M 21,14 Q 14,5 22,8 Q 16,2 25,7 Q 20,0 28,6" stroke={fill} strokeWidth="4" fill="none" strokeLinecap="round"/>
    <ellipse cx="26" cy="72" rx="13" ry="16" fill={fill}/>
    <ellipse cx="46" cy="58" rx="17" ry="20" fill={fill}/>
    <ellipse cx="60" cy="36" rx="10" ry="14" fill={fill}/>
    {[{p:"58,12 55,4 62,10"},{p:"68,14 68,5 73,14"},{p:"76,22 82,14 80,23"},{p:"80,32 88,28 84,37"},{p:"78,42 86,42 80,49"},{p:"48,12 46,3 53,10"},{p:"40,18 34,10 40,20"},{p:"38,30 30,26 36,34"}].map(({p},i)=>(
      <polygon key={i} points={p} fill={fill}/>
    ))}
    <circle cx="62" cy="26" r="16" fill={fill}/>
    <circle cx="67" cy="22" r="3.5" fill={eyeFill}/>
    <circle cx="66" cy="21" r="1.2" fill="#fff" opacity="0.6"/>
    <path d="M 71,32 Q 75,38 71,40 Q 67,38 71,32" fill="#cc1100"/>
    <rect x="72" y="42" width="11" height="20" rx="5" fill={fill} transform="rotate(-20 77 52)"/>
    <ellipse cx="80" cy="60" rx="8" ry="5" fill={fill} transform="rotate(-20 80 60)"/>
    <rect x="58" y="68" width="10" height="22" rx="4" fill={fill}/>
    <ellipse cx="63" cy="89" rx="8" ry="4" fill={fill}/>
    <rect x="20" y="82" width="10" height="20" rx="4" fill={fill}/>
    <ellipse cx="25" cy="101" rx="9" ry="4" fill={fill}/>
  </g>
);
