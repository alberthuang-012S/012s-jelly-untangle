import { useCallback, useEffect, useRef, useState } from 'react'
import { clampPosition } from '../utils/position'
import type { Position, PositionMap } from '../types/game'

type DragSession = {
  nodeId: string
  pointerId: number
  start: Position
  offset: Position
  latest: Position
}

type UseDragJellyOptions = {
  boardRef: React.RefObject<HTMLDivElement | null>
  positions: PositionMap
  disabled?: boolean
  onStart: (nodeId: string) => void
  onMove: (nodeId: string, position: Position) => void
  onFinish: (nodeId: string, from: Position, to: Position) => void
  onCancel?: () => void
}

function pointerToBoardPosition(
  board: HTMLDivElement,
  clientX: number,
  clientY: number,
  offset: Position,
): Position {
  const rect = board.getBoundingClientRect()
  return clampPosition({
    x: ((clientX - rect.left) / rect.width) * 100 - offset.x,
    y: ((clientY - rect.top) / rect.height) * 100 - offset.y,
  })
}

export function useDragJelly({
  boardRef,
  positions,
  disabled = false,
  onStart,
  onMove,
  onFinish,
  onCancel,
}: UseDragJellyOptions) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const sessionRef = useRef<DragSession | null>(null)

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>, nodeId: string) => {
      if (disabled || event.button !== 0 || !boardRef.current) return
      const currentPosition = positions[nodeId]
      if (!currentPosition) return
      event.preventDefault()
      const rect = boardRef.current.getBoundingClientRect()
      const pointerPosition = {
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100,
      }
      const offset = {
        x: pointerPosition.x - currentPosition.x,
        y: pointerPosition.y - currentPosition.y,
      }
      sessionRef.current = {
        nodeId,
        pointerId: event.pointerId,
        start: { ...currentPosition },
        offset,
        latest: { ...currentPosition },
      }
      setDraggingId(nodeId)
      onStart(nodeId)
    },
    [boardRef, disabled, onStart, positions],
  )

  useEffect(() => {
    if (!draggingId) return undefined

    const handlePointerMove = (event: PointerEvent) => {
      const session = sessionRef.current
      const board = boardRef.current
      if (!session || !board || event.pointerId !== session.pointerId) return
      event.preventDefault()
      const position = pointerToBoardPosition(board, event.clientX, event.clientY, session.offset)
      session.latest = position
      onMove(session.nodeId, position)
    }

    const handlePointerUp = (event: PointerEvent) => {
      const session = sessionRef.current
      if (!session || event.pointerId !== session.pointerId) return
      event.preventDefault()
      onFinish(session.nodeId, session.start, session.latest)
      sessionRef.current = null
      setDraggingId(null)
    }

    const handlePointerCancel = (event: PointerEvent) => {
      const session = sessionRef.current
      if (!session || event.pointerId !== session.pointerId) return
      onCancel?.()
      sessionRef.current = null
      setDraggingId(null)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: false })
    window.addEventListener('pointerup', handlePointerUp, { passive: false })
    window.addEventListener('pointercancel', handlePointerCancel)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      window.removeEventListener('pointercancel', handlePointerCancel)
    }
  }, [boardRef, draggingId, onCancel, onFinish, onMove])

  return { draggingId, handlePointerDown }
}
