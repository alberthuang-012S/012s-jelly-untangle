export type Difficulty = 'basic' | 'normal' | 'challenge'

export type GameStatus = 'playing' | 'won'

export type Position = {
  x: number
  y: number
}

export type PositionMap = Record<string, Position>

export type JellyNode = {
  id: string
  label: string
  asset: string
}

export type Edge = {
  from: string
  to: string
}

export type EdgeId = string

export type Move = {
  nodeId: string
  from: Position
  to: Position
}

export type Level = {
  difficulty: Difficulty
  nodes: JellyNode[]
  edges: Edge[]
  initialPositions: PositionMap
  solutionPositions: PositionMap
  initialHint?: HintState
  initialCrossings: number
  generationAttempts: number
}

export type HintState = {
  nodeId: string
  position: Position
}

export type GameState = {
  difficulty: Difficulty
  nodes: JellyNode[]
  edges: Edge[]
  initialPositions: PositionMap
  solutionPositions: PositionMap
  positions: PositionMap
  crossingCount: number
  crossingEdges: Set<EdgeId>
  moveHistory: Move[]
  status: GameStatus
  hint: HintState | null
}

export type DifficultyConfig = {
  label: string
  shortLabel: string
  nodeCount: number
  edgeCount: number
  minCrossings: number
  maxCrossings: number
  estimatedTime: string
  description: string
}

export type PlayableBounds = {
  minX: number
  maxX: number
  minY: number
  maxY: number
}
