const TUTORIAL_KEY = 'jellyUntangleTutorialComplete'

export function isTutorialComplete(): boolean {
  try {
    return window.localStorage.getItem(TUTORIAL_KEY) === 'true'
  } catch {
    return false
  }
}

export function markTutorialComplete(): void {
  try {
    window.localStorage.setItem(TUTORIAL_KEY, 'true')
  } catch {
    // Local storage can be unavailable in private browsing; the game still works.
  }
}
