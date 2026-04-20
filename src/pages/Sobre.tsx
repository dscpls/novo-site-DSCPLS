import React from 'react';
import { motion } from 'motion/react';

export default function Sobre() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-6xl mx-auto pt-10 pb-40"
    >
      {/* ORIGEM / MANIFESTO */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">A ORIGEM</h1>
          <div className="h-[4px] flex-1 bg-white/20"></div>
        </div>

        <div className="columns-1 md:columns-2 gap-12 space-y-6 text-base md:text-lg leading-relaxed text-gray-300 font-bold">
          <p>
            <strong className="text-white text-xl uppercase">DISCÍPULOS</strong>, abreviados oficialmente como DSCPLS, é um duo de hip-hop alternativo brasileiro fundado por Henriz em 29 de abril de 2025. O grupo reúne Henriz, 16 anos, natural de Campo Grande, Mato Grosso do Sul, e Gebriel, 18 anos, natural de Suzano, São Paulo, estudante de Direito na Universidade de São Paulo e, assim como Henriz, editor de vídeo de formação.
          </p>
          <p>
            A parceria, contudo, antecede a música. Os dois se conheceram em 2018 em um Amino dedicado a YouTubers de animação e construíram ao longo dos anos uma amizade que eventualmente encontraria na linguagem do hip-hop seu ponto de convergência. Quando a DISCÍPULOS foi fundada, a parceria já tinha sete anos de base.
          </p>
          <p>
            O primeiro sinal público do grupo foi o single <span className="underline decoration-red-500">"BRILHO"</span>, lançado em 10 de maio de 2025, faixa que integraria o então projeto em desenvolvimento RUÍDO. O álbum não chegaria a ser lançado em sua forma original. Cancelado e profundamente retrabalhado, o material de RUÍDO serviu de base para o que se tornaria o primeiro álbum oficial da DISCÍPULOS. O beat de "chance" e a gravação de "acabou" sobreviveram à transição e encontraram seu lugar definitivo em Fases.
          </p>
          <p>
            Lançado em 28 de agosto de 2025, <strong>Fases</strong> é um álbum-conceito que acompanha a trajetória emocional de um relacionamento através do protagonista Ícaro, da atração ao encerramento. Em primeiro de janeiro de 2026, chegou <strong>Receita de Preparo da Nova Geração</strong>, conhecido pela sigla RDPDNG, trabalho que amplia o escopo temático do grupo, abordando ansiedade geracional, identidade e o peso de crescer em um mundo em transformação.
          </p>
          <p>
            Em 23 de março de 2026, Henriz e Gebriel se encontraram pessoalmente pela primeira vez, enquanto Henriz estava em São Paulo para o Lollapalooza, onde assistiu a uma apresentação de Tyler, the Creator. Os dois passaram a tarde juntos no bairro da Liberdade. Uma amizade de quase uma década finalmente ocupando espaço físico.
          </p>
          <p>
            Profundamente influenciados por <em>BROCKHAMPTON</em> e por <em>Tyler, the Creator</em>, os DISCÍPULOS operam a partir do mesmo comprometimento conceitual de seus referenciais: projetos pensados como narrativas completas, letras que transitam entre o particular e o coletivo, e uma recusa ao superficial.
          </p>
        </div>
      </section>

      {/* MEMBROS */}
      <section className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="h-[4px] flex-1 bg-white/20"></div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">OS MEMBROS</h1>
          <div className="h-[4px] flex-1 bg-white/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* HENRIZ */}
          <div className="bg-[#111] border-4 border-white flex flex-col relative group">
            <div className="absolute top-0 right-0 bg-white text-black px-4 py-1 font-black uppercase text-xl z-20 border-b-4 border-l-4 border-white group-hover:bg-red-500 group-hover:text-white transition-colors">
              01
            </div>
            
            {/* Foto Placeholder */}
            <div className="w-full aspect-[4/3] bg-[#222] border-b-4 border-white relative overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              {/* SUBSTITUIR SRC PELA FOTO REAL DEPOIS */}
              <img 
                src="https://images.unsplash.com/photo-1607513746994-51f730a44832?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Henriz" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.3%22/%3E%3C/SVG%3E')] pointer-events-none mix-blend-overlay"></div>
              <span className="relative z-10 text-white/50 font-mono tracking-widest uppercase text-xs border border-white/20 p-2 backdrop-blur-sm">FOTO: HENRIZ [UPLOAD PENDENTE]</span>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">HENRIZ</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="bg-[#ff3e3e] text-white px-2 py-1 text-xs font-bold font-mono uppercase">VOCALISTA</span>
                 <span className="border border-white/30 px-2 py-1 text-xs font-bold font-mono uppercase">FUNDADOR</span>
                 <span className="border border-white/30 px-2 py-1 text-xs font-bold font-mono uppercase">DIRETOR CRIATIVO</span>
              </div>
              <div className="text-sm font-mono text-gray-400 mb-6 uppercase border-l-4 border-[#ff3e3e] pl-4">
                Campo Grande, MS — 16 anos
              </div>
              <p className="text-gray-300 font-bold leading-relaxed mb-6">
                Henriz é o fundador da DISCÍPULOS e um dos dois vocalistas do grupo. Natural de Campo Grande, MS, começou sua trajetória musical de forma solo: em 2025, lançou o EP <strong className="text-white">real.</strong>, trabalho que ele mesmo descreve como o catalisador que o fez perceber que precisava de uma banda. 
              </p>
              <p className="text-gray-300 font-bold leading-relaxed mb-6">
                Liricista, diretor criativo e responsável pelas redes sociais do grupo, está aprendendo a tocar violão e a produzir beats. Está no ensino médio e pretende cursar Cinema.
              </p>
              
              <div className="mt-auto pt-6 border-t font-mono border-white/20">
                <p className="text-xs text-gray-500 italic">
                  <span className="text-red-500 not-italic font-bold">NOTA PESSOAL:</span> "real. é tão ruim que eu apaguei de todas as plataformas possíveis, só tem uma track naquele álbum que é decente. Obrigado Deus por essa banda, porque se não, eu continuaria sendo um músico horrível."
                </p>
              </div>
            </div>
          </div>

          {/* GEBRIEL */}
          <div className="bg-[#111] border-4 border-white flex flex-col relative group mt-12 md:mt-0">
             <div className="absolute top-0 right-0 bg-white text-black px-4 py-1 font-black uppercase text-xl z-20 border-b-4 border-l-4 border-white group-hover:bg-[#00ffff] group-hover:text-black transition-colors">
              02
            </div>
            
            {/* Foto Placeholder */}
            <div className="w-full aspect-[4/3] bg-[#222] border-b-4 border-white relative overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
              {/* SUBSTITUIR SRC PELA FOTO REAL DEPOIS */}
              <img 
                src="https://images.unsplash.com/photo-1596727147705-61a532a659bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Gebriel" 
                className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,%3CSVG xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23n)%22 opacity=%220.3%22/%3E%3C/SVG%3E')] pointer-events-none mix-blend-overlay"></div>
              <span className="relative z-10 text-white/50 font-mono tracking-widest uppercase text-xs border border-white/20 p-2 backdrop-blur-sm">FOTO: GEBRIEL [UPLOAD PENDENTE]</span>
            </div>
            
            <div className="p-8 flex-1 flex flex-col">
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">GEBRIEL</h2>
              <div className="flex flex-wrap gap-2 mb-6">
                 <span className="bg-[#00ffff] text-black px-2 py-1 text-xs font-bold font-mono uppercase">VOCALISTA</span>
              </div>
              <div className="text-sm font-mono text-gray-400 mb-6 uppercase border-l-4 border-[#00ffff] pl-4">
                Suzano, SP — 18 anos
              </div>
              <p className="text-gray-300 font-bold leading-relaxed mb-6">
                Gebriel é o segundo vocalista da DISCÍPULOS. Natural de Suzano, SP, cursa Direito na Universidade de São Paulo e, como Henriz, é editor de vídeo e liricista. Por ser o único maior de idade do grupo, também cuida das partes financeiras da banda. Pratica teclado de forma independente.
              </p>
              <p className="text-gray-300 font-bold leading-relaxed mb-6">
                A amizade com Henriz começou em 2018 e resistiu a sete anos de internet antes de se tornar também uma parceria musical. 
              </p>
              
              <div className="mt-auto pt-6 border-t font-mono border-white/20">
                <p className="text-xs text-gray-500 italic">
                  <span className="text-teal-400 not-italic font-bold">VALE O REGISTRO:</span> <strong className="text-white">Fases</strong>, o álbum-conceito sobre um relacionamento que desanda, foi escrito enquanto os dois começavam a se envolver com alguém ao mesmo tempo. Henriz previu o próprio término. Gebriel ainda está namorando.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* REDES SOCIAIS E NETWORK */}
      <section className="mb-10">
        <div className="flex items-center gap-4 mb-10">
          <h1 className="text-4xl md:text-6xl tracking-tighter font-black text-white uppercase">A REDE</h1>
          <div className="h-[4px] flex-1 bg-white/20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {/* DSCPLS */}
           <a href="https://instagram.com/discipulosabanda" target="_blank" rel="noopener noreferrer" className="group bg-white text-black p-8 border-4 border-transparent hover:border-black hover:bg-black hover:text-white transition-all shadow-[8px_8px_0_#ff3e3e] hover:shadow-[12px_12px_0_#00ffff]">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-500 group-hover:text-gray-400">INSTAGRAM OFICIAL</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">@DISCIPULOSA<br/>BANDA</h3>
           </a>
           
           <a href="https://youtube.com/@ABandaDISCIPULOS" target="_blank" rel="noopener noreferrer" className="group bg-[#ff0000] text-white p-8 border-4 border-transparent hover:border-white transition-all shadow-[8px_8px_0_#000]">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-white/70 group-hover:text-white">YOUTUBE</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">OS DISCIPULOS</h3>
           </a>

           <a href="https://tiktok.com/@discipulosabanda" target="_blank" rel="noopener noreferrer" className="group bg-black text-white p-8 border-4 border-[#ff0050] hover:bg-[#00f2fe] hover:text-black hover:border-black transition-all shadow-[8px_8px_0_#fff]">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-400 group-hover:text-black/70">TIKTOK ONDE NÓS</div>
              <h3 className="text-4xl font-black uppercase tracking-tighter">TENTAMOS SER VIRAIS</h3>
           </a>

           {/* PESSOAL */}
           <a href="https://instagram.com/gqnzaroli" target="_blank" rel="noopener noreferrer" className="group bg-[#111] border-4 border-[#333] text-white p-8 hover:bg-[#ff3e3e] hover:border-[#ff3e3e] transition-all">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-500 group-hover:text-white/80">INSTAGRAM PESSOAL</div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">HENRIZ</h3>
              <p className="font-mono text-sm text-gray-400 group-hover:text-white">@gqnzaroli</p>
           </a>

           <a href="https://instagram.com/o.garibel" target="_blank" rel="noopener noreferrer" className="group bg-[#111] border-4 border-[#333] text-white p-8 hover:bg-[#00ffff] hover:border-[#00ffff] hover:text-black transition-all">
              <div className="text-sm font-mono font-bold uppercase mb-4 text-gray-500 group-hover:text-black/80">INSTAGRAM PESSOAL</div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">GEBRIEL</h3>
              <p className="font-mono text-sm text-gray-400 group-hover:text-black">@o.garibel</p>
           </a>
        </div>
      </section>

    </motion.div>
  );
}
