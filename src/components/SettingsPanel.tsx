import { DIFFICULTIES } from '../game/difficulty'
import type { Difficulty } from '../types/game'

type SettingsPanelProps = {
  currentDifficulty: Difficulty
  onSelectDifficulty: (difficulty: Difficulty) => void
  onHome: () => void
}

export function SettingsPanel({ currentDifficulty, onSelectDifficulty, onHome }: SettingsPanelProps) {
  return (
    <aside className="settings-panel" aria-label="遊戲設定">
      <p className="settings-panel__eyebrow">QUICK SETTINGS</p>
      <p className="settings-panel__title">切換難度</p>
      <div className="settings-difficulty-list">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty}
            className={currentDifficulty === difficulty ? 'settings-difficulty settings-difficulty--active' : 'settings-difficulty'}
            type="button"
            onClick={() => onSelectDifficulty(difficulty)}
          >
            <span>{difficulty === 'basic' ? '基礎' : difficulty === 'normal' ? '普通' : '挑戰'}</span>
            {currentDifficulty === difficulty && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      <button className="settings-home" type="button" onClick={onHome}>回到難度選擇</button>
    </aside>
  )
}
