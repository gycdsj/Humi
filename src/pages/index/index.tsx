import { useEffect, useMemo, useState } from 'react'
import { View, Text, Input } from '@tarojs/components'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/BottomNav'
import QuotaModal from '@/components/QuotaModal'
import {
  AppState,
  GenerateMode,
  createTopicWithVersion,
  getFavoriteVersions,
  getTopicByVersion,
  loadState,
  modeLabel,
  topicIcon
} from '@/utils/store'
import './index.css'

export default function IndexPage() {
  const [keyword, setKeyword] = useState('')
  const [mode, setMode] = useState<GenerateMode>('rhyme')
  const [state, setState] = useState<AppState>(() => loadState())
  const [showQuota, setShowQuota] = useState(false)

  useEffect(() => {
    setState(loadState())
  }, [])

  const favorites = useMemo(() => getFavoriteVersions(state).slice(0, 3), [state])

  const handleGenerate = () => {
    const input = keyword.trim()
    if (!input) {
      Taro.showToast({ title: '先输入一个东西吧', icon: 'none' })
      return
    }

    const result = createTopicWithVersion(state, input, mode)
    if (!result.ok) {
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
            <Text className='brand-spark'>✤</Text>
          </View>
          <Text className='brand-subtitle'>把生活变成宝宝爱听的顺口溜和儿歌</Text>
          <View className='music-notes'>♪ ♫ ✨ ♬</View>
        </View>
        <View className='baby-illust'>
          <Text className='baby-face'>👶</Text>
          <Text className='baby-mic'>🎤</Text>
          <Text className='baby-bunny'>🐰</Text>
        </View>
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
          onClick={() => setMode('rhyme')}
        >
          <Text className='mode-title'>顺口溜</Text>
          <Text className='mode-desc'>2-4句</Text>
        </View>
        <View
          className={`mode-option ${mode === 'song' ? 'is-active' : ''}`}
          onClick={() => setMode('song')}
        >
          <Text className='mode-title'>儿歌模式</Text>
          <Text className='mode-desc'>4句以上</Text>
        </View>
      </View>

      <View className='primary-btn generate-btn' onClick={handleGenerate}>
        生成 ✨
      </View>

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
              <View className='favorite-icon'>{topicIcon(topic.input)}</View>
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
