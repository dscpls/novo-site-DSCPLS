import React from 'react';
import { motion } from 'motion/react';

const albums = [
  {
    title: "BRIGAS FÚTEIS",
    type: "SINGLE",
    year: "2026",
    cover: "https://i.imgur.com/lZHQbP4.jpeg",
    link: "https://open.spotify.com/intl-pt/album/7lh4Vx29QbXMNAfUEu2E5y?si=vs4YVpTSRWiPkkL4459I2Q"
  },
  {
    title: "Receita de Preparo da Nova Geração",
    type: "ÁLBUM",
    year: "2026",
    cover: "https://i.imgur.com/ScuuOEo.png",
    link: "https://open.spotify.com/intl-pt/album/5bAVtGW4hYrVpQ9ALYhPza?si=779N4WK_R7uvCk4Jd49-cQ"
  },
  {
    title: "flores",
    type: "SINGLE",
    year: "2025",
    cover: "https://i.imgur.com/ZnoOycl.jpeg",
    link: "https://open.spotify.com/album/4Ts0gwYGzmMU77jnjyNJiZ?si=DmnYfHfbR3ath9Ur4kAbEA"
  },
  {
    title: "Teseu",
    type: "SINGLE",
    year: "2025",
    cover: "https://i.imgur.com/E3Vynib.png",
    link: "https://open.spotify.com/album/66P49668DzpOCYy4Ftci6W?si=45aWOiETQTmRKAnFQpPe6w"
  },
  {
    title: "Amor Adolescente",
    type: "SINGLE",
    year: "2025",
    cover: "https://i.imgur.com/3glZR5y.jpeg",
    link: "https://open.spotify.com/intl-pt/album/2CKzzOCpqjV1DaSHT2DYa9?si=ultQfO4ORmK3vtCFk7ESrw"
  },
  {
    title: "Potencial",
    type: "SINGLE",
    year: "2025",
    cover: "https://i.imgur.com/rjJQKbJ.jpeg",
    link: "https://open.spotify.com/album/6q5lIDeaZZg2lItSx6cfXu?si=UHszJufkSBid88SrLWg7FQ"
  },
  {
    title: "Fases",
    type: "ÁLBUM",
    year: "2025",
    cover: "https://i.imgur.com/WQuw23g.png",
    link: "https://open.spotify.com/intl-pt/album/45gyNaXtCRSIucznnFi2wp?si=4lqhVrY3QW-flVMQEERPxg"
  },
  {
    title: "BRILHO",
    type: "SINGLE",
    year: "2025",
    cover: "https://i.imgur.com/NW1eokh.jpeg",
    link: "https://open.spotify.com/intl-pt/album/3qTFuIfhBZLIEO94QzDj98?si=EiwDfLCgSlKpMD9eXbjUvA"
  }
];

export default function Discografia() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto pt-10 pb-40"
    >
      <div className="flex items-center gap-4 mb-20">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-red-500/50"></div>
        <h1 className="text-3xl tracking-[0.2em] font-light text-white text-center">DISCOGRAFIA</h1>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-red-500/50"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {albums.map((al, idx) => (
          <motion.a 
            href={al.link}
            target="_blank"
            rel="noopener noreferrer"
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2, duration: 0.8 }}
            className="group block relative"
          >
            <div className="overflow-hidden bg-[#111] rounded-sm aspect-square relative before:absolute before:inset-0 before:z-10 before:ring-1 before:ring-white/10 before:transition-all group-hover:before:ring-white/30 group-hover:shadow-[0_0_30px_rgba(255,62,62,0.15)] transition-all duration-500">
              <img 
                src={al.cover} 
                alt={al.title} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
                <span className="text-[#1db954] border border-[#1db954] px-6 py-2 text-xs tracking-widest bg-black/50 backdrop-blur-sm shadow-[0_0_15px_rgba(29,185,84,0.3)]">
                  OUVIR NO SPOTIFY
                </span>
              </div>
            </div>
            <div className="mt-6 flex flex-col items-start">
              <span className="text-[10px] tracking-[3px] text-gray-500 mb-2 border-b border-white/10 pb-1">{al.type} // {al.year}</span>
              <h3 className="text-lg font-medium text-white group-hover:text-[#ff3e3e] transition-colors">{al.title}</h3>
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
}
