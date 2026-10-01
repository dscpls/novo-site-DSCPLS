import React, { useState } from 'react';
import { Play, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface AlbumItem {
  title: string;
  type: 'ÁLBUM' | 'SINGLE';
  year: string;
  releaseDate?: string;
  cover: string;
  link: string;
  tracksCount?: number;
  highlight?: boolean;
}

const albums: AlbumItem[] = [
  {
    title: "SANTINHO / carta pra alguém do passado",
    type: "SINGLE",
    year: "2026",
    releaseDate: "15 de julho de 2026",
    cover: "/santinho.png",
    link: "https://open.spotify.com/intl-pt/album/3B8IoTNh5fDSwRqj48BXbU?si=fPTPcYqFRAC5j_Pie0rcKw",
    tracksCount: 1,
    highlight: true,
  },
  {
    title: "BRIGAS FÚTEIS",
    type: "SINGLE",
    year: "2026",
    releaseDate: "Fevereiro de 2026",
    cover: "https://i.imgur.com/lZHQbP4.jpeg",
    link: "https://open.spotify.com/intl-pt/album/7lh4Vx29QbXMNAfUEu2E5y?si=vs4YVpTSRWiPkkL4459I2Q",
    tracksCount: 1,
  },
  {
    title: "Receita de Preparo da Nova Geração",
    type: "ÁLBUM",
    year: "2026",
    releaseDate: "Janeiro de 2026",
    cover: "https://i.imgur.com/ScuuOEo.png",
    link: "https://open.spotify.com/intl-pt/album/5bAVtGW4hYrVpQ9ALYhPza?si=779N4WK_R7uvCk4Jd49-cQ",
    tracksCount: 14,
  },
  {
    title: "flores",
    type: "SINGLE",
    year: "2025",
    releaseDate: "Dezembro de 2025",
    cover: "https://i.imgur.com/ZnoOycl.jpeg",
    link: "https://open.spotify.com/album/4Ts0gwYGzmMU77jnjyNJiZ?si=DmnYfHfbR3ath9Ur4kAbEA",
    tracksCount: 1,
  },
  {
    title: "Teseu",
    type: "SINGLE",
    year: "2025",
    releaseDate: "Outubro de 2025",
    cover: "https://i.imgur.com/E3Vynib.png",
    link: "https://open.spotify.com/album/66P49668DzpOCYy4Ftci6W?si=45aWOiETQTmRKAnFQpPe6w",
    tracksCount: 1,
  },
  {
    title: "Amor Adolescente",
    type: "SINGLE",
    year: "2025",
    releaseDate: "Setembro de 2025",
    cover: "https://i.imgur.com/3glZR5y.jpeg",
    link: "https://open.spotify.com/intl-pt/album/2CKzzOCpqjV1DaSHT2DYa9?si=ultQfO4ORmK3vtCFk7ESrw",
    tracksCount: 1,
  },
  {
    title: "Potencial",
    type: "SINGLE",
    year: "2025",
    releaseDate: "Setembro de 2025",
    cover: "https://i.imgur.com/rjJQKbJ.jpeg",
    link: "https://open.spotify.com/album/6q5lIDeaZZg2lItSx6cfXu?si=UHszJufkSBid88SrLWg7FQ",
    tracksCount: 1,
  },
  {
    title: "Fases",
    type: "ÁLBUM",
    year: "2025",
    releaseDate: "Agosto de 2025",
    cover: "https://i.imgur.com/WQuw23g.png",
    link: "https://open.spotify.com/intl-pt/album/45gyNaXtCRSIucznnFi2wp?si=4lqhVrY3QW-flVMQEERPxg",
    tracksCount: 12,
  },
  {
    title: "BRILHO",
    type: "SINGLE",
    year: "2025",
    releaseDate: "Maio de 2025",
    cover: "https://i.imgur.com/NW1eokh.jpeg",
    link: "https://open.spotify.com/intl-pt/album/3qTFuIfhBZLIEO94QzDj98?si=EiwDfLCgSlKpMD9eXbjUvA",
    tracksCount: 1,
  }
];

export default function Discografia() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'ALL' | 'ÁLBUM' | 'SINGLE'>('ALL');

  const filteredAlbums = albums.filter(a => {
    if (filter === 'ALL') return true;
    return a.type === filter;
  });

  return (
    <div className="w-full pb-24 space-y-12">
      
      {/* Header */}
      <div className="border-b-2 border-[#FFFFFF]/15 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
            {t('disc.title')}
          </h1>

          {/* Filter Segmented Controls */}
          <div className="flex items-center gap-1 p-1 bg-[#111111] border border-[#FFFFFF]/15 font-mono text-xs uppercase self-start md:self-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 transition-colors ${
                filter === 'ALL'
                  ? 'bg-white text-black font-bold'
                  : 'text-[#E0E0E0]/70 hover:text-white'
              }`}
            >
              TODOS ({albums.length})
            </button>
            <button
              onClick={() => setFilter('ÁLBUM')}
              className={`px-3 py-1.5 transition-colors ${
                filter === 'ÁLBUM'
                  ? 'bg-[#00DF59] text-black font-bold'
                  : 'text-[#E0E0E0]/70 hover:text-white'
              }`}
            >
              ÁLBUNS (2)
            </button>
            <button
              onClick={() => setFilter('SINGLE')}
              className={`px-3 py-1.5 transition-colors ${
                filter === 'SINGLE'
                  ? 'bg-[#FFE600] text-black font-bold'
                  : 'text-[#E0E0E0]/70 hover:text-white'
              }`}
            >
              SINGLES (7)
            </button>
          </div>
        </div>
      </div>

      {/* Featured Release Spotlight (When ALL is active) */}
      {filter === 'ALL' && (
        <section className="border-2 border-[#00DF59]/50 bg-[#111111] p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="w-full sm:w-[280px] aspect-square shrink-0 border border-[#FFFFFF]/20 bg-black overflow-hidden shadow-xl">
              <img 
                src="/santinho.png"
                alt="SANTINHO / carta pra alguém do passado"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.genius.com/e96155e60bf3aee39d248c77ca496b94.1000x1000x1.png";
                }}
              />
            </div>

            <div className="flex-1 space-y-4">
              <div className="font-mono text-xs text-[#00DF59] uppercase tracking-wider">
                15 de julho de 2026
              </div>

              {/* Exact casing preserved */}
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                SANTINHO <span className="text-[#00DF59]">/</span> <span className="font-bold text-[#E0E0E0] normal-case">carta pra alguém do passado</span>
              </h2>

              <p className="text-sm sm:text-base text-[#E0E0E0]/80 font-sans max-w-2xl leading-relaxed">
                Último lançamento da DISCÍPULOS. Disponível para streaming no Spotify e no YouTube.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <a
                  href="https://open.spotify.com/intl-pt/album/3B8IoTNh5fDSwRqj48BXbU?si=fPTPcYqFRAC5j_Pie0rcKw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-5 py-3 tracking-wider hover:bg-[#FFE600] transition-colors"
                >
                  <Play size={14} fill="black" />
                  <span>{t('disc.listen')}</span>
                  <ArrowUpRight size={14} />
                </a>
                <a
                  href="https://youtu.be/ylupN-eLKq4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-[#FFFFFF]/25 hover:border-white text-white font-mono text-xs uppercase px-4 py-3 tracking-wider transition-colors"
                >
                  <span>ASSISTIR NO YOUTUBE</span>
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((item) => (
          <a
            key={item.title}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group border-2 border-[#FFFFFF]/15 bg-[#111111] hover:border-[#00DF59] transition-all flex flex-col justify-between"
          >
            {/* Square Cover Art Container */}
            <div className="aspect-square bg-black border-b-2 border-[#FFFFFF]/15 relative overflow-hidden">
              <img 
                src={item.cover}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  if (item.cover === '/santinho.png') {
                    e.currentTarget.src = "https://images.genius.com/e96155e60bf3aee39d248c77ca496b94.1000x1000x1.png";
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                <span className="bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-4 py-2 flex items-center gap-1.5 shadow-lg">
                  <Play size={13} fill="black" />
                  <span>ABRIR NO SPOTIFY</span>
                  <ArrowUpRight size={13} />
                </span>
              </div>
            </div>

            {/* Release Info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#E0E0E0]/60 mb-2">
                  <span className={item.type === 'ÁLBUM' ? 'text-[#00DF59] font-bold' : 'text-[#FFE600]'}>
                    {item.type}
                  </span>
                  <span className="tabular-nums">{item.releaseDate || item.year}</span>
                </div>

                <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#00DF59] transition-colors leading-snug">
                  {item.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-[#FFFFFF]/10 flex items-center justify-between font-mono text-[11px] text-[#E0E0E0]/50 uppercase">
                <span>{item.tracksCount ? `${item.tracksCount} ${item.tracksCount === 1 ? 'FAIXA' : 'FAIXAS'}` : 'DISCÍPULOS'}</span>
                <span className="group-hover:translate-x-1 transition-transform text-[#00DF59]">
                  SPOTIFY ↗
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

    </div>
  );
}
