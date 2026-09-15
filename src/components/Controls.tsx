type ControlsProps = {
  canUndo: boolean
  disabled: boolean
  hintActive: boolean
  onUndo: () => void
  onHint: () => void
  onReset: () => void
}

export function Controls({ canUndo, disabled, hintActive, onUndo, onHint, onReset }: ControlsProps) {
  const hintLabel = hintActive ? '取消提示' : '提示'

  return (
    <nav className="controls" aria-label="遊戲操作">
      <button className="control-button" type="button" onClick={onUndo} disabled={!canUndo || disabled}>
        <span className="control-icon" aria-hidden="true">↶</span>
        <span>復原</span>
      </button>
      <button
        className="control-button control-button--hint"
        type="button"
        onClick={onHint}
        disabled={disabled}
        aria-label={hintLabel}
        aria-pressed={hintActive}
      >
        <span className="control-icon" aria-hidden="true">{hintActive ? '×' : '✦'}</span>
        <span>{hintLabel}</span>
      </button>
      <button className="control-button" type="button" onClick={onReset} disabled={disabled}>
        <span className="control-icon" aria-hidden="true">↻</span>
        <span>重來</span>
      </button>
    </nav>
  )
}
