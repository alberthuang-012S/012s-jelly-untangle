import { describe, expect, it } from 'vitest'
import { createTutorialLevel } from './generator'
import { commitGameNodeMove, createGameState, undoLastMove } from './state'

describe('game state transitions', () => {
  it('starts the tutorial with one clear suggested Jelly and Ghost Position', () => {
    const game = createGameState(createTutorialLevel())
    expect(game.hint?.nodeId).toBe('demo-1')
    expect(game.hint?.position).toEqual({ x: 85, y: 20 })
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
