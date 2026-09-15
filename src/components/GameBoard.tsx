import { useRef } from 'react'
import { useDragJelly } from '../hooks/useDragJelly'
import type { GameState, Position } from '../types/game'
import { EdgeLayer } from './EdgeLayer'
import { JellyNode } from './JellyNode'

type GameBoardProps = {
  game: GameState
  onMove: (nodeId: string, position: Position) => void
  onFinishMove: (nodeId: string, from: Position, to: Position) => void
  onStartMove: (nodeId: string) => void
}

export function GameBoard({ game, onMove, onFinishMove, onStartMove }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const { draggingId, handlePointerDown } = useDragJelly({
    boardRef,
    positions: game.positions,
    disabled: game.status === 'won',
    onStart: onStartMove,
    onMove,
    onFinish: onFinishMove,
  })

  return (
    <div
      className={`game-board${game.status === 'won' ? ' game-board--won' : ''}`}
      ref={boardRef}
      aria-label="Jelly Untangle 遊戲區"
    >
      <div className="board-light board-light--one" aria-hidden="true" />
      <div className="board-light board-light--two" aria-hidden="true" />
      <EdgeLayer
        edges={game.edges}
        positions={game.positions}
        crossingEdges={game.crossingEdges}
        isWon={game.status === 'won'}
      />
      <div className="node-layer">
        {game.nodes.map((node) => (
          <JellyNode
            key={node.id}
            node={node}
            position={game.positions[node.id]}
            isDragging={draggingId === node.id}
            onPointerDown={handlePointerDown}
          />
        ))}
      </div>
    </div>
  )
}
