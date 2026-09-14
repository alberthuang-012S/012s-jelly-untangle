type ControlsProps = {
  canUndo: boolean
  disabled: boolean
  onUndo: () => void
  onHint: () => void
  onReset: () => void
}

export function Controls({ canUndo, disabled, onUndo, onHint, onReset }: ControlsProps) {
  return (
    <nav className="controls" aria-label="遊戲操作">
      <button className="control-button" type="button" onClick={onUndo} disabled={!canUndo || disabled}>
        <span className="control-icon" aria-hidden="true">↶</span>
        <span>復原</span>
      </button>
      <button className="control-button control-button--hint" type="button" onClick={onHint} disabled={disabled}>
        <span className="control-icon" aria-hidden="true">✦</span>
        <span>提示</span>
      </button>
      <button className="control-button" type="button" onClick={onReset} disabled={disabled}>
        <span className="control-icon" aria-hidden="true">↻</span>
        <span>重來</span>
      </button>
    </nav>
  )
}
