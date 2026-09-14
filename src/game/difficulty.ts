import type { Difficulty, DifficultyConfig } from '../types/game'

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  basic: {
    label: '基礎',
    shortLabel: 'BASIC',
    nodeCount: 6,
    edgeCount: 6,
    minCrossings: 2,
    maxCrossings: 4,
    estimatedTime: '30 秒 – 2 分鐘',
    description: '先熟悉拖動節奏與交叉線索。',
  },
  normal: {
    label: '普通',
    shortLabel: 'NORMAL',
    nodeCount: 8,
    edgeCount: 10,
    minCrossings: 5,
    maxCrossings: 8,
    estimatedTime: '2 – 4 分鐘',
    description: '更多水母與連線，需要觀察整體路徑。',
  },
  challenge: {
    label: '挑戰',
    shortLabel: 'CHALLENGE',
    nodeCount: 10,
    edgeCount: 14,
    minCrossings: 9,
    maxCrossings: 15,
    estimatedTime: '4 – 8 分鐘',
    description: '高密度圖形，留意節點位置與交叉連鎖。',
  },
}

export const DIFFICULTIES: Difficulty[] = ['basic', 'normal', 'challenge']
