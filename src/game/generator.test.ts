import { describe, expect, it } from 'vitest'
import { DIFFICULTIES, DIFFICULTY_CONFIG } from './difficulty'
import { generateLevel } from './generator'
import { validateLevel } from './validation'

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 0x100000000
  }
}

describe('level generator', () => {
  for (const difficulty of DIFFICULTIES) {
    it(`generates validated ${difficulty} levels`, () => {
      for (let index = 0; index < 12; index += 1) {
        const level = generateLevel(difficulty, seededRandom(index + difficulty.length * 10))
        const result = validateLevel(level, difficulty)
        expect(result.valid, result.issues.join(', ')).toBe(true)
        expect(result.solutionCrossings).toBe(0)
        expect(result.initialCrossings).toBeGreaterThanOrEqual(DIFFICULTY_CONFIG[difficulty].minCrossings)
        expect(result.initialCrossings).toBeGreaterThan(0)
        expect(level.nodes.length).toBe(DIFFICULTY_CONFIG[difficulty].nodeCount)
        expect(level.edges.length).toBe(DIFFICULTY_CONFIG[difficulty].edgeCount)
      }
    })
  }
})
