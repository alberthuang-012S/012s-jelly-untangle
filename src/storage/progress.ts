import { LEVELS_PER_DIFFICULTY } from '../game/difficulty'
import type { Difficulty } from '../types/game'

const PROGRESS_KEY = 'jellyUntangleLevelProgress'

export type LevelProgress = Record<Difficulty, number>

const defaultProgress: LevelProgress = {
  basic: 1,
  normal: 1,
  challenge: 1,
}

function normalizeLevel(value: unknown): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) return 1
  return Math.min(LEVELS_PER_DIFFICULTY, Math.max(1, value))
}

function readProgress(): LevelProgress {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY)
    if (!raw) return { ...defaultProgress }

    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return { ...defaultProgress }

    const stored = parsed as Partial<Record<Difficulty, unknown>>
    return {
      basic: normalizeLevel(stored.basic),
      normal: normalizeLevel(stored.normal),
      challenge: normalizeLevel(stored.challenge),
    }
  } catch {
    return { ...defaultProgress }
  }
}

export function getUnlockedLevel(difficulty: Difficulty): number {
  return readProgress()[difficulty]
}

export function recordLevelCompletion(difficulty: Difficulty, completedLevel: number): void {
  if (!Number.isInteger(completedLevel) || completedLevel < 1) return

  const progress = readProgress()
  const nextUnlockedLevel = Math.min(LEVELS_PER_DIFFICULTY, completedLevel + 1)
  if (nextUnlockedLevel <= progress[difficulty]) return

  progress[difficulty] = nextUnlockedLevel

  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {
    // Local storage can be unavailable in private browsing; the current game still works.
  }
}
