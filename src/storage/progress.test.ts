import { beforeEach, describe, expect, it } from 'vitest'
import { getUnlockedLevel, recordLevelCompletion } from './progress'

describe('level progress', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts each difficulty with only the first level unlocked', () => {
    expect(getUnlockedLevel('basic')).toBe(1)
    expect(getUnlockedLevel('normal')).toBe(1)
    expect(getUnlockedLevel('challenge')).toBe(1)
  })

  it('unlocks the next level for only the completed difficulty', () => {
    recordLevelCompletion('basic', 1)

    expect(getUnlockedLevel('basic')).toBe(2)
    expect(getUnlockedLevel('normal')).toBe(1)
    expect(getUnlockedLevel('challenge')).toBe(1)
  })

  it('does not move progress backwards and caps at the final level', () => {
    recordLevelCompletion('normal', 4)
    recordLevelCompletion('normal', 2)
    expect(getUnlockedLevel('normal')).toBe(5)

    recordLevelCompletion('normal', 10)
    expect(getUnlockedLevel('normal')).toBe(10)
  })
})
