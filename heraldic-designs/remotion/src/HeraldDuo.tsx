import { useCurrentFrame, interpolate } from "remotion";
import { CoatOfArms } from "./CoatOfArms";
import { LionCross } from "./LionCross";

export const HeraldDuo: React.FC = () => {
  const frame = useCurrentFrame();

  // Left coat of arms slides in from left
  const leftX = interpolate(frame, [0, 30], [-600, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Right lion cross slides in from right
  const rightX = interpolate(frame, [10, 40], [600, 0], {
    extrapolateRight: "clamp",
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });

  // Title fades in
  const titleOpacity = interpolate(frame, [45, 75], [0, 1], { extrapolateRight: "clamp" });

  // Divider grows
  const dividerH = interpolate(frame, [50, 90], [0, 520], { extrapolateRight: "clamp" });

  return (
    <div style={{
      width: 1280,
      height: 720,
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Background vignette */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse at center, #1a0a0a 0%, #080808 70%)",
      }}/>

      {/* Left — Coat of Arms */}
      <div style={{
        position: "absolute",
        left: 40 + leftX,
        top: "50%",
        transform: "translateY(-50%) scale(0.82)",
        transformOrigin: "center center",
      }}>
        <CoatOfArms/>
      </div>

      {/* Center divider */}
      <div style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: 1,
        height: dividerH,
        background: "linear-gradient(to bottom, transparent, #c9a84c66, transparent)",
      }}/>

      {/* Title */}
      <div style={{
        position: "absolute",
        bottom: 32,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: titleOpacity,
        fontFamily: "Georgia, serif",
        fontSize: 11,
        letterSpacing: "0.4em",
        textTransform: "uppercase",
        color: "#c9a84c88",
      }}>
        Heraldic Design System
      </div>

      {/* Right — Lion Cross */}
      <div style={{
        position: "absolute",
        right: 40 - rightX,
        top: "50%",
        transform: "translateY(-50%) scale(0.82)",
        transformOrigin: "center center",
      }}>
        <LionCross/>
      </div>
    </div>
  );
};
