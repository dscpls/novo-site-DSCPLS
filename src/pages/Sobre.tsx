import React from 'react';
import { motion } from 'motion/react';

export default function Sobre() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-3xl mx-auto pt-20 pb-40"
    >
      <div className="flex items-center gap-4 mb-12">
        <h1 className="text-3xl tracking-[0.2em] font-light text-white">SOBRE A BANDA</h1>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-red-500/50 to-transparent"></div>
      </div>

      <div className="space-y-6 text-[15px] leading-snug tracking-wide text-gray-300 font-light">
        <p>
          <strong className="text-white font-medium">DISCÍPULOS</strong>, abreviados oficialmente como DSCPLS, é um duo de hip-hop alternativo brasileiro fundado por Henriz em 29 de abril de 2025. O grupo reúne Henriz, 16 anos, natural de Campo Grande, Mato Grosso do Sul, e Gebriel, 18 anos, natural de Suzano, São Paulo, estudante de Direito na Universidade de São Paulo e, assim como Henriz, editor de vídeo de formação.
        </p>
        <p>
          A parceria, contudo, antecede a música. Os dois se conheceram em 2018 em um Amino dedicado a YouTubers de animação e construíram ao longo dos anos uma amizade que eventualmente encontraria na linguagem do hip-hop seu ponto de convergência. Quando a DISCÍPULOS foi fundada, a parceria já tinha sete anos de base.
        </p>
        <p>
          O primeiro sinal público do grupo foi o single "BRILHO", lançado em 10 de maio de 2025, faixa que integraria o então projeto em desenvolvimento RUÍDO. O álbum não chegaria a ser lançado em sua forma original. Cancelado e profundamente retrabalhado, o material de RUÍDO serviu de base para o que se tornaria o primeiro álbum oficial da DISCÍPULOS. O beat de "chance" e a gravação de "acabou" sobreviveram à transição e encontraram seu lugar definitivo em Fases.
        </p>
        <p>
          Lançado em 28 de agosto de 2025, Fases é um álbum-conceito que acompanha a trajetória emocional de um relacionamento através do protagonista Ícaro, da atração ao encerramento. Em primeiro de janeiro de 2026, chegou Receita de Preparo da Nova Geração, conhecido pela sigla RDPDNG, trabalho que amplia o escopo temático do grupo, abordando ansiedade geracional, identidade e o peso de crescer em um mundo em transformação.
        </p>
        <p>
          Em 23 de março de 2026, Henriz e Gebriel se encontraram pessoalmente pela primeira vez, enquanto Henriz estava em São Paulo para o Lollapalooza, onde assistiu a uma apresentação de Tyler, the Creator. Os dois passaram a tarde juntos no bairro da Liberdade. Uma amizade de quase uma década finalmente ocupando espaço físico.
        </p>
        <p>
          Profundamente influenciados por BROCKHAMPTON e por Tyler, the Creator, os DISCÍPULOS operam a partir do mesmo comprometimento conceitual de seus referenciais: projetos pensados como narrativas completas, letras que transitam entre o particular e o coletivo, e uma recusa ao superficial.
        </p>
        <p className="text-xl text-white pt-4 font-normal tracking-wider">
          A DISCÍPULOS existe há pouco tempo. Mas age como se tivesse muito a dizer, porque tem.
        </p>
      </div>
    </motion.div>
  );
}
