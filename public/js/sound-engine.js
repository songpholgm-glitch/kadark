// Web Audio API Sound Synthesizer for Kadark Quiz

class QuizSoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgMusicTimer = null;
        this.countdownTickTimer = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.init();
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopCountdownTicks();
            this.stopBackgroundMusic();
        }
        return this.isMuted;
    }

    stopBackgroundMusic() {
        if (this.bgMusicTimer) {
            clearInterval(this.bgMusicTimer);
            this.bgMusicTimer = null;
        }
    }

    // 1. Play Exciting Question Countdown Ticking & Suspense Rhythm
    playCountdownTicking(timeLimitSeconds = 20) {
        if (this.isMuted) return;
        this.init();
        this.stopCountdownTicks();

        let elapsed = 0;
        const total = timeLimitSeconds;

        this.countdownTickTimer = setInterval(() => {
            if (this.isMuted || !this.ctx) return;
            elapsed++;

            // Pitch & intensity increases as time runs out!
            const isUrgent = (total - elapsed) <= 5;
            const freq = isUrgent ? 880 : 440; // A5 vs A4
            const volume = isUrgent ? 0.25 : 0.12;

            this._playTone(freq, 'sine', 0.08, volume);

            // Add subtle bass pulse
            if (elapsed % 2 === 0) {
                this._playTone(110, 'triangle', 0.15, 0.15);
            }

            if (elapsed >= total) {
                this.stopCountdownTicks();
            }
        }, 1000);
    }

    stopCountdownTicks() {
        if (this.countdownTickTimer) {
            clearInterval(this.countdownTickTimer);
            this.countdownTickTimer = null;
        }
    }

    // 2. Play Get Ready 3-Second Warm-up Beeps
    playGetReadyBeep(step) {
        if (this.isMuted) return;
        this.init();
        const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        const f = freqs[step % freqs.length] || 523;
        this._playTone(f, 'sine', 0.2, 0.25);
    }

    // 3. Play Times Up / Question Reveal Sound
    playTimesUp() {
        if (this.isMuted) return;
        this.init();
        this.stopCountdownTicks();
        this._playTone(220, 'sawtooth', 0.4, 0.2);
        setTimeout(() => this._playTone(164.81, 'sawtooth', 0.6, 0.25), 150);
    }

    // 4. Play Correct Answer Chime
    playCorrect() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            this._playToneAtTime(freq, 'sine', 0.15, 0.2, now + i * 0.08);
        });
    }

    // 5. Play Wrong Answer Sound
    playWrong() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        this._playToneAtTime(311.13, 'sawtooth', 0.2, 0.25, now);
        this._playToneAtTime(293.66, 'sawtooth', 0.35, 0.25, now + 0.15);
    }

    // 6. Play Podium Victory Fanfare
    playPodiumFanfare() {
        if (this.isMuted) return;
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const melody = [
            { f: 523.25, d: 0.15, t: 0 },
            { f: 659.25, d: 0.15, t: 0.15 },
            { f: 783.99, d: 0.15, t: 0.30 },
            { f: 1046.50, d: 0.5, t: 0.45 },
            { f: 880.00, d: 0.2, t: 0.9 },
            { f: 1046.50, d: 0.8, t: 1.1 }
        ];

        melody.forEach(m => {
            this._playToneAtTime(m.f, 'triangle', m.d, 0.3, now + m.t);
        });
    }

    // Internal Helper Methods
    _playTone(freq, type, duration, vol) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(vol, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.error(e);
        }
    }

    _playToneAtTime(freq, type, duration, vol, time) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(vol, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(time);
            osc.stop(time + duration);
        } catch (e) {
            console.error(e);
        }
    }
}

const soundEngine = new QuizSoundEngine();
