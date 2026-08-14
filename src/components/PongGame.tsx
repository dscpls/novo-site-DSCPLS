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
      const gain = actx.createGain();
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
      ball.dy = 5 * (Math.random() > 0.5 ? 1 : -1);
    };

    const loop = () => {
      // Clear
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, 800, 400);

      // Draw dashed center line
      ctx.setLineDash([10, 15]);
      ctx.beginPath();
      ctx.moveTo(400, 0);
      ctx.lineTo(400, 400);
      ctx.strokeStyle = '#333';
      ctx.stroke();

      // Move P1
      if (keys.w && paddle1.y > 0) paddle1.y -= 7;
      if (keys.s && paddle1.y < 400 - paddle1.height) paddle1.y += 7;

      // Move P2
      if (keys.up && paddle2.y > 0) paddle2.y -= 7;
      if (keys.down && paddle2.y < 400 - paddle2.height) paddle2.y += 7;

      // Move Ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall Bounce
      if (ball.y <= 0 || ball.y + ball.radius * 2 >= 400) {
        ball.dy *= -1;
        playBeep(200);
      }

      // Paddle Collsion
      if (
        ball.x <= 20 + paddle1.width &&
        ball.y + ball.radius * 2 >= paddle1.y &&
        ball.y <= paddle1.y + paddle1.height
      ) {
        ball.dx *= -1.05; // speed up slightly
        ball.x = 20 + paddle1.width;
        playBeep(400);
      }

      if (
        ball.x + ball.radius * 2 >= 800 - 20 - paddle2.width &&
        ball.y + ball.radius * 2 >= paddle2.y &&
        ball.y <= paddle2.y + paddle2.height
      ) {
        ball.dx *= -1.05;
        ball.x = 800 - 20 - paddle2.width - ball.radius * 2;
        playBeep(400);
      }

      // Score
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
      ctx.fillStyle = '#fff';
      ctx.fillRect(ball.x, ball.y, ball.radius * 2, ball.radius * 2);

      // Draw Score
      ctx.fillStyle = '#333';
      ctx.font = '40px monospace';
      ctx.fillText(paddle1.score.toString(), 300, 50);
      ctx.fillText(paddle2.score.toString(), 480, 50);

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
    <div className="bg-[#111] border border-[#222] rounded-lg p-6 flex flex-col items-center mt-12 w-full">
      <h2 className="text-xl text-gray-300 font-medium tracking-widest mb-4">DSCPLS GLITCH PONG</h2>
      <p className="text-sm text-gray-500 mb-8 max-w-md text-center font-mono">
        P1 (<span className="text-[#00DF59] font-bold">W/S</span>) | P2 (<span className="text-[#FFE600] font-bold">Setas</span>). Multijogador Retrô.
      </p>

      <div className="flex justify-center w-full max-w-3xl mb-4 text-white">
        {!isPlaying && <button onClick={startGame} className="text-[#00DF59] font-bold hover:underline">INICIAR JOGO</button>}
        {isPlaying && <button onClick={() => setIsPlaying(false)} className="text-gray-500 hover:text-white">PARAR</button>}
      </div>

      <div className="w-full max-w-3xl bg-[#050505] border border-[#333] relative overflow-hidden rounded-md shadow-[0_0_20px_#000]">
        {!isPlaying ? (
          <div className="aspect-[2/1] flex items-center justify-center bg-black/60 z-10 backdrop-blur-sm">
            <span className="text-gray-400 tracking-widest text-sm">PRESSIONE "INICIAR" PARA JOGAR</span>
          </div>
        ) : (
          <canvas ref={canvasRef} width="800" height="400" className="w-full h-auto block" />
        )}
      </div>
    </div>
  );
}
