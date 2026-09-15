import { DIFFICULTY_CONFIG, LEVELS_PER_DIFFICULTY } from '../game/difficulty'
import type { Difficulty } from '../types/game'

type LevelSelectProps = {
  difficulty: Difficulty
  onSelectLevel: (difficulty: Difficulty, levelNumber: number) => void
  onBack: () => void
}

export function LevelSelect({ difficulty, onSelectLevel, onBack }: LevelSelectProps) {
  const config = DIFFICULTY_CONFIG[difficulty]

  return (
    <section className="level-select" aria-labelledby="level-select-heading">
      <div className="level-select__topline">
        <p className="level-select__difficulty">{config.shortLabel} · {config.label}</p>
        <button className="level-select__back" type="button" onClick={onBack}>返回難度</button>
      </div>
      <h2 id="level-select-heading">選擇關卡</h2>
      <p className="level-select__description">每種難度共有 {LEVELS_PER_DIFFICULTY} 關，選一關開始挑戰。</p>
      <div className="level-grid">
        {Array.from({ length: LEVELS_PER_DIFFICULTY }, (_, index) => {
          const levelNumber = index + 1
          return (
            <button
              key={levelNumber}
              className="level-button"
              type="button"
              aria-label={`第 ${levelNumber} 關`}
              onClick={() => onSelectLevel(difficulty, levelNumber)}
            >
              <span className="level-button__number">{String(levelNumber).padStart(2, '0')}</span>
              <span className="level-button__label">第 {levelNumber} 關</span>
            </button>
          )
        })}
      </div>
      <p className="level-select__note">完成一關後，可以繼續挑戰下一關。</p>
    </section>
  )
}
