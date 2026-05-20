import { useEffect, useMemo, useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import BottomNav from '@/components/BottomNav'
import PageHeader from '@/components/PageHeader'
import {
  AppState,
  Topic,
  formatTime,
  getFavoriteVersions,
  getTopicVersions,
  loadState,
  modeLabel,
  topicIcon
} from '@/utils/store'
import './index.css'

type HistoryTab = 'all' | 'favorites'

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

  const allTopics = useMemo(() => {
    return state.topics
      .filter((topic) => topic.input.includes(query.trim()))
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [state.topics, query])

  const favorites = useMemo(() => {
    return getFavoriteVersions(state).filter((version) => {
      const topic = state.topics.find((item) => item.id === version.topicId)
      return topic?.input.includes(query.trim())
    })
  }, [state, query])

  const renderTopic = (topic: Topic) => {
    const versions = getTopicVersions(state, topic.id)
    const latest = versions[versions.length - 1]

    return (
      <View
        className='history-item'
        key={topic.id}
        onClick={() => Taro.navigateTo({ url: `/pages/detail/index?topicId=${topic.id}` })}
      >
        <View className='history-icon'>{topicIcon(topic.input)}</View>
        <View className='history-main'>
          <Text className='history-title'>{topic.input}</Text>
          <Text className='history-meta'>{modeLabel(topic.mode)} · {versions.length}个版本</Text>
        </View>
        <View className='history-side'>
          <Text className='history-time'>{latest ? formatTime(latest.createdAt) : formatTime(topic.createdAt)}</Text>
          {versions.some((item) => item.isFavorite) && <Text className='history-heart'>♥</Text>}
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
        <Text className='search-icon'>⌕</Text>
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
          allTopics.map((topic) => renderTopic(topic))}
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
                <View className='history-icon'>{topicIcon(topic.input)}</View>
                <View className='history-main'>
                  <Text className='history-title'>{topic.input}</Text>
                  <Text className='history-meta'>{version.content.split('\n')[0]}</Text>
                </View>
                <View className='history-side'>
                  <Text className='history-time'>{formatTime(version.createdAt)}</Text>
                  <Text className='history-heart'>♥</Text>
                </View>
              </View>
            )
          })}
        {((tab === 'all' && allTopics.length === 0) || (tab === 'favorites' && favorites.length === 0)) && (
          <View className='empty-history'>还没有内容，去首页生成一句吧～</View>
        )}
      </View>

      <BottomNav active='history' />
    </View>
  )
}
