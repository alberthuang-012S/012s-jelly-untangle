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
        <button className="primary-button" type="button" onClick={onContinue}>回到首頁</button>
      </div>
    )
  }

  return (
    <p className="tutorial-instruction" role="status">拖動發光水母，讓紅線不再交叉。</p>
  )
}
