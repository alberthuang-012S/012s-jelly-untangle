import type { JellyNode as JellyNodeType, Position } from '../types/game'
import { useState } from 'react'

type JellyNodeProps = {
  node: JellyNodeType
  position: Position
  isDragging: boolean
  onPointerDown: (event: React.PointerEvent<HTMLButtonElement>, nodeId: string) => void
}

const assetBase = `${import.meta.env.BASE_URL}assets/`

export function JellyNode({ node, position, isDragging, onPointerDown }: JellyNodeProps) {
  const [loadedAsset, setLoadedAsset] = useState<string | null>(null)
  const ready = loadedAsset === node.asset
  return (
    <button
      className={`jelly-node${isDragging ? ' jelly-node--dragging' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      type="button"
      aria-label={`拖動 ${node.label}`}
      data-node-id={node.id}
      onPointerDown={(event) => onPointerDown(event, node.id)}
    >
      <span className="jelly-node__halo" aria-hidden="true" />
      {!ready && (
        <svg className="jelly-node__fallback" viewBox="0 0 100 100" aria-hidden="true">
          <path d="M25 57 Q15 90 33 79 Q40 96 48 79 Q57 97 65 79 Q85 91 75 57" fill="#86cddd" />
          <path d="M14 54 C14 6 86 6 86 54 Q86 71 50 68 Q14 71 14 54" fill="#b5e8ee" stroke="#70bccc" strokeWidth="2" />
          <ellipse cx="36" cy="46" rx="3" ry="5" fill="#345b73" />
          <ellipse cx="64" cy="46" rx="3" ry="5" fill="#345b73" />
          <path d="M43 56 Q50 62 57 56" fill="none" stroke="#345b73" strokeWidth="2" strokeLinecap="round" />
        </svg>
      )}
      <img
        key={node.asset}
        className="jelly-node__image"
        style={{ opacity: ready ? 1 : 0 }}
        src={`${assetBase}${node.asset}`}
        alt=""
        draggable={false}
        loading="eager"
        decoding="async"
        onLoad={() => setLoadedAsset(node.asset)}
        onError={() => setLoadedAsset(null)}
      />
    </button>
  )
}
