import React, { useEffect, useRef } from 'react';

interface AudioVisualizerProps {
  isPlaying: boolean;
  powerOn: boolean;
  barCount?: number;
  className?: string;
}

export default function AudioVisualizer({
  isPlaying,
  powerOn,
  barCount = 28,
  className = '',
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Target heights and current smoothed heights for each bar
    const heights = new Array(barCount).fill(0);
    const peaks = new Array(barCount).fill(0);
    const peakDecay = new Array(barCount).fill(0);

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const totalGap = (barCount - 1) * 2.5;
      const barWidth = Math.max(2, (width - totalGap) / barCount);

      phase += 0.08;

      for (let i = 0; i < barCount; i++) {
        let target = 2;

        if (powerOn && isPlaying) {
          // Harmonic wave patterns simulating bass, mids, and highs with noise
          const normalizedIdx = i / barCount;
          // Bass frequencies (left) tend to have higher amplitude
          const bassBoost = 1.0 - normalizedIdx * 0.35;
          const wave1 = Math.sin(phase * 1.5 + i * 0.45);
          const wave2 = Math.cos(phase * 2.8 - i * 0.3);
          const wave3 = Math.sin(phase * 0.7 + i * 0.15);
          const jitter = (Math.sin(phase * 7 + i * 13) + 1) * 0.25;

          const raw = Math.abs(wave1 * 0.4 + wave2 * 0.35 + wave3 * 0.25 + jitter);
          target = Math.max(4, Math.min(height - 4, raw * height * bassBoost * 0.95));
        } else if (powerOn && !isPlaying) {
          // Low idle standby flicker
          target = 2 + Math.sin(phase * 0.5 + i) * 1.5;
        } else {
          // Off
          target = 1;
        }

        // Smooth easing towards target
        heights[i] += (target - heights[i]) * 0.22;

        // Peak hold physics
        if (heights[i] >= peaks[i]) {
          peaks[i] = heights[i];
          peakDecay[i] = 0;
        } else {
          peakDecay[i] += 0.15;
          peaks[i] = Math.max(heights[i], peaks[i] - peakDecay[i]);
        }

        const x = i * (barWidth + 2.5);
        const barH = Math.max(2, heights[i]);
        const y = height - barH;

        // Draw segmented retro VFD LED blocks
        const segmentHeight = 3;
        const segmentGap = 1.5;
        const numSegments = Math.floor(barH / (segmentHeight + segmentGap));

        for (let s = 0; s < numSegments; s++) {
          const segY = height - (s + 1) * (segmentHeight + segmentGap);
          const segRatio = s / Math.max(1, Math.floor(height / (segmentHeight + segmentGap)));

          if (!powerOn) {
            ctx.fillStyle = 'rgba(40, 50, 40, 0.3)';
          } else if (!isPlaying) {
            ctx.fillStyle = 'rgba(0, 223, 89, 0.2)';
          } else if (segRatio > 0.85) {
            ctx.fillStyle = '#FF3838'; // Peak red clipping
          } else if (segRatio > 0.65) {
            ctx.fillStyle = '#FFE600'; // High amber
          } else {
            ctx.fillStyle = '#00DF59'; // Normal VFD bright green
          }

          ctx.fillRect(x, segY, barWidth, segmentHeight);
        }

        // Draw peak hold dot
        if (powerOn && isPlaying && peaks[i] > 6) {
          const peakY = height - peaks[i];
          ctx.fillStyle = peaks[i] / height > 0.85 ? '#FF3838' : '#FFE600';
          ctx.fillRect(x, Math.max(0, peakY - 2), barWidth, 2);
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, powerOn, barCount]);

  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        width={340}
        height={38}
        className="w-full h-8 md:h-10 block"
      />
    </div>
  );
}
