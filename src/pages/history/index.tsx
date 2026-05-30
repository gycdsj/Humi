import { useEffect, useMemo, useState } from 'react'
import { Image, View, Text, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import BottomNav from '@/components/BottomNav'
import PageHeader from '@/components/PageHeader'
import { getTopicAssetByInput, imageAssets } from '@/utils/assets'
import {
  AppState,
  formatTime,
  getFavoriteVersions,
  getSongsByTopicIds,
  getTopicVersions,
  loadState,
  modeLabel
} from '@/utils/store'
import './index.css'

type HistoryTab = 'all' | 'favorites'

interface HistoryGroup {
  input: string
  topics: AppState['topics']
  versionCount: number
  latestAt: string
  hasFavorite: boolean
  hasSong: boolean
  modeText: string
}

export default function HistoryPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<HistoryTab>('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    setState(loadState())
    if (router.params.tab === 'favorites') {
      setTab('favorites')
    }
  }, [router.params.tab])

  const historyGroups = useMemo(() => {
    const queryText = query.trim()
    const groupMap = new Map<string, AppState['topics']>()

    state.topics.forEach((topic) => {
      if (queryText && !topic.input.includes(queryText)) return
      const topics = groupMap.get(topic.input) || []
      topics.push(topic)
      groupMap.set(topic.input, topics)
    })

    return Array.from(groupMap.entries())
      .map(([input, topics]): HistoryGroup => {
        const topicIds = topics.map((topic) => topic.id)
        const versions = topicIds.flatMap((topicId) => getTopicVersions(state, topicId))
        const latestVersion = versions.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))[0]
        const modes = Array.from(new Set(topics.map((topic) => modeLabel(topic.mode))))

        return {
          input,
          topics,
          versionCount: versions.length,
          latestAt: latestVersion?.createdAt || topics[0].createdAt,
          hasFavorite: versions.some((item) => item.isFavorite),
          hasSong: getSongsByTopicIds(state, topicIds).length > 0,
          modeText: modes.join(' / ')
        }
      })
      .sort((a, b) => +new Date(b.latestAt) - +new Date(a.latestAt))
  }, [state, query])

  const favorites = useMemo(() => {
    return getFavoriteVersions(state).filter((version) => {
      const topic = state.topics.find((item) => item.id === version.topicId)
      return topic?.input.includes(query.trim())
    })
  }, [state, query])

  const renderGroup = (group: HistoryGroup) => {
    return (
      <View
        className='history-item'
        key={group.input}
        onClick={() => Taro.navigateTo({ url: `/pages/detail/index?input=${encodeURIComponent(group.input)}` })}
      >
        <Image className='history-icon' src={getTopicAssetByInput(group.input)} mode='aspectFit' />
        <View className='history-main'>
          <Text className='history-title'>{group.input}</Text>
          <Text className='history-meta'>
            {group.modeText} · {group.versionCount}个版本{group.hasSong ? ' · 含儿歌' : ''}
          </Text>
        </View>
        <View className='history-side'>
          <Text className='history-time'>{formatTime(group.latestAt)}</Text>
          {group.hasFavorite && (
            <Image className='history-heart' src={imageAssets.iconFavoriteActive} mode='aspectFit' />
          )}
        </View>
      </View>
    )
  }

  return (
    <View className='page-shell history-page'>
      <View className='safe-top' />
      <PageHeader title='历史记录' showBack={false} />

      <View className='history-tabs'>
        <View className={`history-tab ${tab === 'all' ? 'is-active' : ''}`} onClick={() => setTab('all')}>
          全部历史
        </View>
        <View
          className={`history-tab ${tab === 'favorites' ? 'is-active' : ''}`}
          onClick={() => setTab('favorites')}
        >
          满意作品
        </View>
      </View>

      <View className='search-card'>
        <Image className='search-icon' src={imageAssets.iconSearch} mode='aspectFit' />
        <Input
          value={query}
          placeholder='搜索内容'
          placeholderClass='search-placeholder'
          className='search-input'
          onInput={(event) => setQuery(String(event.detail.value))}
        />
      </View>

      <View className='history-list card'>
        {tab === 'all' &&
          historyGroups.map((group) => renderGroup(group))}
        {tab === 'favorites' &&
          favorites.map((version) => {
            const topic = state.topics.find((item) => item.id === version.topicId)
            if (!topic) return null

            return (
              <View
                className='history-item'
                key={version.id}
                onClick={() => Taro.navigateTo({ url: `/pages/result/index?topicId=${topic.id}&versionId=${version.id}` })}
              >
                <Image className='history-icon' src={getTopicAssetByInput(topic.input)} mode='aspectFit' />
                <View className='history-main'>
                  <Text className='history-title'>{topic.input}</Text>
                  <Text className='history-meta'>{version.content.split('\n')[0]}</Text>
                </View>
                <View className='history-side'>
                  <Text className='history-time'>{formatTime(version.createdAt)}</Text>
                  <Image className='history-heart' src={imageAssets.iconFavoriteActive} mode='aspectFit' />
                </View>
              </View>
            )
          })}
        {((tab === 'all' && historyGroups.length === 0) || (tab === 'favorites' && favorites.length === 0)) && (
          <View className='empty-history'>还没有内容，去首页生成一句吧～</View>
        )}
      </View>

      <BottomNav active='history' />
    </View>
  )
}
