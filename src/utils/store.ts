import Taro from '@tarojs/taro'

export type GenerateMode = 'rhyme' | 'song'
export type LineCount = 2 | 4 | 8

export interface Topic {
  id: string
  input: string
  mode: GenerateMode
  lineCount?: LineCount
  createdAt: string
}

export interface Version {
  id: string
  topicId: string
  content: string
  isFavorite: boolean
  createdAt: string
}

export interface Song {
  id: string
  topicId: string
  lyrics: string
  audioUrl: string
  createdAt: string
}

export interface User {
  id: string
  nickname: string
  avatar: string
  remainCount: number
}

export interface Order {
  id: string
  packageId: string
  price: number
  status: 'paid'
  createdAt: string
}

export interface UsageRecord {
  id: string
  mode: GenerateMode
  cost: number
  title: string
  createdAt: string
}

export interface AppState {
  user: User
  topics: Topic[]
  versions: Version[]
  songs: Song[]
  orders: Order[]
  usageRecords: UsageRecord[]
}

export interface PackagePlan {
  id: string
  name: string
  count: number
  price: number
  validity: string
  tag?: string
}

const STORAGE_KEY = 'baby_nian_nian_state_v1'

export const PACKAGE_PLANS: PackagePlan[] = [
  { id: 'pack_10', name: '10次套餐', count: 10, price: 6.9, validity: '有效期 30 天' },
  { id: 'pack_50', name: '50次套餐', count: 50, price: 19.9, validity: '有效期 90 天', tag: '更划算' }
]

export const LINE_COUNT_OPTIONS: LineCount[] = [2, 4, 8]

const RHYME_COUPLETS = [
  (word: string) => [`小${word}，轻轻摇`, '宝宝看了咯咯笑'],
  (word: string) => [`${word}${word}真可爱`, '陪着宝宝慢慢来'],
  (word: string) => [`小${word}，蹦蹦跳`, '哒哒哒哒心情好'],
  (word: string) => [`${word}来，宝宝瞧`, '拍手唱唱笑一笑'],
  (word: string) => [`摸摸${word}软又香`, '宝宝眼睛亮汪汪'],
  (word: string) => [`小${word}，转个圈`, '甜甜声音绕耳边']
]

const SONG_COUPLETS = [
  (word: string) => [`小${word}，摇呀摇`, '宝宝跟着拍拍手'],
  (word: string) => ['啦啦啦，笑弯腰', '甜甜梦里也问好'],
  (word: string) => [`${word}${word}排排坐`, '咚咚咚，唱小歌'],
  (word: string) => ['宝宝听了眨眼睛', '亲亲抱抱暖心窝'],
  (word: string) => [`小${word}，圆溜溜`, '陪着宝宝慢慢走'],
  (word: string) => ['一二一，拍拍手', '今天也是乖宝宝']
]

export function getInitialState(): AppState {
  const now = new Date().toISOString()
  const t1 = { id: 'topic_car', input: '小汽车', mode: 'rhyme' as GenerateMode, lineCount: 2 as LineCount, createdAt: now }
  const t2 = { id: 'topic_banana', input: '香蕉', mode: 'rhyme' as GenerateMode, lineCount: 2 as LineCount, createdAt: now }
  const t3 = { id: 'topic_bath', input: '洗澡', mode: 'rhyme' as GenerateMode, lineCount: 2 as LineCount, createdAt: now }

  return {
    user: {
      id: 'user_demo',
      nickname: '宝宝念念',
      avatar: 'default',
      remainCount: 12
    },
    topics: [t1, t2, t3],
    versions: [
      {
        id: 'version_car',
        topicId: t1.id,
        content: '小汽车，滴滴跑\n带着宝宝去逛逛',
        isFavorite: true,
        createdAt: now
      },
      {
        id: 'version_banana',
        topicId: t2.id,
        content: '小香蕉，弯又黄\n宝宝吃了笑脸香',
        isFavorite: true,
        createdAt: now
      },
      {
        id: 'version_bath',
        topicId: t3.id,
        content: '小水花，哗啦啦\n宝宝洗澡笑哈哈',
        isFavorite: true,
        createdAt: now
      }
    ],
    songs: [],
    orders: [],
    usageRecords: []
  }
}

export function loadState(): AppState {
  try {
    const stored = Taro.getStorageSync<AppState>(STORAGE_KEY)
    if (stored && stored.user && Array.isArray(stored.topics)) {
      return stored
    }
  } catch (error) {
    console.warn('读取本地状态失败', error)
  }

  const initial = getInitialState()
  saveState(initial)
  return initial
}

export function saveState(state: AppState) {
  Taro.setStorageSync(STORAGE_KEY, state)
}

export function createId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`
}

export function modeLabel(mode: GenerateMode) {
  return mode === 'song' ? '儿歌模式' : '顺口溜'
}

export function modeCost(mode: GenerateMode) {
  return mode === 'song' ? 2 : 1
}

export function generateContent(input: string, mode: GenerateMode, lineCount: LineCount = 2, seed = 0) {
  const cleanInput = input.trim().slice(0, 12) || '小宝贝'
  const couplets = mode === 'song' ? SONG_COUPLETS : RHYME_COUPLETS
  const start = Math.abs(hashCode(cleanInput) + seed + Date.now()) % couplets.length
  const lines: string[] = []

  while (lines.length < lineCount) {
    const template = couplets[(start + lines.length / 2) % couplets.length]
    lines.push(...template(cleanInput))
  }

  return lines.slice(0, lineCount).join('\n')
}

export function generateSongLyrics(input: string, lineCount: LineCount = 2, seed = 0) {
  return generateContent(input, 'song', lineCount, seed)
}

export function getTopicVersions(state: AppState, topicId: string) {
  return state.versions
    .filter((item) => item.topicId === topicId)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
}

export function getFavoriteVersions(state: AppState) {
  return state.versions
    .filter((item) => item.isFavorite)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function getTopicByVersion(state: AppState, version: Version) {
  return state.topics.find((topic) => topic.id === version.topicId)
}

export function getSongsByTopicIds(state: AppState, topicIds: string[]) {
  const topicIdSet = new Set(topicIds)
  return state.songs
    .filter((song) => topicIdSet.has(song.topicId))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}

export function formatTime(value: string) {
  const date = new Date(value)
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')
  const hour = `${date.getHours()}`.padStart(2, '0')
  const minute = `${date.getMinutes()}`.padStart(2, '0')
  return `${month}-${day} ${hour}:${minute}`
}

export function createTopicWithVersion(state: AppState, input: string, mode: GenerateMode, lineCount: LineCount = 2) {
  const cost = modeCost(mode)
  if (state.user.remainCount < cost) {
    return { state, topicId: '', versionId: '', ok: false }
  }

  const now = new Date().toISOString()
  const topic: Topic = {
    id: createId('topic'),
    input: input.trim(),
    mode,
    lineCount,
    createdAt: now
  }
  const version: Version = {
    id: createId('version'),
    topicId: topic.id,
    content: generateContent(input, mode, lineCount),
    isFavorite: false,
    createdAt: now
  }
  const next: AppState = {
    ...state,
    user: { ...state.user, remainCount: state.user.remainCount - cost },
    topics: [topic, ...state.topics],
    versions: [version, ...state.versions],
    songs:
      mode === 'song'
        ? [
            {
              id: createId('song'),
              topicId: topic.id,
              lyrics: generateSongLyrics(input, lineCount),
              audioUrl: '',
              createdAt: now
            },
            ...state.songs
          ]
        : state.songs,
    usageRecords: [
      {
        id: createId('usage'),
        mode,
        cost,
        title: input.trim(),
        createdAt: now
      },
      ...state.usageRecords
    ]
  }
  saveState(next)
  return { state: next, topicId: topic.id, versionId: version.id, ok: true }
}

export function regenerateVersion(state: AppState, topicId: string, nextLineCount?: LineCount) {
  const topic = state.topics.find((item) => item.id === topicId)
  if (!topic) {
    return { state, versionId: '', ok: false }
  }

  const cost = modeCost(topic.mode)
  if (state.user.remainCount < cost) {
    return { state, versionId: '', ok: false }
  }

  const now = new Date().toISOString()
  const versionCount = getTopicVersions(state, topicId).length
  const lineCount = nextLineCount || topic.lineCount || 2
  const version: Version = {
    id: createId('version'),
    topicId,
    content: generateContent(topic.input, topic.mode, lineCount, versionCount + 1),
    isFavorite: false,
    createdAt: now
  }
  const next: AppState = {
    ...state,
    user: { ...state.user, remainCount: state.user.remainCount - cost },
    topics: state.topics.map((item) => (item.id === topicId ? { ...item, lineCount } : item)),
    versions: [version, ...state.versions],
    songs:
      topic.mode === 'song'
        ? [
            {
              id: createId('song'),
              topicId,
              lyrics: generateSongLyrics(topic.input, lineCount, versionCount + 1),
              audioUrl: '',
              createdAt: now
            },
            ...state.songs
          ]
        : state.songs,
    usageRecords: [
      {
        id: createId('usage'),
        mode: topic.mode,
        cost,
        title: topic.input,
        createdAt: now
      },
      ...state.usageRecords
    ]
  }
  saveState(next)
  return { state: next, versionId: version.id, ok: true }
}

export function setFavoriteVersion(state: AppState, versionId: string) {
  const target = state.versions.find((item) => item.id === versionId)
  if (!target) return state

  const next: AppState = {
    ...state,
    versions: state.versions.map((item) =>
      item.topicId === target.topicId
        ? { ...item, isFavorite: item.id === versionId ? !item.isFavorite : false }
        : item
    )
  }
  saveState(next)
  return next
}

export function deleteVersion(state: AppState, versionId: string) {
  const target = state.versions.find((item) => item.id === versionId)
  if (!target) return state

  const versions = state.versions.filter((item) => item.id !== versionId)
  const hasTopicVersions = versions.some((item) => item.topicId === target.topicId)
  const next: AppState = {
    ...state,
    versions,
    topics: hasTopicVersions ? state.topics : state.topics.filter((item) => item.id !== target.topicId)
  }
  saveState(next)
  return next
}

export function buyPackage(state: AppState, packageId: string) {
  const plan = PACKAGE_PLANS.find((item) => item.id === packageId) || PACKAGE_PLANS[0]
  const now = new Date().toISOString()
  const next: AppState = {
    ...state,
    user: {
      ...state.user,
      remainCount: state.user.remainCount + plan.count
    },
    orders: [
      {
        id: createId('order'),
        packageId: plan.id,
        price: plan.price,
        status: 'paid',
        createdAt: now
      },
      ...state.orders
    ]
  }
  saveState(next)
  return next
}

export function updateUserNickname(state: AppState, nickname: string) {
  const next: AppState = {
    ...state,
    user: {
      ...state.user,
      nickname
    }
  }
  saveState(next)
  return next
}

function hashCode(value: string) {
  return value.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
}
