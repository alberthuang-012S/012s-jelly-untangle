export type Sound = 'click' | 'grab' | 'drop' | 'progress' | 'win'
const key = 'jellyUntangleSoundEnabled'
export function readSoundEnabled(): boolean {
  try { return localStorage.getItem(key) !== 'false' } catch { return true }
}

export class JellySound {
  private context: AudioContext | null = null
  private voices = new Set<OscillatorNode>()
  private lastProgress = -Infinity
  private quietUntil = 0
  enabled = readSoundEnabled()

  setEnabled(enabled: boolean) {
    this.enabled = enabled
    if (!enabled) this.stop()
    try { localStorage.setItem(key, String(enabled)) } catch { /* Keep session preference. */ }
  }

  unlock() {
    if (!this.enabled) return
    try {
      this.context ??= new AudioContext()
      if (this.context.state === 'suspended') void this.context.resume().catch(() => {})
    } catch { /* Audio is optional on unsupported browsers. */ }
  }

  stop() {
    for (const voice of this.voices) {
      try { voice.stop() } catch { /* Already stopped. */ }
    }
    this.voices.clear()
  }

  dispose() {
    this.stop()
    void this.context?.close().catch(() => {})
    this.context = null
  }

  play(sound: Sound) {
    const context = this.context
    if (!this.enabled || !context || context.state !== 'running') return
    const now = context.currentTime
    if (sound !== 'win' && now < this.quietUntil) return
    if (sound === 'progress') {
      if (now - this.lastProgress < 0.3) return
      this.lastProgress = now
    }
    if (sound === 'win') {
      this.stop()
      this.quietUntil = now + 1.25
    }
    // Bouncy major arpeggio, a little pause, then a bright resolved chord.
    const notes = sound === 'win' ? [
      { frequency: 523.25, offset: 0, duration: 0.13, volume: 0.05 },
      { frequency: 659.25, offset: 0.11, duration: 0.13, volume: 0.05 },
      { frequency: 783.99, offset: 0.22, duration: 0.17, volume: 0.055 },
      { frequency: 1046.5, offset: 0.40, duration: 0.16, volume: 0.055 },
      { frequency: 783.99, offset: 0.55, duration: 0.12, volume: 0.04 },
      { frequency: 1046.5, offset: 0.70, duration: 0.5, volume: 0.04 },
      { frequency: 659.25, offset: 0.70, duration: 0.45, volume: 0.018 },
      { frequency: 523.25, offset: 0.70, duration: 0.45, volume: 0.018 },
      { frequency: 1567.98, offset: 0.88, duration: 0.13, volume: 0.018 },
      { frequency: 2093, offset: 1.02, duration: 0.18, volume: 0.012 },
    ] : [{
      frequency: sound === 'click' ? 640 : sound === 'grab' ? 420 : sound === 'drop' ? 320 : 880,
      offset: 0, duration: 0.12, volume: 0.055,
    }]
    notes.forEach(({ frequency, offset, duration, volume }) => {
      const start = now + offset
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = sound === 'win' && offset < 0.88 ? 'triangle' : 'sine'
      oscillator.frequency.setValueAtTime(frequency * (sound === 'win' ? (offset >= 0.88 ? 0.8 : 1) : sound === 'grab' ? 0.7 : 1.12), start)
      oscillator.frequency.exponentialRampToValueAtTime(frequency, start + 0.06)
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(volume, start + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      oscillator.connect(gain)
      gain.connect(context.destination)
      this.voices.add(oscillator)
      oscillator.onended = () => {
        oscillator.disconnect()
        gain.disconnect()
        this.voices.delete(oscillator)
      }
      oscillator.start(start)
      oscillator.stop(start + duration)
    })
  }
}
