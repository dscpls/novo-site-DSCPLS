import React, { useEffect, useRef, useState } from 'react';

export default function PongGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const startGame = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let ball = { x: 400, y: 200, dx: 5, dy: 5, radius: 8 };
    let paddle1 = { y: 150, width: 10, height: 80, score: 0 };
    let paddle2 = { y: 150, width: 10, height: 80, score: 0 };
    
    const keys = { w: false, s: false, up: false, down: false };

    const playBeep = (freq: number) => {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const actx = new AudioContext();
      const osc = actx.createOscillator();
      const gain = ctx.createGain ? actx.createGain() : (actx as any).createGain();
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, actx.currentTime);
      gain.gain.setValueAtTime(0.1, actx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(actx.destination);
      osc.start();
      osc.stop(actx.currentTime + 0.1);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keys.w = true;
      if (e.key === 's' || e.key === 'S') keys.s = true;
      if (e.key === 'ArrowUp') keys.up = true;
      if (e.key === 'ArrowDown') keys.down = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') keys.w = false;
      if (e.key === 's' || e.key === 'S') keys.s = false;
      if (e.key === 'ArrowUp') keys.up = false;
      if (e.key === 'ArrowDown') keys.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const resetBall = () => {
      ball.x = 400;
      ball.y = 200;
      ball.dx = -ball.dx;
      ball.dy = (Math.random() - 0.5) * 8;
    };

    const loop = () => {
      ctx.clearRect(0, 0, 800, 400);

      // Move Paddles
      if (keys.w && paddle1.y > 0) paddle1.y -= 7;
      if (keys.s && paddle1.y < 400 - paddle1.height) paddle1.y += 7;
      if (keys.up && paddle2.y > 0) paddle2.y -= 7;
      if (keys.down && paddle2.y < 400 - paddle2.height) paddle2.y += 7;

      // Move Ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball Wall Collision
      if (ball.y <= 0 || ball.y >= 400) {
        ball.dy = -ball.dy;
        playBeep(200);
      }

      // Ball Paddle Collision
      if (
        ball.x <= 20 + paddle1.width &&
        ball.y >= paddle1.y &&
        ball.y <= paddle1.y + paddle1.height
      ) {
        ball.dx = Math.abs(ball.dx) * 1.05;
        playBeep(400);
      }
      if (
        ball.x >= 800 - 20 - paddle2.width &&
        ball.y >= paddle2.y &&
        ball.y <= paddle2.y + paddle2.height
      ) {
        ball.dx = -Math.abs(ball.dx) * 1.05;
        playBeep(400);
      }

      // Scoring
      if (ball.x <= 0) {
        paddle2.score++;
        playBeep(100);
        resetBall();
      }
      if (ball.x >= 800) {
        paddle1.score++;
        playBeep(100);
        resetBall();
      }

      // Draw Paddles
      ctx.fillStyle = '#00DF59';
      ctx.fillRect(20, paddle1.y, paddle1.width, paddle1.height);
      ctx.fillStyle = '#FFE600';
      ctx.fillRect(800 - 20 - paddle2.width, paddle2.y, paddle2.width, paddle2.height);

      // Draw Ball
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ball.x, ball.y, ball.radius * 2, ball.radius * 2);

      // Draw Score
      ctx.fillStyle = '#444444';
      ctx.font = '32px monospace';
      ctx.fillText(paddle1.score.toString(), 340, 50);
      ctx.fillText(paddle2.score.toString(), 440, 50);

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying]);

  return (
    <div className="w-full flex flex-col space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#FFFFFF]/10 pb-3">
        <p className="font-mono text-xs text-[#E0E0E0]/80">
          Jogador 1 (<span className="text-[#00DF59] font-bold">W / S</span>) e Jogador 2 (<span className="text-[#FFE600] font-bold">Setas</span>)
        </p>

        <div>
          {!isPlaying ? (
            <button
              onClick={startGame}
              className="bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-4 py-2 hover:bg-[#FFE600] transition-colors"
            >
              Iniciar jogo
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="border border-[#FFFFFF]/20 text-[#E0E0E0] hover:text-white font-mono text-xs uppercase px-4 py-2 transition-colors"
            >
              Parar
            </button>
          )}
        </div>
      </div>

      <div className="w-full bg-[#050505] border border-[#FFFFFF]/15 aspect-[2/1] relative overflow-hidden">
        {!isPlaying ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <span className="font-mono text-xs text-[#E0E0E0]/60 uppercase tracking-wider mb-3">
              Dois jogadores no mesmo teclado
            </span>
            <button
              onClick={startGame}
              className="bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-6 py-2.5 hover:bg-[#FFE600] transition-colors"
            >
              Iniciar
            </button>
          </div>
        ) : (
          <canvas ref={canvasRef} width="800" height="400" className="w-full h-full block" />
        )}
      </div>
    </div>
  );
}
