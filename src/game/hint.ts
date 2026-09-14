import type { HintState, JellyNode, PositionMap } from '../types/game'

function distance(first: { x: number; y: number }, second: { x: number; y: number }): number {
  return Math.hypot(first.x - second.x, first.y - second.y)
}

export function findHint(
  nodes: JellyNode[],
  positions: PositionMap,
  solutionPositions: PositionMap,
): HintState | null {
  const candidates = nodes
    .map((node) => ({
      node,
      distance: distance(positions[node.id], solutionPositions[node.id]),
    }))
    .filter(({ distance: nodeDistance }) => nodeDistance > 2)
    .sort((first, second) => second.distance - first.distance)

  const target = candidates[0]
  if (!target) return null
  return { nodeId: target.node.id, position: solutionPositions[target.node.id] }
}
