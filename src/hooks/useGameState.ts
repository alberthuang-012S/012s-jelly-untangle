import { useCallback, useState } from 'react'
import { generateLevelForNumber } from '../game/generator'
import {
  clearHint,
  commitGameNodeMove,
  createGameState,
  resetGame,
  toggleHint as toggleGameHint,
  undoLastMove,
  updateGameNode,
} from '../game/state'
import type { Difficulty, GameState, Level, Position } from '../types/game'

export function useGameState() {
  const [game, setGame] = useState<GameState | null>(null)

  const loadLevel = useCallback((level: Level) => {
    setGame(createGameState(level))
  }, [])

  const startNewGame = useCallback((difficulty: Difficulty, levelNumber = 1) => {
    setGame(createGameState(generateLevelForNumber(difficulty, levelNumber)))
  }, [])

  const updateNodePosition = useCallback((nodeId: string, position: Position) => {
    setGame((current) => (current ? updateGameNode(current, nodeId, position) : current))
  }, [])

  const finishNodeMove = useCallback((nodeId: string, from: Position, to: Position) => {
    setGame((current) => (current ? commitGameNodeMove(current, nodeId, from, to) : current))
  }, [])

  const undo = useCallback(() => {
    setGame((current) => (current ? undoLastMove(current) : current))
  }, [])

  const reset = useCallback(() => {
    setGame((current) => (current ? resetGame(current) : current))
  }, [])

  const toggleHint = useCallback(() => {
    setGame((current) => (current ? toggleGameHint(current) : current))
  }, [])

  const clearGameHint = useCallback(() => {
    setGame((current) => (current ? clearHint(current) : current))
  }, [])

  return {
    game,
    loadLevel,
    startNewGame,
    updateNodePosition,
    finishNodeMove,
    undo,
    reset,
    toggleHint,
    clearGameHint,
  }
}
