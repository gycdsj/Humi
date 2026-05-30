import { useEffect, useMemo, useState } from 'react'
import { Image, View, Text } from '@tarojs/components'
import Taro, { useDidShow, useRouter } from '@tarojs/taro'
import PageHeader from '@/components/PageHeader'
import QuotaModal from '@/components/QuotaModal'
import { getTopicAssetByInput, imageAssets } from '@/utils/assets'
import {
  AppState,
  LINE_COUNT_OPTIONS,
  LineCount,
  Version,
  getTopicVersions,
  loadState,
  modeLabel,
  regenerateVersion,
  setFavoriteVersion
} from '@/utils/store'
import './index.css'

export default function ResultPage() {
  const router = useRouter()
  const [state, setState] = useState<AppState>(() => loadState())
  const [versionId, setVersionId] = useState('')
  const [showQuota, setShowQuota] = useState(false)
  const [playing, setPlaying] = useState(false)

  const topicId = String(router.params.topicId || '')

  useEffect(() => {
    setState(loadState())
    setVersionId(String(router.params.versionId || ''))
  }, [router.params.versionId])

  useDidShow(() => {
    setState(loadState())
  })

  const topic = state.topics.find((item) => item.id === topicId)
  const versions = useMemo(() => getTopicVersions(state, topicId), [state, topicId])
  const current: Version | undefined = versions.find((item) => item.id === versionId) || versions[versions.length - 1]
  const currentIndex = current ? versions.findIndex((item) => item.id === current.id) + 1 : 0
  const latestSong = topic ? state.songs.find((item) => item.topicId === topic.id) : undefined

  const regenerate = () => {
    const latestState = loadState()
    const latestTopic = latestState.topics.find((item) => item.id === topicId)
    if (!latestTopic) return

    const result = regenerateVersion(latestState, latestTopic.id)
    if (!result.ok) {
      setState(latestState)
      setShowQuota(true)
      return
    }

    setState(result.state)
    setVersionId(result.versionId)
  }

  const selectLineCount = () => {
    if (!topicId) return

    Taro.showActionSheet({
      itemList: LINE_COUNT_OPTIONS.map((count) => `${count}句`),
      success: (res) => {
        const count = LINE_COUNT_OPTIONS[res.tapIndex] as LineCount | undefined
        if (!count) return

        const latestState = loadState()
        const latestTopic = latestState.topics.find((item) => item.id === topicId)
        if (!latestTopic) return

        const result = regenerateVersion(latestState, latestTopic.id, count)
        if (!result.ok) {
          setState(latestState)
          setShowQuota(true)
          return
        }

        setState(result.state)
        setVersionId(result.versionId)
      }
    })
  }

  const showVersion = (direction: 'prev' | 'next') => {
    if (!current) return
    const index = versions.findIndex((item) => item.id === current.id)
    const next = direction === 'prev' ? versions[index - 1] : versions[index + 1]
    if (next) {
      setVersionId(next.id)
    }
  }

  const toggleFavorite = () => {
    if (!current) return
    const next = setFavoriteVersion(state, current.id)
    setState(next)
  }

  if (!topic || !current) {
    return (
      <View className='page-shell result-page'>
        <View className='safe-top' />
        <PageHeader title='生成结果' />
        <View className='empty-card card'>没有找到这条内容</View>
      </View>
    )
  }

  const lines = current.content.split('\n')

  return (
    <View className='page-shell result-page'>
      <View className='safe-top' />
      <PageHeader />

      <View className='topic-head'>
        <Image className='topic-avatar' src={getTopicAssetByInput(topic.input)} mode='aspectFit' />
        <View className='topic-main'>
          <View className='topic-title-row'>
            <Text className='topic-title'>{topic.input}</Text>
            <Text className='edit-chip'>编辑</Text>
          </View>
          <View className='topic-tags'>
            <Text className='topic-tag topic-tag--active'>{modeLabel(topic.mode)}</Text>
            <Text className='topic-tag topic-tag--selectable' onClick={selectLineCount}>
              {lines.length}句⌄
            </Text>
          </View>
        </View>
      </View>

      <View className='result-card card'>
        <Text className='version-badge'>版本 {currentIndex}/{versions.length}</Text>
        <View className='rhyme-content'>
          {lines.map((line) => (
            <Text key={line} className='rhyme-line'>
              {line}
            </Text>
          ))}
        </View>
        <Image className='card-deco' src={getTopicAssetByInput(topic.input)} mode='aspectFit' />
        {versions.length > 1 && (
          <>
            <View className={`version-arrow version-arrow--left ${currentIndex <= 1 ? 'is-disabled' : ''}`} onClick={() => showVersion('prev')}>
              <Image className='version-arrow__icon' src={imageAssets.iconBack} mode='aspectFit' />
            </View>
            <View
              className={`version-arrow version-arrow--right ${currentIndex >= versions.length ? 'is-disabled' : ''}`}
              onClick={() => showVersion('next')}
            >
              <Image className='version-arrow__icon' src={imageAssets.iconBack} mode='aspectFit' />
            </View>
          </>
        )}
      </View>

      {topic.mode === 'song' && (
        <View className='song-card card'>
          <View className='song-player'>
            <View className='song-play' onClick={() => setPlaying(!playing)}>
              <View className={`song-play-mark ${playing ? 'is-pause' : 'is-play'}`} />
            </View>
            <View className='song-info'>
              <Text className='song-title'>宝宝小儿歌</Text>
              <Text className='song-desc'>{playing ? '正在播放模拟音频' : '点击播放宝宝旋律'}</Text>
            </View>
          </View>
          <View className='lyrics-box'>
            {(latestSong?.lyrics || current.content).split('\n').map((line) => (
              <Text className='lyrics-line' key={line}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      )}

      <View className='action-row'>
        <View className='action-item' onClick={regenerate}>
          <Image className='action-icon' src={imageAssets.iconRegenerate} mode='aspectFit' />
          <Text>重新生成</Text>
        </View>
        <View className={`action-item ${current.isFavorite ? 'is-favorite' : ''}`} onClick={toggleFavorite}>
          <Image
            className='action-icon'
            src={current.isFavorite ? imageAssets.iconFavoriteActive : imageAssets.iconFavorite}
            mode='aspectFit'
          />
          <Text>{current.isFavorite ? '已满意' : '标记满意'}</Text>
        </View>
        <View className='action-item' onClick={() => Taro.navigateTo({ url: `/pages/detail/index?topicId=${topic.id}` })}>
          <Image className='action-icon' src={imageAssets.iconHistory} mode='aspectFit' />
          <Text>查看历史</Text>
        </View>
      </View>

      {topic.mode === 'rhyme' && (
        <View className='tip-card'>
          <Image className='tip-star' src={imageAssets.quotaPackageHero} mode='aspectFit' />
          <View>
            <Text className='tip-title'>小贴士：</Text>
            <Text className='tip-text'>点击“重新生成”会为你换一版新的句子～</Text>
          </View>
        </View>
      )}

      {showQuota && <QuotaModal variant='package' onClose={() => setShowQuota(false)} />}
    </View>
  )
}
