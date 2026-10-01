import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Square, Play, Pause, RotateCcw, Send, CheckCircle2, AlertCircle, X, Volume2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface RadioMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

const MAX_RECORDING_SECONDS = 40;

export default function RadioMessageModal({ isOpen, onClose, triggerRef }: RadioMessageModalProps) {
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

  // Form states (single column)
  const [senderName, setSenderName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Submission & status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Refs
  const modalRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Focus trap and accessibility
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleResetAndClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        if (triggerRef?.current) {
          triggerRef.current.focus();
        }
      };
    }
  }, [isOpen]);

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
  };

  // Cleanup on modal unmount
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

  // Start Voice Recording
  const startRecording = async () => {
    setErrorMessage(null);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;

      // Setup recorder with fallback mimeType
      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }

      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || 'audio/webm',
        });
        setAudioBlob(finalBlob);

        const url = URL.createObjectURL(finalBlob);
        setAudioUrl(url);

        // Convert to Base64
        const reader = new FileReader();
        reader.readAsDataURL(finalBlob);
        reader.onloadend = () => {
          setAudioBase64(reader.result as string);
        };

        cleanupStream();
      };

      recorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      // 1-second interval timer
      const timer = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev + 1 >= MAX_RECORDING_SECONDS) {
            stopRecording();
            return MAX_RECORDING_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);

      timerIntervalRef.current = timer;
    } catch (err: any) {
      console.error('Microphone error:', err);
      setErrorMessage(t('radio.modal_mic_denied'));
      setIsRecording(false);
      cleanupStream();
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
    setAudioDuration(recordingSeconds);
  };

  // Re-record audio
  const handleRerecord = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setIsPlayingPreview(false);
    setPreviewCurrentTime(0);
    setAudioBlob(null);
    setAudioUrl(null);
    setAudioBase64(null);
    setAudioDuration(0);
    setRecordingSeconds(0);
    setErrorMessage(null);
  };

  // Toggle Preview Play/Pause
  const togglePlayPreview = () => {
    const audio = previewAudioRef.current;
    if (!audio) return;

    if (isPlayingPreview) {
      audio.pause();
      setIsPlayingPreview(false);
    } else {
      audio.play().then(() => {
        setIsPlayingPreview(true);
      }).catch((e) => {
        console.error('Preview error:', e);
      });
    }
  };

  // Handle Form Submit to Firebase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioBase64 || !audioBlob) {
      setErrorMessage('Por favor, grave seu áudio antes de enviar.');
      return;
    }

    if (!senderName.trim() || !contact.trim()) {
      setErrorMessage('Nome e contato são campos obrigatórios.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage('Você deve concordar com os termos de cessão de direitos de voz.');
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

  // Reset and close
  const handleResetAndClose = () => {
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    cleanupStream();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    
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
    setIsRecording(false);
    setIsPlayingPreview(false);
    onClose();
  };

  if (!isOpen) return null;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="radio-modal-title"
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-xl bg-[#111111] border-2 border-[#FFFFFF]/20 p-6 md:p-8 text-[#E0E0E0] font-sans my-8"
      >
        {/* Close Button with accessible label */}
        <button
          ref={closeBtnRef}
          type="button"
          onClick={handleResetAndClose}
          aria-label="Fechar modal"
          className="absolute top-5 right-5 text-[#E0E0E0]/60 hover:text-white transition-colors p-1 border border-transparent hover:border-[#FFFFFF]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00DF59]"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <h2 id="radio-modal-title" className="text-2xl font-black uppercase tracking-tight text-white mb-2">
            {t('radio.modal_open_title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#E0E0E0]/80 font-mono leading-relaxed">
            Grave uma mensagem de voz de no máximo 40 segundos para seleção dos interlúdios do novo álbum.
          </p>
        </div>

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div className="border border-[#00DF59] bg-[#00DF59]/10 p-6 text-center space-y-4 my-2">
            <CheckCircle2 size={40} className="text-[#00DF59] mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase font-mono">
              {t('radio.modal_success_title')}
            </h3>
            <p className="text-xs sm:text-sm text-[#E0E0E0]/80 font-mono leading-relaxed">
              {t('radio.modal_success_desc')}
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="w-full bg-[#00DF59] text-black font-mono font-bold text-xs uppercase py-3 px-6 hover:bg-[#FFE600] transition-colors"
            >
              {t('radio.modal_return')}
            </button>
          </div>
        ) : (
          /* RECORDING & FORM */
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* AUDIO RECORDER BOX */}
            <div className="border border-[#FFFFFF]/15 bg-[#080706] p-4 space-y-4">
              <div className="flex justify-between items-center font-mono text-xs text-[#E0E0E0]/70">
                <span className="uppercase">Gravação de voz (máx. 40s)</span>
                <span className="tabular-nums font-bold text-white">
                  {formatSeconds(isRecording ? recordingSeconds : (audioDuration || 0))} / 00:40
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#222222] h-1.5 overflow-hidden">
                <div
                  className={`h-full transition-all duration-200 ${
                    isRecording ? 'bg-red-500' : audioUrl ? 'bg-[#00DF59]' : 'bg-transparent'
                  }`}
                  style={{
                    width: `${Math.min(100, ((isRecording ? recordingSeconds : audioDuration) / MAX_RECORDING_SECONDS) * 100)}%`,
                  }}
                ></div>
              </div>

              {/* State 1: Idle (Not recording, No audio) */}
              {!isRecording && !audioUrl && (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <button
                    type="button"
                    onClick={startRecording}
                    aria-label="Gravar áudio"
                    className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-transform active:scale-95 mb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Mic size={24} />
                  </button>
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {t('radio.modal_record')}
                  </span>
                </div>
              )}

              {/* State 2: Currently recording */}
              {isRecording && (
                <div className="flex flex-col items-center justify-center py-3 text-center space-y-3">
                  <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                    <span>GRAVANDO [{formatSeconds(recordingSeconds)}]</span>
                  </div>

                  <button
                    type="button"
                    onClick={stopRecording}
                    aria-label="Parar gravação"
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs uppercase px-5 py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Square size={14} fill="white" />
                    <span>{t('radio.modal_stop')}</span>
                  </button>
                </div>
              )}

              {/* State 3: Recorded audio preview */}
              {!isRecording && audioUrl && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <audio ref={previewAudioRef} src={audioUrl} preload="auto" className="hidden" />

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={togglePlayPreview}
                      aria-label={isPlayingPreview ? "Pausar áudio gravado" : "Ouvir áudio gravado"}
                      className="inline-flex items-center gap-2 bg-[#00DF59] text-black font-mono font-bold text-xs uppercase px-4 py-2 hover:bg-[#FFE600] transition-colors"
                    >
                      {isPlayingPreview ? <Pause size={14} fill="black" /> : <Play size={14} fill="black" />}
                      <span>{isPlayingPreview ? t('radio.modal_preview_pause') : t('radio.modal_preview_play')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleRerecord}
                      aria-label="Regravar áudio"
                      className="inline-flex items-center gap-1.5 border border-[#FFFFFF]/20 text-[#E0E0E0] hover:text-white font-mono text-xs uppercase px-3 py-2 hover:border-white transition-colors"
                    >
                      <RotateCcw size={13} />
                      <span>{t('radio.modal_rerecord')}</span>
                    </button>
                  </div>

                  <span className="font-mono text-xs text-[#00DF59] tabular-nums">
                    {formatSeconds(previewCurrentTime)} / {formatSeconds(audioDuration)}
                  </span>
                </div>
              )}
            </div>

            {/* FORM FIELDS: STRICT SINGLE COLUMN */}
            <div className="space-y-4">
              <div>
                <label htmlFor="field-name" className="block font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/80 mb-1">
                  {t('radio.modal_field_name')} *
                </label>
                <input
                  id="field-name"
                  type="text"
                  required
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Seu nome ou apelido para créditos"
                  className="w-full bg-[#080706] border border-[#FFFFFF]/20 text-white px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-[#00DF59] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="field-contact" className="block font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/80 mb-1">
                  {t('radio.modal_field_contact')} *
                </label>
                <input
                  id="field-contact"
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Instagram (@), e-mail ou Discord"
                  className="w-full bg-[#080706] border border-[#FFFFFF]/20 text-white px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-[#00DF59] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="field-location" className="block font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/80 mb-1">
                  {t('radio.modal_field_location')}
                </label>
                <input
                  id="field-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Cidade / Estado"
                  className="w-full bg-[#080706] border border-[#FFFFFF]/20 text-white px-3.5 py-2.5 font-mono text-xs focus:outline-none focus:border-[#00DF59] transition-colors"
                />
              </div>

              <div>
                <label htmlFor="field-notes" className="block font-mono text-xs uppercase tracking-wider text-[#E0E0E0]/80 mb-1">
                  {t('radio.modal_field_notes')}
                </label>
                <textarea
                  id="field-notes"
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contexto ou comentário sobre o áudio"
                  className="w-full bg-[#080706] border border-[#FFFFFF]/20 text-white px-3.5 py-2 font-sans text-xs focus:outline-none focus:border-[#00DF59] transition-colors resize-none"
                />
              </div>

              {/* Legal Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-1 accent-[#00DF59] w-4 h-4 rounded-none cursor-pointer"
                  />
                  <span className="font-mono text-[11px] text-[#E0E0E0]/80 leading-relaxed">
                    {t('radio.modal_terms')}
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 border border-red-500/50 bg-red-950/30 text-red-300 font-mono text-xs flex items-start gap-2">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !audioBlob || isRecording}
              className="w-full bg-[#00DF59] hover:bg-[#FFE600] text-black font-mono font-bold text-xs uppercase py-3.5 px-6 tracking-wider transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={14} />
              <span>{isSubmitting ? t('radio.modal_submitting') : t('radio.modal_submit')}</span>
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
