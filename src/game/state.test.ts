import { describe, expect, it } from 'vitest'
import { createTutorialLevel } from './generator'
import { commitGameNodeMove, createGameState, resetGame, updateGameNode, undoLastMove } from './state'

describe('game state transitions', () => {
  it('allows another attempt after an unsuccessful tutorial move and resets positions', () => {
    const game = createGameState(createTutorialLevel())
    expect(game.nodes).toHaveLength(4)
    expect(game.crossingCount).toBe(1)
    const to = { x: 84, y: 74 }
    const dragging = updateGameNode(game, 'demo-1', to)
    const dropped = commitGameNodeMove(dragging, 'demo-1', game.positions['demo-1'], to)
    expect(dropped.status).toBe('playing')
    expect(resetGame(dropped).positions).toEqual(game.initialPositions)
  })
  it('starts the tutorial without a suggested target', () => {
    const game = createGameState(createTutorialLevel())
    expect(game.tutorialHint).toBeNull()
  })

  it('records one undo entry per completed move and restores the prior position', () => {
    const game = createGameState(createTutorialLevel())
    const from = game.positions['demo-1']
    const to = { x: 85, y: 20 }
    const moved = commitGameNodeMove(game, 'demo-1', from, to)
    expect(moved.moveHistory).toHaveLength(1)
    const undone = undoLastMove(moved)
    expect(undone.positions['demo-1']).toEqual(from)
    expect(undone.moveHistory).toHaveLength(0)
    expect(undone.crossingCount).toBe(1)
    expect(undone.status).toBe('playing')
  })

  it('marks the game won when the final crossing is removed', () => {
    const game = createGameState(createTutorialLevel())
    const from = game.positions['demo-1']
    const won = commitGameNodeMove(game, 'demo-1', from, { x: 85, y: 20 })
    expect(won.crossingCount).toBe(0)
    expect(won.status).toBe('won')
  })

  it('nudges a dropped node away from a complete overlap', () => {
    const game = createGameState(createTutorialLevel())
    const from = game.positions['demo-1']
    const moved = commitGameNodeMove(game, 'demo-1', from, game.positions['demo-0'])
    expect(moved.positions['demo-1']).not.toEqual(moved.positions['demo-0'])
  })
})
