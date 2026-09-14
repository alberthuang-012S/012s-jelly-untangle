import type { Edge, EdgeId, JellyNode } from '../types/game'

export function edgeId(edge: Edge): EdgeId {
  return [edge.from, edge.to].sort().join('::')
}

export function hasDuplicateEdges(edges: Edge[]): boolean {
  const ids = new Set<string>()
  for (const edge of edges) {
    const id = edgeId(edge)
    if (ids.has(id)) return true
    ids.add(id)
  }
  return false
}

export function graphIsConnected(nodes: JellyNode[], edges: Edge[]): boolean {
  if (nodes.length === 0) return true
  const adjacency = new Map<string, string[]>()
  for (const node of nodes) adjacency.set(node.id, [])
  for (const edge of edges) {
    adjacency.get(edge.from)?.push(edge.to)
    adjacency.get(edge.to)?.push(edge.from)
  }

  const visited = new Set<string>()
  const queue = [nodes[0].id]
  while (queue.length > 0) {
    const current = queue.shift()
    if (!current || visited.has(current)) continue
    visited.add(current)
    for (const neighbor of adjacency.get(current) ?? []) {
      if (!visited.has(neighbor)) queue.push(neighbor)
    }
  }
  return visited.size === nodes.length
}

export function degreeMap(nodes: JellyNode[], edges: Edge[]): Record<string, number> {
  const degrees: Record<string, number> = {}
  for (const node of nodes) degrees[node.id] = 0
  for (const edge of edges) {
    if (edge.from in degrees) degrees[edge.from] += 1
    if (edge.to in degrees) degrees[edge.to] += 1
  }
  return degrees
}
