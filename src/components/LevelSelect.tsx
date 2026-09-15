import { DIFFICULTY_CONFIG, LEVELS_PER_DIFFICULTY } from '../game/difficulty'
import type { Difficulty } from '../types/game'

type LevelSelectProps = {
  difficulty: Difficulty
  unlockedLevel: number
  onSelectLevel: (difficulty: Difficulty, levelNumber: number) => void
  onBack: () => void
}

export function LevelSelect({ difficulty, unlockedLevel, onSelectLevel, onBack }: LevelSelectProps) {
  const config = DIFFICULTY_CONFIG[difficulty]

  return (
    <section className="level-select" aria-labelledby="level-select-heading">
      <div className="level-select__topline">
        <p className="level-select__difficulty">{config.shortLabel} · {config.label}</p>
        <button className="level-select__back" type="button" onClick={onBack}>返回難度</button>
      </div>
      <h2 id="level-select-heading">選擇關卡</h2>
      <p className="level-select__description">目前解鎖至第 {unlockedLevel} 關，完成後會開啟下一關。</p>
      <div className="level-grid">
        {Array.from({ length: LEVELS_PER_DIFFICULTY }, (_, index) => {
          const levelNumber = index + 1
          const isLocked = levelNumber > unlockedLevel
          return (
            <button
              key={levelNumber}
              className={`level-button${isLocked ? ' level-button--locked' : ''}`}
              type="button"
              aria-label={isLocked ? `第 ${levelNumber} 關，尚未解鎖` : `第 ${levelNumber} 關`}
              disabled={isLocked}
              onClick={() => onSelectLevel(difficulty, levelNumber)}
            >
              <span className="level-button__number">{String(levelNumber).padStart(2, '0')}</span>
              <span className="level-button__label">{isLocked ? '鎖定' : `第 ${levelNumber} 關`}</span>
            </button>
          )
        })}
      </div>
      <p className="level-select__note">完成一關後，可以繼續挑戰下一關。</p>
    </section>
  )
}
