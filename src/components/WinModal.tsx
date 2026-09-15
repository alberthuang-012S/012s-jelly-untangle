import type { Difficulty } from '../types/game'

type WinModalProps = {
  difficulty: Difficulty
  levelNumber: number
  totalLevels: number
  moves: number
  onNext: () => void
  onReplay: () => void
}

export function WinModal({ difficulty, levelNumber, totalLevels, moves, onNext, onReplay }: WinModalProps) {
  const isLastLevel = levelNumber >= totalLevels
  const difficultyLabel = difficulty === 'basic' ? '基礎' : difficulty === 'normal' ? '普通' : '挑戰'

  return (
    <div className="win-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="win-title">
      <div className="win-modal">
        <div className="win-burst" aria-hidden="true">
          <span>✦</span><span>✧</span><span>✦</span>
        </div>
        <p className="win-modal__eyebrow">TANGLE COMPLETE</p>
        <h2 id="win-title">解開啦！</h2>
        <p className="win-modal__copy">{isLastLevel ? `已完成${totalLevels}關${difficultyLabel}挑戰` : '所有能量線都整理完成'}</p>
        <p className="win-modal__stats">{difficultyLabel} · 第 {levelNumber} / {totalLevels} 關 · {moves} 次移動</p>
        <div className="win-modal__actions">
          <button className="primary-button" type="button" onClick={onNext}>{isLastLevel ? '回到首頁' : '下一關'}</button>
          <button className="secondary-button" type="button" onClick={onReplay}>再玩一次</button>
        </div>
      </div>
    </div>
  )
}
