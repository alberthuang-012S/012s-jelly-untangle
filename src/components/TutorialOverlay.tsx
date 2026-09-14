type TutorialOverlayProps = {
  complete: boolean
  onContinue: () => void
}

export function TutorialOverlay({ complete, onContinue }: TutorialOverlayProps) {
  if (complete) {
    return (
      <div className="tutorial-message tutorial-message--complete" role="status">
        <div className="tutorial-message__sparkle" aria-hidden="true">✦</div>
        <p className="tutorial-message__eyebrow">FIRST TANGLE SOLVED</p>
        <h2>做得好！</h2>
        <p>所有交叉都解開了。</p>
        <button className="primary-button" type="button" onClick={onContinue}>開始第一題</button>
      </div>
    )
  }

  return (
    <div className="tutorial-message tutorial-message--guide" role="status">
      <p className="tutorial-message__eyebrow">QUICK START</p>
      <h2>拖動水母</h2>
      <p>把水母移到淡淡的圈圈附近，讓紅色交叉線消失。</p>
      <span className="tutorial-message__hint"><span aria-hidden="true">✦</span> 交叉線會即時更新</span>
    </div>
  )
}
