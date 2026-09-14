import { useCallback, useState } from 'react'
import { generateLevel } from '../game/generator'
import {
  addHint,
  clearHint,
  commitGameNodeMove,
  createGameState,
  resetGame,
  undoLastMove,
  updateGameNode,
} from '../game/state'
import type { Difficulty, GameState, Level, Position } from '../types/game'

export function useGameState() {
  const [game, setGame] = useState<GameState | null>(null)

  const loadLevel = useCallback((level: Level) => {
    setGame(createGameState(level))
  }, [])

  const startNewGame = useCallback((difficulty: Difficulty) => {
    setGame(createGameState(generateLevel(difficulty)))
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

  const hint = useCallback(() => {
    setGame((current) => (current ? addHint(current) : current))
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
    hint,
    clearGameHint,
  }
}
