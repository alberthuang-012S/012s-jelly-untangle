import { DIFFICULTY_CONFIG, DIFFICULTIES } from '../game/difficulty'
import type { Difficulty } from '../types/game'

type DifficultySelectProps = {
  onSelect: (difficulty: Difficulty) => void
}

const difficultyIcons: Record<Difficulty, string> = {
  basic: '✦',
  normal: '✧',
  challenge: '◈',
}

export function DifficultySelect({ onSelect }: DifficultySelectProps) {
  return (
    <section className="difficulty-select" aria-labelledby="difficulty-heading">
      <div className="section-kicker">CHOOSE YOUR TANGLE</div>
      <h2 id="difficulty-heading">選擇難度</h2>
      <div className="difficulty-grid">
        {DIFFICULTIES.map((difficulty) => {
          const config = DIFFICULTY_CONFIG[difficulty]
          return (
            <button
              key={difficulty}
              className={`difficulty-card difficulty-card--${difficulty}`}
              type="button"
              onClick={() => onSelect(difficulty)}
            >
              <span className="difficulty-card__icon" aria-hidden="true">{difficultyIcons[difficulty]}</span>
              <span className="difficulty-card__copy">
                <span className="difficulty-card__title">{config.label}</span>
                <span className="difficulty-card__subtitle">{config.shortLabel}</span>
                <span className="difficulty-card__description">{config.description}</span>
              </span>
              <span className="difficulty-card__meta">
                <span>{config.nodeCount} Jelly · {config.edgeCount} 線</span>
                <span>{config.estimatedTime}</span>
              </span>
              <span className="difficulty-card__arrow" aria-hidden="true">→</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
