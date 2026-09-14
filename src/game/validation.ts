import { DIFFICULTY_CONFIG } from './difficulty'
import { edgeId, graphIsConnected, hasDuplicateEdges } from './graph'
import { analyzeCrossings } from './intersections'
import type { Difficulty, Level, PlayableBounds, Position } from '../types/game'

export const PLAYABLE_BOUNDS: PlayableBounds = {
  minX: 8,
  maxX: 92,
  minY: 10,
  maxY: 90,
}

export type ValidationResult = {
  valid: boolean
  issues: string[]
  solutionCrossings: number
  initialCrossings: number
}

function positionIsInside(position: Position): boolean {
  return (
    position.x >= PLAYABLE_BOUNDS.minX &&
    position.x <= PLAYABLE_BOUNDS.maxX &&
    position.y >= PLAYABLE_BOUNDS.minY &&
    position.y <= PLAYABLE_BOUNDS.maxY
  )
}

export function validateLevel(level: Level, difficulty: Difficulty = level.difficulty): ValidationResult {
  const config = DIFFICULTY_CONFIG[difficulty]
  const issues: string[] = []
  const nodeIds = new Set(level.nodes.map((node) => node.id))

  for (const edge of level.edges) {
    if (edge.from === edge.to) issues.push(`self edge: ${edge.from}`)
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      issues.push(`edge references unknown node: ${edgeId(edge)}`)
    }
  }
  if (hasDuplicateEdges(level.edges)) issues.push('duplicate edge')
  if (!graphIsConnected(level.nodes, level.edges)) issues.push('graph is not connected')
  if (level.nodes.length !== config.nodeCount) issues.push('unexpected node count')
  if (level.edges.length !== config.edgeCount) issues.push('unexpected edge count')

  for (const node of level.nodes) {
    if (!positionIsInside(level.solutionPositions[node.id])) issues.push(`solution out of bounds: ${node.id}`)
    if (!positionIsInside(level.initialPositions[node.id])) issues.push(`initial out of bounds: ${node.id}`)
  }

  const solutionCrossings = analyzeCrossings(level.edges, level.solutionPositions).count
  const initialCrossings = analyzeCrossings(level.edges, level.initialPositions).count
  if (solutionCrossings !== 0) issues.push('solution has crossings')
  if (initialCrossings < config.minCrossings) issues.push('initial crossing count below difficulty minimum')
  if (initialCrossings > config.maxCrossings) issues.push('initial crossing count above difficulty maximum')

  return { valid: issues.length === 0, issues, solutionCrossings, initialCrossings }
}

export function assertValidLevel(level: Level): void {
  const result = validateLevel(level)
  if (!result.valid) {
    throw new Error(`Invalid ${level.difficulty} level: ${result.issues.join('; ')}`)
  }
}
