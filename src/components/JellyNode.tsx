import type { JellyNode as JellyNodeType, Position } from '../types/game'

type JellyNodeProps = {
  node: JellyNodeType
  position: Position
  isDragging: boolean
  isHintTarget: boolean
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>, nodeId: string) => void
}

const assetBase = `${import.meta.env.BASE_URL}assets/`

export function JellyNode({ node, position, isDragging, isHintTarget, onPointerDown }: JellyNodeProps) {
  return (
    <button
      className={`jelly-node${isDragging ? ' jelly-node--dragging' : ''}${isHintTarget ? ' jelly-node--hint' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      type="button"
      aria-label={`拖動 ${node.label}`}
      data-node-id={node.id}
      onPointerDown={(event) => onPointerDown(event, node.id)}
    >
      <span className="jelly-node__halo" aria-hidden="true" />
      <img className="jelly-node__image" src={`${assetBase}${node.asset}`} alt="" draggable={false} />
    </button>
  )
}
