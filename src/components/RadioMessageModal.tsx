import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Pause, RotateCcw, Send, CheckCircle2, AlertCircle, X, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RadioMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_RECORDING_SECONDS = 40;

export default function RadioMessageModal({ isOpen, onClose }: RadioMessageModalProps) {
  const { t } = useLanguage();

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  // Preview player states
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);

  // Form states
  const [senderName, setSenderName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Submission & status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live mic meter
  const [micVolume, setMicVolume] = useState(0);

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Stop and cleanup recording stream
  const cleanupStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Cleanup on modal unmount or close
  useEffect(() => {
    return () => {
      cleanupStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, []);

  // Handle preview audio time updates
  useEffect(() => {
    const audio = previewAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setPreviewCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlayingPreview(false);
      setPreviewCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  // Start audio recording
  const startRecording = async () => {
    setErrorMessage(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setAudioBlob(null);
    setAudioBase64(null);
    setAudioDuration(0);
    setRecordingSeconds(0);
    setIsPlayingPreview(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Setup audio analyzer for live visual feedback
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateMeter = () => {
          if (!streamRef.current) return;
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicVolume(Math.min(100, Math.round((avg / 128) * 100)));
          animationFrameRef.current = requestAnimationFrame(updateMeter);
        };
        updateMeter();
      } catch (e) {
        console.warn('AudioContext visualization not available:', e);
      }

      // Configure media recorder with optimal webm/ogg format
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      }

      const recorder = new MediaRecorder(stream, { mimeType, audioBitsPerSecond: 32000 });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(recordedBlob);
        const url = URL.createObjectURL(recordedBlob);
        setAudioUrl(url);

        // Convert blob to base64 data string for Firestore storage
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };
        reader.readAsDataURL(recordedBlob);

        cleanupStream();
      };

      recorder.start(250); // collect 250ms chunks
      setIsRecording(true);

      // 40-second countdown / counter
      const startTime = Date.now();
      timerIntervalRef.current = window.setInterval(() => {
        const elapsed = Math.min(MAX_RECORDING_SECONDS, Math.round((Date.now() - startTime) / 1000));
        setRecordingSeconds(elapsed);
        setAudioDuration(elapsed);

        if (elapsed >= MAX_RECORDING_SECONDS) {
          stopRecording();
        }
      }, 200);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setErrorMessage(t('radio.modal_mic_denied'));
      cleanupStream();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setMicVolume(0);
  };

  // Toggle preview play/pause
  const togglePreview = () => {
    if (!previewAudioRef.current) return;
    if (isPlayingPreview) {
      previewAudioRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      previewAudioRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  // Discard and re-record
  const handleRerecord = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioBase64(null);
    setAudioDuration(0);
    setRecordingSeconds(0);
    setIsPlayingPreview(false);
    startRecording();
  };

  // Submit audio message to Firestore
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBase64) {
      setErrorMessage('Por favor, grave o áudio antes de enviar.');
      return;
    }
    if (!senderName.trim()) {
      setErrorMessage('Por favor, informe seu nome ou apelido.');
      return;
    }
    if (!contact.trim()) {
      setErrorMessage('Por favor, forneça um meio de contato (Instagram, e-mail ou Discord).');
      return;
    }
    if (!acceptedTerms) {
      setErrorMessage('Você deve concordar com os termos de participação e cessão de direitos.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await addDoc(collection(db, 'radio_messages'), {
        senderName: senderName.trim(),
        contact: contact.trim(),
        location: location.trim(),
        notes: notes.trim(),
        audioData: audioBase64,
        audioMimeType: audioBlob?.type || 'audio/webm',
        durationSeconds: audioDuration || recordingSeconds,
        acceptedTerms: true,
        acceptedAt: new Date().toISOString(),
        status: 'new',
        createdAt: Date.now(),
      });

      setIsSuccess(true);
    } catch (err: any) {
      console.error('Error submitting radio message:', err);
      setErrorMessage('Erro ao enviar áudio. Verifique sua conexão e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset modal state
  const handleReset = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioBase64(null);
    setAudioDuration(0);
    setRecordingSeconds(0);
    setSenderName('');
    setContact('');
    setLocation('');
    setNotes('');
    setAcceptedTerms(false);
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-xl bg-[#090807] border-4 border-[#FFE600] rounded-xl shadow-[0_0_50px_rgba(255,230,0,0.2)] p-5 md:p-7 text-[#e0e0e0] font-sans my-8 overflow-hidden"
        >
          {/* Subtle Scanline Texture */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,230,0,0.02),rgba(255,230,0,0.02)_1px,transparent_1px,transparent_3px)] pointer-events-none z-0"></div>

          {/* Close Button */}
          <button
            onClick={handleReset}
            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition-colors p-1 border border-white/20 rounded hover:border-[#FFE600]"
          >
            <X size={20} />
          </button>

          {/* Header */}
          <div className="relative z-10 mb-6">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-[#FFE600] text-black text-[10px] font-black font-mono tracking-widest px-2.5 py-0.5 rounded-sm uppercase">
                {t('radio.modal_open_badge')}
              </span>
              <span className="text-[#00DF59] text-[10px] font-mono tracking-widest uppercase">
                {t('radio.modal_hotline')}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Mic size={22} className="text-[#00DF59]" />
              <span>{t('radio.modal_open_title')}</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-300 font-mono mt-1.5 leading-relaxed">
              {t('radio.modal_desc')}
            </p>
          </div>

          {/* SUCCESS SCREEN */}
          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative z-10 bg-[#0c140e] border-2 border-[#00DF59] p-6 rounded-lg text-center my-4"
            >
              <CheckCircle2 size={48} className="text-[#00DF59] mx-auto mb-3" />
              <h3 className="text-lg font-black text-white font-mono uppercase tracking-wider mb-2">
                {t('radio.modal_success_title')}
              </h3>
              <p className="text-xs md:text-sm text-gray-300 font-mono leading-relaxed mb-6">
                {t('radio.modal_success_desc')}
              </p>
              <button
                onClick={handleReset}
                className="w-full bg-[#00DF59] hover:bg-[#00DF59]/80 text-black font-black tracking-widest uppercase py-3 px-6 rounded font-mono text-sm border-2 border-[#FFE600] transition-transform active:scale-95"
              >
                {t('radio.modal_return')}
              </button>
            </motion.div>
          ) : (
            /* RECORDING & FORM VIEW */
            <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
              
              {/* AUDIO RECORDER CONTAINER */}
              <div className="bg-[#120d09] border-2 border-[#3d2415] rounded-lg p-4">
                <div className="flex justify-between items-center text-xs font-mono mb-3">
                  <span className="text-[#d6a858] uppercase font-bold tracking-wider flex items-center gap-1.5">
                    <Volume2 size={15} className="text-[#00DF59]" />
                    <span>RECORDER // MAX 40S</span>
                  </span>
                  <span className="text-[#FFE600] font-black">
                    {formatSeconds(isRecording ? recordingSeconds : (audioDuration || 0))} / {formatSeconds(MAX_RECORDING_SECONDS)}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#080503] h-2.5 rounded-full overflow-hidden border border-[#3d2415] mb-4">
                  <div
                    className={`h-full transition-all duration-200 ${
                      isRecording ? 'bg-red-500 animate-pulse' : audioUrl ? 'bg-[#00DF59]' : 'bg-transparent'
                    }`}
                    style={{
                      width: `${Math.min(100, ((isRecording ? recordingSeconds : audioDuration) / MAX_RECORDING_SECONDS) * 100)}%`,
                    }}
                  ></div>
                </div>

                {/* STATE 1: IDLE (NO AUDIO RECORDED YET) */}
                {!isRecording && !audioUrl && (
                  <div className="flex flex-col items-center justify-center py-4 text-center">
                    <button
                      type="button"
                      onClick={startRecording}
                      className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center border-4 border-[#FFE600] shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-transform active:scale-90 mb-3 cursor-pointer"
                    >
                      <Mic size={28} />
                    </button>
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-gray-200">
                      {t('radio.modal_record')}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Clique para liberar o microfone e iniciar
                    </span>
                  </div>
                )}

                {/* STATE 2: CURRENTLY RECORDING */}
                {isRecording && (
                  <div className="flex flex-col items-center justify-center py-2 text-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
                      <span className="text-red-400 font-mono text-xs font-black uppercase tracking-widest">
                        {t('radio.modal_recording')} [{formatSeconds(recordingSeconds)}]
                      </span>
                    </div>

                    {/* Live Visualizer feedback from mic */}
                    <div className="flex items-end justify-center gap-1.5 h-10 w-full max-w-[200px] mb-3">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const h = Math.max(4, Math.min(36, (micVolume * (1 + Math.sin(i + recordingSeconds * 4))) * 0.35));
                        return (
                          <div
                            key={i}
                            className="w-2.5 bg-[#00DF59] rounded-xs transition-all duration-75"
                            style={{ height: `${h}px` }}
                          ></div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={stopRecording}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-wider rounded border-2 border-white flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-lg"
                    >
                      <Square size={14} fill="currentColor" />
                      <span>{t('radio.modal_stop')}</span>
                    </button>
                  </div>
                )}

                {/* STATE 3: RECORDED AUDIO READY FOR PREVIEW */}
                {audioUrl && !isRecording && (
                  <div className="bg-[#0a0705] border border-[#00DF59]/40 p-3 rounded-lg">
                    {/* Hidden Native Audio Element */}
                    <audio ref={previewAudioRef} src={audioUrl} preload="auto" />

                    <div className="flex items-center justify-between gap-3">
                      {/* Play / Pause Preview Button */}
                      <button
                        type="button"
                        onClick={togglePreview}
                        className="px-4 py-2 bg-[#00DF59] hover:bg-[#00DF59]/80 text-black font-mono text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 transition-transform active:scale-95"
                      >
                        {isPlayingPreview ? (
                          <>
                            <Pause size={14} fill="currentColor" />
                            <span>{t('radio.modal_preview_pause')}</span>
                          </>
                        ) : (
                          <>
                            <Play size={14} fill="currentColor" />
                            <span>{t('radio.modal_preview_play')}</span>
                          </>
                        )}
                      </button>

                      <div className="text-right">
                        <span className="text-[#00DF59] font-mono text-xs font-bold">
                          {formatSeconds(isPlayingPreview ? previewCurrentTime : audioDuration)}
                        </span>
                        <span className="text-gray-500 font-mono text-xs"> / {formatSeconds(audioDuration)}</span>
                      </div>

                      {/* Re-record Button */}
                      <button
                        type="button"
                        onClick={handleRerecord}
                        className="px-3 py-2 bg-transparent hover:bg-white/10 text-gray-300 hover:text-white font-mono text-xs uppercase tracking-wider rounded border border-white/30 flex items-center gap-1.5 transition-colors"
                      >
                        <RotateCcw size={14} />
                        <span>{t('radio.modal_rerecord')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FORM FIELDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                {/* SENDER NAME */}
                <div>
                  <label className="block text-[11px] font-mono text-[#FFE600] font-bold uppercase tracking-wider mb-1">
                    {t('radio.modal_field_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ex: Pedro / mc_sombra"
                    className="w-full bg-[#140e09] border border-[#3d2415] focus:border-[#00DF59] text-white p-2 text-xs font-mono rounded outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                    {t('radio.modal_field_name_sub')}
                  </span>
                </div>

                {/* CONTACT */}
                <div>
                  <label className="block text-[11px] font-mono text-[#FFE600] font-bold uppercase tracking-wider mb-1">
                    {t('radio.modal_field_contact')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="@seu_instagram, seu@email.com ou user#1234"
                    className="w-full bg-[#140e09] border border-[#3d2415] focus:border-[#00DF59] text-white p-2 text-xs font-mono rounded outline-none"
                  />
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">
                    {t('radio.modal_field_contact_sub')}
                  </span>
                </div>
              </div>

              {/* LOCATION & NOTES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                <div>
                  <label className="block text-[11px] font-mono text-gray-300 font-bold uppercase tracking-wider mb-1">
                    {t('radio.modal_field_location')}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ex: São Paulo - SP"
                    className="w-full bg-[#140e09] border border-[#3d2415] focus:border-[#00DF59] text-white p-2 text-xs font-mono rounded outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-gray-300 font-bold uppercase tracking-wider mb-1">
                    {t('radio.modal_field_notes')}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Salve pro Henriz e Gebriel!"
                    className="w-full bg-[#140e09] border border-[#3d2415] focus:border-[#00DF59] text-white p-2 text-xs font-mono rounded outline-none"
                  />
                </div>
              </div>

              {/* MANDATORY RIGHTS & PARTICIPATION AGREEMENT */}
              <div className="bg-[#120e0a] border border-[#FFE600]/40 p-3 rounded text-left">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs font-mono leading-relaxed select-none">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-[#00DF59] cursor-pointer shrink-0"
                  />
                  <span className="text-gray-300 text-[11px]">
                    <strong className="text-[#FFE600]">TERMO DE AUTORIZAÇÃO: </strong>
                    {t('radio.modal_terms')}
                  </span>
                </label>
              </div>

              {/* ERROR MESSAGE */}
              {errorMessage && (
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 bg-red-950/40 border border-red-800 p-2.5 rounded">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSubmitting || !audioUrl || !acceptedTerms || !senderName.trim() || !contact.trim()}
                className="w-full bg-[#00DF59] hover:bg-[#00DF59]/80 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black tracking-widest uppercase py-3.5 px-4 rounded font-mono text-sm border-2 border-[#FFE600] flex items-center justify-center gap-2 transition-transform active:scale-98"
              >
                <Send size={16} />
                <span>{isSubmitting ? t('radio.modal_submitting') : t('radio.modal_submit')}</span>
              </button>

            </form>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
