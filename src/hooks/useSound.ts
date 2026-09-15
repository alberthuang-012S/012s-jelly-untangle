import { useEffect, useRef, useState } from 'react'
import { JellySound } from '../audio/sound'
import type { GameState } from '../types/game'

export function useSound(game: GameState | null) {
  const [sound] = useState(() => new JellySound())
  const [enabled, setEnabled] = useState(sound.enabled)
  const previous = useRef<GameState | null>(null)

  useEffect(() => {
    const unlock = () => sound.unlock()
    const click = (event: MouseEvent) => {
      const button = event.target instanceof Element ? event.target.closest('button') : null
      if (!button || button.disabled || button.classList.contains('jelly-node') || button.dataset.soundToggle) return
      sound.unlock()
      sound.play('click')
    }
    const hide = () => { if (document.hidden) sound.stop() }
    document.addEventListener('pointerdown', unlock)
    document.addEventListener('keydown', unlock)
    document.addEventListener('click', click)
    document.addEventListener('visibilitychange', hide)
    return () => {
      document.removeEventListener('pointerdown', unlock)
      document.removeEventListener('keydown', unlock)
      document.removeEventListener('click', click)
      document.removeEventListener('visibilitychange', hide)
      sound.dispose()
    }
  }, [sound])

  useEffect(() => {
    const before = previous.current
    previous.current = game
    if (!game || !before || before.initialPositions !== game.initialPositions) return
    if (game.status === 'won' && before.status !== 'won') sound.play('win')
    else if (game.moveHistory.length > before.moveHistory.length) sound.play('drop')
    else if (game.moveHistory === before.moveHistory && game.crossingCount > 0 && game.crossingCount < before.crossingCount) sound.play('progress')
  }, [game, sound])

  return {
    enabled,
    toggle: () => {
      sound.setEnabled(!enabled)
      setEnabled(!enabled)
      if (!enabled) sound.unlock()
    },
    grab: () => { sound.unlock(); sound.play('grab') },
  }
}
