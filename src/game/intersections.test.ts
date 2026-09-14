import { describe, expect, it } from 'vitest'
import { analyzeCrossings, crossingCount, segmentsIntersect } from './intersections'
import type { Edge, PositionMap } from '../types/game'

const point = (x: number, y: number) => ({ x, y })

describe('segment intersection engine', () => {
  it('detects a regular crossing', () => {
    expect(segmentsIntersect(point(0, 0), point(10, 10), point(0, 10), point(10, 0))).toBe(true)
  })

  it('does not detect separated segments', () => {
    expect(segmentsIntersect(point(0, 0), point(10, 0), point(0, 3), point(10, 3))).toBe(false)
  })

  it('detects endpoint contact for non-adjacent segments', () => {
    expect(segmentsIntersect(point(0, 0), point(10, 0), point(10, 0), point(10, 10))).toBe(true)
  })

  it('handles parallel, collinear and overlapping segments', () => {
    expect(segmentsIntersect(point(0, 0), point(10, 0), point(0, 2), point(10, 2))).toBe(false)
    expect(segmentsIntersect(point(0, 0), point(10, 0), point(4, 0), point(8, 0))).toBe(true)
  })

  it('does not turn a near miss into a crossing', () => {
    expect(segmentsIntersect(point(0, 0), point(10, 0), point(10, 0.001), point(20, 0.001))).toBe(false)
  })
})

describe('crossing count', () => {
  const edges: Edge[] = [
    { from: 'a', to: 'b' },
    { from: 'c', to: 'd' },
    { from: 'a', to: 'c' },
  ]

  it('ignores edges that share a node', () => {
    const positions: PositionMap = {
      a: point(0, 0),
      b: point(10, 10),
      c: point(0, 10),
      d: point(10, 0),
    }
    expect(crossingCount(edges, positions)).toBe(1)
    expect(analyzeCrossings([edges[0], edges[2]], positions).count).toBe(0)
  })

  it('reports multiple crossings and highlights both edges in each pair', () => {
    const crossingEdges: Edge[] = [
      { from: 'a', to: 'b' },
      { from: 'c', to: 'd' },
      { from: 'e', to: 'f' },
    ]
    const positions: PositionMap = {
      a: point(0, 0), b: point(10, 10),
      c: point(0, 10), d: point(10, 0),
      e: point(0, 5), f: point(10, 5),
    }
    const result = analyzeCrossings(crossingEdges, positions)
    expect(result.count).toBe(3)
    expect(result.crossingEdges.size).toBe(3)
  })
})
