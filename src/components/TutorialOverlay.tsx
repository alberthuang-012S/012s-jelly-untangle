import { useEffect, useRef } from 'react'

type TutorialOverlayProps = {
  complete: boolean
  onContinue: () => void
}

export function TutorialOverlay({ complete, onContinue }: TutorialOverlayProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (complete) return
    const dialog = dialogRef.current
    dialog?.showModal()
    return () => dialog?.close()
  }, [complete])
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
    <dialog ref={dialogRef} className="tutorial-intro-dialog" aria-labelledby="tutorial-intro-text" onCancel={onContinue}>
      <p id="tutorial-intro-text">嘗試移動水母，讓紅線不再交叉。</p>
      <button className="primary-button" type="button" onClick={onContinue} autoFocus>開始嘗試</button>
    </dialog>
  )
}
