import { useEffect, useMemo, useState } from 'react'
import { Image, View, Text, Input } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import BottomNav from '@/components/BottomNav'
import QuotaModal from '@/components/QuotaModal'
import { getTopicAssetByInput, imageAssets } from '@/utils/assets'
import {
  AppState,
  GenerateMode,
  LineCount,
  LINE_COUNT_OPTIONS,
  createTopicWithVersion,
  getFavoriteVersions,
  getTopicByVersion,
  loadState,
  modeLabel
} from '@/utils/store'
import './index.css'

export default function IndexPage() {
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState<GenerateMode>('rhyme')
  const [lineCount, setLineCount] = useState<LineCount>(2)
  const [state, setState] = useState<AppState>(() => loadState())
  const [showQuota, setShowQuota] = useState(false)

  useEffect(() => {
    setState(loadState())
  }, [])

  useDidShow(() => {
    setState(loadState())
  })

  const favorites = useMemo(() => getFavoriteVersions(state).slice(0, 3), [state])

  const handleGenerate = () => {
    const input = keyword.trim()
    if (!input) {
      Taro.showToast({ title: '先输入一个东西吧', icon: 'none' })
      return
    }

    const latestState = loadState()
    const result = createTopicWithVersion(latestState, input, mode, lineCount)
    if (!result.ok) {
      setState(latestState)
      setShowQuota(true)
      return
    }

    setState(result.state)
    Taro.navigateTo({
      url: `/pages/result/index?topicId=${result.topicId}&versionId=${result.versionId}`
    })
  }

  return (
    <View className='page-shell home-page'>
      <View className='safe-top' />
      <View className='hero-card card'>
        <View className='hero-copy'>
          <View className='brand-row'>
            <Text className='brand-title'>宝宝念念</Text>
          </View>
          <Text className='brand-subtitle'>把生活变成宝宝爱听的顺口溜和儿歌</Text>
        </View>
        <Image className='home-hero-image' src={imageAssets.homeHero} mode='aspectFit' />
      </View>

      <View className='input-card card'>
        <Input
          value={keyword}
          maxlength={20}
          placeholder='输入任何东西，比如：小猫、月亮、胡萝卜…'
          placeholderClass='input-placeholder'
          className='keyword-input'
          onInput={(event) => setKeyword(String(event.detail.value))}
        />
        <Text className='input-count'>{keyword.length}/20</Text>
      </View>

      <View className='mode-switch card'>
        <View
          className={`mode-option ${mode === 'rhyme' ? 'is-active' : ''}`}
          onClick={() => {
            setMode('rhyme')
            setLineCount(2)
          }}
        >
          <Text className='mode-title'>顺口溜</Text>
          <Text className='mode-desc'>{mode === 'rhyme' ? `${lineCount}句` : '默认2句'}</Text>
        </View>
        <View
          className={`mode-option ${mode === 'song' ? 'is-active' : ''}`}
          onClick={() => {
            setMode('song')
            setLineCount(2)
          }}
        >
          <Text className='mode-title'>儿歌模式</Text>
          <Text className='mode-desc'>{mode === 'song' ? `${lineCount}句` : '默认2句'}</Text>
        </View>
      </View>

      <View className='line-count-switch card'>
        <Text className='line-count-label'>生成句数</Text>
        <View className='line-count-options'>
          {LINE_COUNT_OPTIONS.map((count) => (
            <View
              key={count}
              className={`line-count-option ${lineCount === count ? 'is-active' : ''}`}
              onClick={() => setLineCount(count)}
            >
              {count}句
            </View>
          ))}
        </View>
      </View>

      <View className='primary-btn generate-btn' onClick={handleGenerate}>生成</View>

      <View className='section-title'>
        <Text>最近满意作品</Text>
        <View className='section-more' onClick={() => Taro.navigateTo({ url: '/pages/history/index?tab=favorites' })}>
          更多 ›
        </View>
      </View>

      <View className='favorite-grid'>
        {favorites.map((version) => {
          const topic = getTopicByVersion(state, version)
          if (!topic) return null

          return (
            <View
              className='favorite-card card'
              key={version.id}
              onClick={() =>
                Taro.navigateTo({ url: `/pages/result/index?topicId=${topic.id}&versionId=${version.id}` })
              }
            >
              <Image className='favorite-icon' src={getTopicAssetByInput(topic.input)} mode='aspectFit' />
              <Text className='favorite-title'>{topic.input}</Text>
              <Text className='favorite-meta'>{modeLabel(topic.mode)} · {version.content.split('\n').length}句</Text>
            </View>
          )
        })}
      </View>

      <BottomNav active='home' />
      {showQuota && <QuotaModal variant='daily' onClose={() => setShowQuota(false)} />}
    </View>
  )
}
