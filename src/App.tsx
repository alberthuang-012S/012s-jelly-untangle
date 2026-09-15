import { useEffect, useState } from 'react'
import { Controls } from './components/Controls'
import { DifficultySelect } from './components/DifficultySelect'
import { GameBoard } from './components/GameBoard'
import { Header } from './components/Header'
import { SettingsPanel } from './components/SettingsPanel'
import { TutorialOverlay } from './components/TutorialOverlay'
import { WinModal } from './components/WinModal'
import { DIFFICULTY_CONFIG, LEVELS_PER_DIFFICULTY } from './game/difficulty'
import { createTutorialLevel } from './game/generator'
import { useGameState } from './hooks/useGameState'
import { isTutorialComplete, markTutorialComplete } from './storage/tutorial'
import type { Difficulty } from './types/game'

function HomeScreen({
  onSelect,
  onTutorial,
}: {
  onSelect: (difficulty: Difficulty) => void
  onTutorial: () => void
}) {
  return (
    <main className="home-screen">
      <div className="home-orbit home-orbit--one" aria-hidden="true" />
      <div className="home-orbit home-orbit--two" aria-hidden="true" />
      <section className="hero-copy">
        <p className="hero-kicker"><span aria-hidden="true">✦</span> 012S JELLY SERIES</p>
        <h1><span>JELLY</span><strong>UNTANGLE</strong></h1>
        <p className="hero-title-zh">水母解結</p>
        <p className="hero-description">拖動水母，解開所有交錯的能量線。</p>
      </section>
      <div className="hero-jelly" aria-hidden="true">
        <div className="hero-jelly__ring" />
        <img src={`${import.meta.env.BASE_URL}assets/jelly-sparkle.webp`} alt="" />
        <span className="hero-jelly__spark hero-jelly__spark--one">✦</span>
        <span className="hero-jelly__spark hero-jelly__spark--two">✧</span>
      </div>
      <DifficultySelect onSelect={onSelect} onTutorial={onTutorial} />
      <p className="home-footnote"><span aria-hidden="true">○</span> 所有交叉消失即可過關</p>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<'home' | 'game'>('home')
  const [difficulty, setDifficulty] = useState<Difficulty>('basic')
  const [levelNumber, setLevelNumber] = useState(1)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [tutorialMode, setTutorialMode] = useState(false)
  const [tutorialComplete, setTutorialComplete] = useState(false)
  const [winVisible, setWinVisible] = useState(false)
  const {
    game,
    loadLevel,
    startNewGame,
    updateNodePosition,
    finishNodeMove,
    undo,
    reset,
    hint,
    clearGameHint,
  } = useGameState()

  useEffect(() => {
    if (!game || game.status !== 'won') {
      setWinVisible(false)
      return undefined
    }
    if (tutorialMode) {
      const timer = window.setTimeout(() => setTutorialComplete(true), 650)
      return () => window.clearTimeout(timer)
    }
    const timer = window.setTimeout(() => setWinVisible(true), 850)
    return () => window.clearTimeout(timer)
  }, [game?.status, tutorialMode])

  const startDifficulty = (nextDifficulty: Difficulty) => {
    setDifficulty(nextDifficulty)
    setLevelNumber(1)
    setScreen('game')
    setSettingsOpen(false)
    setWinVisible(false)
    setTutorialComplete(false)
    if (nextDifficulty === 'basic' && !isTutorialComplete()) {
      setTutorialMode(true)
      loadLevel(createTutorialLevel())
    } else {
      setTutorialMode(false)
      startNewGame(nextDifficulty, 1)
    }
  }

  const startTutorial = () => {
    setDifficulty('basic')
    setLevelNumber(0)
    setScreen('game')
    setSettingsOpen(false)
    setTutorialMode(true)
    setTutorialComplete(false)
    setWinVisible(false)
    loadLevel(createTutorialLevel())
  }

  const backToHome = () => {
    setScreen('home')
    setLevelNumber(1)
    setSettingsOpen(false)
    setTutorialMode(false)
    setTutorialComplete(false)
    setWinVisible(false)
  }

  const finishTutorial = () => {
    markTutorialComplete()
    setScreen('home')
    setTutorialMode(false)
    setTutorialComplete(false)
    setWinVisible(false)
  }

  const restartCurrentGame = () => {
    setWinVisible(false)
    setTutorialComplete(false)
    startNewGame(difficulty, levelNumber)
  }

  const nextLevel = () => {
    setWinVisible(false)
    if (levelNumber >= LEVELS_PER_DIFFICULTY) {
      setScreen('home')
      setLevelNumber(1)
      return
    }

    const nextLevelNumber = levelNumber + 1
    setLevelNumber(nextLevelNumber)
    startNewGame(difficulty, nextLevelNumber)
  }

  if (screen === 'home') {
    return <HomeScreen onSelect={startDifficulty} onTutorial={startTutorial} />
  }

  if (!game) return null

  const config = DIFFICULTY_CONFIG[difficulty]
  const isTutorialWin = tutorialMode && tutorialComplete

  return (
    <div className="app-shell game-shell">
      <Header onBack={backToHome} settingsOpen={settingsOpen} onToggleSettings={() => setSettingsOpen((open) => !open)} />
      {settingsOpen && (
        <SettingsPanel
          currentDifficulty={difficulty}
          onSelectDifficulty={startDifficulty}
          onHome={backToHome}
        />
      )}
      <main className="game-screen">
        <section className="game-intro" aria-live="polite">
          <div>
          <p className="game-intro__eyebrow">
            {tutorialMode ? 'TUTORIAL · 教學關卡' : `${config.shortLabel} · ${config.label} · 第 ${game.levelNumber} / ${LEVELS_PER_DIFFICULTY} 關`}
          </p>
            <h1>{tutorialMode ? '先試試看' : '整理這團能量線'}</h1>
          </div>
          <div className={`crossing-counter${game.crossingCount === 0 ? ' crossing-counter--clear' : ''}`}>
            <span className="crossing-counter__number">{game.crossingCount}</span>
            <span className="crossing-counter__label">{game.crossingCount === 0 ? '全部解開' : '個交叉'}</span>
          </div>
        </section>
        <div className="game-area">
          <GameBoard
            game={game}
            onMove={updateNodePosition}
            onFinishMove={finishNodeMove}
            onStartMove={(nodeId) => {
              clearGameHint()
              void nodeId
            }}
          />
          {tutorialMode && !tutorialComplete && <TutorialOverlay complete={false} onContinue={finishTutorial} />}
          {isTutorialWin && <TutorialOverlay complete onContinue={finishTutorial} />}
        </div>
        <p className="game-tip"><span aria-hidden="true">✦</span> 讓所有線段不再交叉，就能解開這一題</p>
        <Controls
          canUndo={game.moveHistory.length > 0}
          disabled={game.status === 'won' || isTutorialWin}
          onUndo={undo}
          onHint={hint}
          onReset={reset}
        />
      </main>
      {winVisible && !tutorialMode && (
        <WinModal
          difficulty={difficulty}
          levelNumber={game.levelNumber}
          totalLevels={LEVELS_PER_DIFFICULTY}
          moves={game.moveHistory.length}
          onNext={nextLevel}
          onReplay={restartCurrentGame}
        />
      )}
    </div>
  )
}
