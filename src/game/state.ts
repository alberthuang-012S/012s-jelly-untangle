import { findHint } from './hint'
import { analyzeCrossings } from './intersections'
import type { GameState, Level, Position, PositionMap } from '../types/game'
import { resolveDropPosition } from '../utils/position'

export const MOVE_THRESHOLD = 0.25

function clonePositions(positions: PositionMap): PositionMap {
  return Object.fromEntries(
    Object.entries(positions).map(([nodeId, position]) => [nodeId, { ...position }]),
  )
}

function samePosition(first: Position, second: Position): boolean {
  return Math.hypot(first.x - second.x, first.y - second.y) <= MOVE_THRESHOLD
}

export function createGameState(level: Level): GameState {
  const positions = clonePositions(level.initialPositions)
  const analysis = analyzeCrossings(level.edges, positions)
  return {
    difficulty: level.difficulty,
    nodes: level.nodes,
    edges: level.edges,
    initialPositions: clonePositions(level.initialPositions),
    solutionPositions: clonePositions(level.solutionPositions),
    positions,
    crossingCount: analysis.count,
    crossingEdges: analysis.crossingEdges,
    moveHistory: [],
    status: analysis.count === 0 ? 'won' : 'playing',
    hint: level.initialHint ? {
      nodeId: level.initialHint.nodeId,
      position: { ...level.initialHint.position },
    } : null,
  }
}

export function updateGameNode(game: GameState, nodeId: string, position: Position): GameState {
  if (game.status === 'won' || !game.positions[nodeId]) return game
  const positions = { ...game.positions, [nodeId]: { ...position } }
  const analysis = analyzeCrossings(game.edges, positions)
  return { ...game, positions, crossingCount: analysis.count, crossingEdges: analysis.crossingEdges }
}

export function commitGameNodeMove(
  game: GameState,
  nodeId: string,
  from: Position,
  to: Position,
): GameState {
  if (game.status === 'won' || !game.positions[nodeId]) return game
  const resolvedTo = resolveDropPosition(nodeId, to, game.positions)
  const positions = { ...game.positions, [nodeId]: { ...resolvedTo } }
  const analysis = analyzeCrossings(game.edges, positions)
  const moveHistory = samePosition(from, resolvedTo)
    ? game.moveHistory
    : [...game.moveHistory, { nodeId, from: { ...from }, to: { ...resolvedTo } }]
  return {
    ...game,
    positions,
    crossingCount: analysis.count,
    crossingEdges: analysis.crossingEdges,
    moveHistory,
    hint: null,
    status: analysis.count === 0 ? 'won' : 'playing',
  }
}

export function undoLastMove(game: GameState): GameState {
  const move = game.moveHistory.at(-1)
  if (!move) return game
  const positions = { ...game.positions, [move.nodeId]: { ...move.from } }
  const analysis = analyzeCrossings(game.edges, positions)
  return {
    ...game,
    positions,
    crossingCount: analysis.count,
    crossingEdges: analysis.crossingEdges,
    moveHistory: game.moveHistory.slice(0, -1),
    hint: null,
    status: 'playing',
  }
}

export function resetGame(game: GameState): GameState {
  const positions = clonePositions(game.initialPositions)
  const analysis = analyzeCrossings(game.edges, positions)
  return {
    ...game,
    positions,
    crossingCount: analysis.count,
    crossingEdges: analysis.crossingEdges,
    moveHistory: [],
    hint: null,
    status: 'playing',
  }
}

export function addHint(game: GameState): GameState {
  return { ...game, hint: findHint(game.nodes, game.positions, game.solutionPositions) }
}

export function clearHint(game: GameState): GameState {
  return game.hint ? { ...game, hint: null } : game
}
