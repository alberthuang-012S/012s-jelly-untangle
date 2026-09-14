import type { Edge, EdgeId, Position, PositionMap } from '../types/game'
import { edgeId } from './graph'

export const GEOMETRY_EPSILON = 1e-7

function orientation(a: Position, b: Position, c: Position): number {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)
}

function pointOnSegment(a: Position, b: Position, point: Position, epsilon: number): boolean {
  return (
    point.x >= Math.min(a.x, b.x) - epsilon &&
    point.x <= Math.max(a.x, b.x) + epsilon &&
    point.y >= Math.min(a.y, b.y) - epsilon &&
    point.y <= Math.max(a.y, b.y) + epsilon
  )
}

/**
 * Inclusive segment intersection. The caller decides whether shared graph
 * endpoints should be ignored; that distinction is important for crossings.
 */
export function segmentsIntersect(
  a: Position,
  b: Position,
  c: Position,
  d: Position,
  epsilon = GEOMETRY_EPSILON,
): boolean {
  const o1 = orientation(a, b, c)
  const o2 = orientation(a, b, d)
  const o3 = orientation(c, d, a)
  const o4 = orientation(c, d, b)

  const opposite = (first: number, second: number) =>
    (first > epsilon && second < -epsilon) || (first < -epsilon && second > epsilon)

  if (opposite(o1, o2) && opposite(o3, o4)) return true

  if (Math.abs(o1) <= epsilon && pointOnSegment(a, b, c, epsilon)) return true
  if (Math.abs(o2) <= epsilon && pointOnSegment(a, b, d, epsilon)) return true
  if (Math.abs(o3) <= epsilon && pointOnSegment(c, d, a, epsilon)) return true
  if (Math.abs(o4) <= epsilon && pointOnSegment(c, d, b, epsilon)) return true
  return false
}

function edgesShareNode(first: Edge, second: Edge): boolean {
  return (
    first.from === second.from ||
    first.from === second.to ||
    first.to === second.from ||
    first.to === second.to
  )
}

export type CrossingAnalysis = {
  count: number
  crossingEdges: Set<EdgeId>
}

export function analyzeCrossings(edges: Edge[], positions: PositionMap): CrossingAnalysis {
  let count = 0
  const crossingEdges = new Set<EdgeId>()

  for (let firstIndex = 0; firstIndex < edges.length; firstIndex += 1) {
    const first = edges[firstIndex]
    const firstStart = positions[first.from]
    const firstEnd = positions[first.to]
    if (!firstStart || !firstEnd) continue

    for (let secondIndex = firstIndex + 1; secondIndex < edges.length; secondIndex += 1) {
      const second = edges[secondIndex]
      if (edgesShareNode(first, second)) continue
      const secondStart = positions[second.from]
      const secondEnd = positions[second.to]
      if (!secondStart || !secondEnd) continue

      if (segmentsIntersect(firstStart, firstEnd, secondStart, secondEnd)) {
        count += 1
        crossingEdges.add(edgeId(first))
        crossingEdges.add(edgeId(second))
      }
    }
  }

  return { count, crossingEdges }
}

export function crossingCount(edges: Edge[], positions: PositionMap): number {
  return analyzeCrossings(edges, positions).count
}
