// Audio guide player using Web Speech API and Web Audio API ambient soundscape

class AudioGuideService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private isAmbientPlaying = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    } = {}
  ): boolean {
    if (!this.synth) return false;

    this.stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;

    // Look for Vietnamese voice if available
    const voices = this.synth.getVoices();
    const viVoice = voices.find((v) => v.lang.startsWith('vi') || v.lang.includes('VN'));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    utterance.onstart = () => {
      options.onStart?.();
    };

    utterance.onend = () => {
      options.onEnd?.();
    };

    utterance.onerror = (e) => {
      options.onError?.(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
    return true;
  }

  public pauseSpeech(): void {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resumeSpeech(): void {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stopSpeech(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public toggleAmbientSound(enable?: boolean): boolean {
    const shouldPlay = enable !== undefined ? enable : !this.isAmbientPlaying;
    if (shouldPlay) {
      this.startAmbientSound();
    } else {
      this.stopAmbientSound();
    }
    return this.isAmbientPlaying;
  }

  private startAmbientSound(): void {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioContextClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.stopAmbientSound(); // clear previous if any

      const now = this.audioCtx.currentTime;
      const masterGain = this.audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.exponentialRampToValueAtTime(0.08, now + 1.5);
      masterGain.connect(this.audioCtx.destination);
      this.ambientGain = masterGain;

      // Create gentle pentatonic harmonic chords (Vietnamese traditional flute & chime warmth: D, F#, A, B, E)
      const freqs = [146.83, 220.0, 293.66, 440.0, 659.25];
      this.ambientOscillators = freqs.map((f, i) => {
        const osc = this.audioCtx!.createOscillator();
        const noteGain = this.audioCtx!.createGain();
        const panner =
          typeof (this.audioCtx as any)?.createStereoPanner === 'function'
            ? (this.audioCtx as any).createStereoPanner()
            : null;

        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        // Gentle lfo modulation
        const lfo = this.audioCtx!.createOscillator();
        lfo.frequency.setValueAtTime(0.15 + i * 0.05, now);
        const lfoGain = this.audioCtx!.createGain();
        lfoGain.gain.setValueAtTime(2.0, now);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(now);

        noteGain.gain.setValueAtTime(0.15 / (i + 1), now);

        if (panner) {
          panner.pan.setValueAtTime((i % 2 === 0 ? -1 : 1) * 0.4, now);
          osc.connect(noteGain);
          noteGain.connect(panner);
          panner.connect(masterGain);
        } else {
          osc.connect(noteGain);
          noteGain.connect(masterGain);
        }

        osc.start(now);
        return osc;
      });

      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Web Audio ambient soundscape unavailable:', e);
      this.isAmbientPlaying = false;
    }
  }

  private stopAmbientSound(): void {
    if (this.ambientGain && this.audioCtx) {
      const now = this.audioCtx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        this.ambientOscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (_) {}
        });
        this.ambientOscillators = [];
        this.isAmbientPlaying = false;
      }, 800);
    } else {
      this.ambientOscillators = [];
      this.isAmbientPlaying = false;
    }
  }

  public get isPlayingAmbient(): boolean {
    return this.isAmbientPlaying;
  }
}

export const audioGuide = new AudioGuideService();
