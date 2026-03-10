import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

export function useFadeIn(delay = 0, duration = 15) {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

export function useSlideUp(delay = 0, distance = 40, duration = 20) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
}

export function useScaleIn(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });
  return {
    opacity: scale,
    transform: `scale(${scale})`,
  };
}

export function useCountUp(
  target: number,
  delay = 0,
  duration = 30,
  decimals = 1
) {
  const frame = useCurrentFrame();
  const progress = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = progress * target;
  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

export function useSpringIn(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 150, mass: 0.6 },
  });
}

export function useTypewriter(text: string, delay = 0, charsPerFrame = 0.5) {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, frame - delay);
  const charCount = Math.min(Math.floor(elapsed * charsPerFrame), text.length);
  return text.slice(0, charCount);
}
