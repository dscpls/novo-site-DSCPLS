import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const normalizeStr = (str: string) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
};

const questions = [
  {
    q: "QUAL A MAIOR INSPIRAÇÃO DA BANDA?",
    ans: ["brockhampton"]
  },
  {
    q: "QUAL A MELHOR BOYBAND DESDE O ONE DIRECTION?",
    ans: ["brockhampton"]
  },
  {
    q: "QUAL A MELHOR BOYBAND DESDE O BROCKHAMPTON?",
    ans: ["discipulos", "dscpls"]
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [factVisible, setFactVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep >= questions.length) return;

    const normalizedInput = normalizeStr(inputVal);
    const validAnswers = questions[currentStep].ans;

    if (validAnswers.includes(normalizedInput)) {
      setInputVal('');
      setErrorShake(false);
      setCurrentStep(s => s + 1);
    } else {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && audioRef.current.currentTime >= 10 && !factVisible) {
      setFactVisible(true);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <AnimatePresence mode="wait">
        {currentStep < questions.length ? (
          <motion.div
            key={`q-${currentStep}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, x: errorShake ? [-10, 10, -10, 10, 0] : 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase text-white mb-12 tracking-tighter">
              {questions[currentStep].q}
            </h1>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                autoFocus
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="SUA RESPOSTA..."
                className="w-full bg-transparent border-b-4 border-white text-3xl md:text-5xl text-center text-[#ff3e3e] font-black uppercase focus:outline-none focus:border-[#ff3e3e] transition-colors pb-4 placeholder-white/20"
              />
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full max-w-4xl flex flex-col items-center"
          >
            <h1 className="text-5xl md:text-7xl font-black text-[#00ffff] uppercase mb-6 tracking-tighter drop-shadow-[5px_5px_0_#ff3e3e] animate-pulse">
              VOCÊ É UM VERDADEIRO DISCÍPULO.
            </h1>
            
            <p className="text-xl md:text-2xl font-bold text-white mb-12 uppercase tracking-widest bg-black p-4 border border-white/20">
              Parabéns! Aproveite um unreleased de BROCKHAMPTON que o Henriz gosta muito.
            </p>

            <div className="w-full max-w-md bg-[#111] border-4 border-[#ff3e3e] p-6 shadow-[8px_8px_0_#fff]">
              <audio 
                ref={audioRef}
                controls 
                autoPlay 
                onTimeUpdate={handleTimeUpdate}
                className="w-full"
                src="https://cdn.discordapp.com/attachments/1137467200245088317/1495847322620395651/background.mp3?ex=69e7bbe1&is=69e66a61&hm=34f92122e9fe795d6717588cd11ec2cedb0421bbf1a023b62074a85960173cd0&"
              >
                Seu navegador não suporta o áudio.
              </audio>
            </div>

            <AnimatePresence>
              {factVisible && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 p-4 border-l-4 border-[#00ffff] bg-black/50 text-left max-w-2xl"
                >
                  <p className="text-gray-300 font-mono text-sm leading-relaxed">
                    <span className="text-[#00ffff] font-bold">fato curioso:</span> essa música se chama background, e a comunidade se juntou pra comprar 57 músicas não lançadas de um leaker não tão confiável... o fandom de brockhampton é incrível, né? gosto muito de participar :)
                    <br/><br/>
                    <span className="text-white">- Henriz</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
