type HeaderProps = {
  onBack: () => void
  settingsOpen: boolean
  onToggleSettings: () => void
}

export function Header({ onBack, settingsOpen, onToggleSettings }: HeaderProps) {
  return (
    <header className="app-header">
      <button className="icon-button" type="button" onClick={onBack} aria-label="返回難度選擇">
        <span aria-hidden="true">←</span>
      </button>
      <div className="brand-lockup">
        <span className="brand-mark" aria-hidden="true">✦</span>
        <div>
          <p className="brand-title">JELLY UNTANGLE</p>
          <p className="brand-subtitle">水母解結</p>
        </div>
      </div>
      <button
        className={`icon-button${settingsOpen ? ' icon-button--active' : ''}`}
        type="button"
        onClick={onToggleSettings}
        aria-label="遊戲設定"
        aria-expanded={settingsOpen}
      >
        <span aria-hidden="true">⚙</span>
      </button>
    </header>
  )
}
