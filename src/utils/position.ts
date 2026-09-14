import type { PlayableBounds, Position } from '../types/game'
import { PLAYABLE_BOUNDS } from '../game/validation'

export const MIN_NODE_DISTANCE = 11.5

export function clampPosition(position: Position, bounds: PlayableBounds = PLAYABLE_BOUNDS): Position {
  return {
    x: Math.min(bounds.maxX, Math.max(bounds.minX, position.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, position.y)),
  }
}

export function distanceBetween(first: Position, second: Position): number {
  return Math.hypot(first.x - second.x, first.y - second.y)
}

/**
 * Allows free movement while dragging, then gently separates a dropped node
 * from nearby nodes. The result is clamped after each nudge so a correction
 * cannot push a Jelly outside the playable area.
 */
export function resolveDropPosition(
  nodeId: string,
  target: Position,
  positions: Record<string, Position>,
): Position {
  let resolved = clampPosition(target)
  const otherNodes = Object.entries(positions).filter(([id]) => id !== nodeId)

  for (let iteration = 0; iteration < 10; iteration += 1) {
    let nudged = false
    for (const [otherId, otherPosition] of otherNodes) {
      const distance = distanceBetween(resolved, otherPosition)
      if (distance >= MIN_NODE_DISTANCE) continue

      const overlap = MIN_NODE_DISTANCE - distance
      const angle = distance < 0.0001
        ? ((nodeId.length + otherId.length) % 8) * (Math.PI / 4)
        : Math.atan2(resolved.y - otherPosition.y, resolved.x - otherPosition.x)
      resolved = clampPosition({
        x: resolved.x + Math.cos(angle) * overlap,
        y: resolved.y + Math.sin(angle) * overlap,
      })
      nudged = true
    }
    if (!nudged) break
  }

  return resolved
}
