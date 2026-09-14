import { edgeId } from '../game/graph'
import type { Edge, EdgeId, PositionMap } from '../types/game'

type EdgeLayerProps = {
  edges: Edge[]
  positions: PositionMap
  crossingEdges: Set<EdgeId>
  isWon?: boolean
}

export function EdgeLayer({ edges, positions, crossingEdges, isWon = false }: EdgeLayerProps) {
  return (
    <svg className="edge-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <filter id="edge-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="edge-warm-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {edges.map((edge) => {
        const from = positions[edge.from]
        const to = positions[edge.to]
        if (!from || !to) return null
        const isCrossing = crossingEdges.has(edgeId(edge)) && !isWon
        return (
          <line
            key={edgeId(edge)}
            className={isCrossing ? 'edge edge--crossing' : 'edge edge--safe'}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            filter={isCrossing ? 'url(#edge-warm-glow)' : undefined}
          />
        )
      })}
    </svg>
  )
}
