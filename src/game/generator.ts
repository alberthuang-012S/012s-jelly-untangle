import { DIFFICULTY_CONFIG, LEVELS_PER_DIFFICULTY } from './difficulty'
import { analyzeCrossings } from './intersections'
import { assertValidLevel } from './validation'
import type { Difficulty, Edge, JellyNode, Level, PositionMap } from '../types/game'

type Template = {
  nodes: JellyNode[]
  edges: Edge[]
  solutionPositions: PositionMap
}

export const assetNames = [
  'jelly-normal-cyan.webp',
  'jelly-normal-pink.webp',
  'jelly-normal-purple.webp',
  'jelly-normal-green.webp',
  'jelly-normal-yellow.webp',
  'jelly-normal-blue.webp',
  'jelly-normal-red.webp',
  'jelly-normal-aqua.webp',
  'jelly-cute.webp',
  'jelly-playful.webp',
]

const difficultySeeds: Record<Difficulty, number> = {
  basic: 0x13579bdf,
  normal: 0x2468ace0,
  challenge: 0x9e3779b9,
}

function seededRandom(seed: number): () => number {
  let value = seed >>> 0
  return () => {
    value = (Math.imul(value, 1664525) + 1013904223) >>> 0
    return value / 0x100000000
  }
}

function createNodes(count: number): JellyNode[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `jelly-${index}`,
    label: `Jelly ${index + 1}`,
    asset: assetNames[index % assetNames.length],
  }))
}

function makeTemplate(difficulty: Difficulty): Template {
  if (difficulty === 'basic') {
    const nodes = createNodes(6)
    return {
      nodes,
      edges: [
        { from: 'jelly-0', to: 'jelly-1' },
        { from: 'jelly-1', to: 'jelly-2' },
        { from: 'jelly-0', to: 'jelly-3' },
        { from: 'jelly-1', to: 'jelly-4' },
        { from: 'jelly-2', to: 'jelly-5' },
        { from: 'jelly-3', to: 'jelly-4' },
      ],
      solutionPositions: {
        'jelly-0': { x: 22, y: 24 },
        'jelly-1': { x: 50, y: 24 },
        'jelly-2': { x: 78, y: 24 },
        'jelly-3': { x: 22, y: 72 },
        'jelly-4': { x: 50, y: 72 },
        'jelly-5': { x: 78, y: 72 },
      },
    }
  }

  if (difficulty === 'normal') {
    const nodes = createNodes(8)
    return {
      nodes,
      edges: [
        { from: 'jelly-0', to: 'jelly-1' },
        { from: 'jelly-1', to: 'jelly-2' },
        { from: 'jelly-2', to: 'jelly-3' },
        { from: 'jelly-4', to: 'jelly-5' },
        { from: 'jelly-5', to: 'jelly-6' },
        { from: 'jelly-6', to: 'jelly-7' },
        { from: 'jelly-0', to: 'jelly-4' },
        { from: 'jelly-1', to: 'jelly-5' },
        { from: 'jelly-2', to: 'jelly-6' },
        { from: 'jelly-3', to: 'jelly-7' },
      ],
      solutionPositions: {
        'jelly-0': { x: 16, y: 22 },
        'jelly-1': { x: 39, y: 22 },
        'jelly-2': { x: 61, y: 22 },
        'jelly-3': { x: 84, y: 22 },
        'jelly-4': { x: 16, y: 76 },
        'jelly-5': { x: 39, y: 76 },
        'jelly-6': { x: 61, y: 76 },
        'jelly-7': { x: 84, y: 76 },
      },
    }
  }

  const nodes = createNodes(10)
  return {
    nodes,
    edges: [
      { from: 'jelly-0', to: 'jelly-1' },
      { from: 'jelly-1', to: 'jelly-2' },
      { from: 'jelly-2', to: 'jelly-3' },
      { from: 'jelly-3', to: 'jelly-4' },
      { from: 'jelly-5', to: 'jelly-6' },
      { from: 'jelly-6', to: 'jelly-7' },
      { from: 'jelly-7', to: 'jelly-8' },
      { from: 'jelly-8', to: 'jelly-9' },
      { from: 'jelly-0', to: 'jelly-5' },
      { from: 'jelly-1', to: 'jelly-6' },
      { from: 'jelly-2', to: 'jelly-7' },
      { from: 'jelly-3', to: 'jelly-8' },
      { from: 'jelly-4', to: 'jelly-9' },
      { from: 'jelly-0', to: 'jelly-6' },
    ],
    solutionPositions: {
      'jelly-0': { x: 13, y: 22 },
      'jelly-1': { x: 31, y: 22 },
      'jelly-2': { x: 50, y: 22 },
      'jelly-3': { x: 69, y: 22 },
      'jelly-4': { x: 87, y: 22 },
      'jelly-5': { x: 13, y: 76 },
      'jelly-6': { x: 31, y: 76 },
      'jelly-7': { x: 50, y: 76 },
      'jelly-8': { x: 69, y: 76 },
      'jelly-9': { x: 87, y: 76 },
    },
  }
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const output = [...items]
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[output[index], output[swapIndex]] = [output[swapIndex], output[index]]
  }
  return output
}

function makeInitialPositions(template: Template, random: () => number): PositionMap {
  const slots = shuffle(
    template.nodes.map((node) => template.solutionPositions[node.id]),
    random,
  )
  return Object.fromEntries(template.nodes.map((node, index) => [node.id, slots[index]]))
}

export function createTutorialLevel(): Level {
  const nodes: JellyNode[] = [
    { id: 'demo-0', label: '示範 Jelly 1', asset: 'jelly-playful.webp' },
    { id: 'demo-1', label: '示範 Jelly 2', asset: 'jelly-cute.webp' },
    { id: 'demo-2', label: '示範 Jelly 3', asset: 'jelly-normal-cyan.webp' },
    { id: 'demo-3', label: '示範 Jelly 4', asset: 'jelly-normal-purple.webp' },
  ]
  const edges: Edge[] = [
    { from: 'demo-0', to: 'demo-1' },
    { from: 'demo-2', to: 'demo-3' },
  ]
  const solutionPositions = {
    'demo-0': { x: 15, y: 20 },
    'demo-1': { x: 85, y: 20 },
    'demo-2': { x: 15, y: 80 },
    'demo-3': { x: 85, y: 80 },
  }
  const initialPositions = {
    'demo-0': { x: 15, y: 20 },
    'demo-1': { x: 85, y: 75 },
    'demo-2': { x: 15, y: 80 },
    'demo-3': { x: 70, y: 25 },
  }
  return {
    difficulty: 'basic',
    levelNumber: 0,
    nodes,
    edges,
    initialPositions,
    solutionPositions,
    tutorialHint: {
      nodeId: 'demo-1',
      position: { ...solutionPositions['demo-1'] },
    },
    initialCrossings: analyzeCrossings(edges, initialPositions).count,
    generationAttempts: 1,
  }
}

export function generateLevel(
  difficulty: Difficulty,
  random: () => number = Math.random,
  levelNumber = 1,
): Level {
  const config = DIFFICULTY_CONFIG[difficulty]
  let bestCandidate: Level | null = null
  let bestDistance = Number.POSITIVE_INFINITY

  for (let attempt = 1; attempt <= 500; attempt += 1) {
    const template = makeTemplate(difficulty)
    const initialPositions = makeInitialPositions(template, random)
    const initialCrossings = analyzeCrossings(template.edges, initialPositions).count
    const level: Level = {
      difficulty,
      levelNumber,
      nodes: template.nodes,
      edges: template.edges,
      initialPositions,
      solutionPositions: template.solutionPositions,
      initialCrossings,
      generationAttempts: attempt,
    }

    const midpoint = (config.minCrossings + config.maxCrossings) / 2
    const distance = Math.abs(initialCrossings - midpoint)
    if (distance < bestDistance) {
      bestDistance = distance
      bestCandidate = level
    }

    if (initialCrossings >= config.minCrossings && initialCrossings <= config.maxCrossings) {
      assertValidLevel(level)
      return level
    }
  }

  if (bestCandidate) {
    throw new Error(
      `Could not generate a ${difficulty} level in the requested crossing range after 500 attempts; best was ${bestCandidate.initialCrossings}.`,
    )
  }
  throw new Error(`Could not generate a ${difficulty} level.`)
}

export function generateLevelForNumber(difficulty: Difficulty, levelNumber: number): Level {
  if (!Number.isInteger(levelNumber) || levelNumber < 1 || levelNumber > LEVELS_PER_DIFFICULTY) {
    throw new RangeError(`Level number must be between 1 and ${LEVELS_PER_DIFFICULTY}, received ${levelNumber}.`)
  }

  const seed = (difficultySeeds[difficulty] + Math.imul(levelNumber, 0x45d9f3b)) >>> 0
  return generateLevel(difficulty, seededRandom(seed), levelNumber)
}
