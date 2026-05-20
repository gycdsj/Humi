import { useEffect, useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import PageHeader from '@/components/PageHeader'
import {
  AppState,
  deleteVersion,
  formatTime,
  getTopicVersions,
  loadState,
  modeLabel,
  setFavoriteVersion,
  topicIcon
} from '@/utils/store'
import './index.css'

export default function DetailPage() {
  const router = useRouter()
  const topicId = String(router.params.topicId || '')
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    setState(loadState())
  }, [])

  const topic = state.topics.find((item) => item.id === topicId)
  const versions = useMemo(() => getTopicVersions(state, topicId).reverse(), [state, topicId])

  const markFavorite = (versionId: string) => {
    setState(setFavoriteVersion(state, versionId))
  }

  const removeVersion = (versionId: string) => {
    Taro.showModal({
      title: '删除版本',
      content: '确定删除这个版本吗？',
      confirmColor: '#ff477f',
      success: (res) => {
        if (res.confirm) {
          const next = deleteVersion(state, versionId)
          setState(next)
          if (!next.topics.some((item) => item.id === topicId)) {
            Taro.navigateBack()
          }
        }
      }
    })
  }

  return (
    <View className='page-shell detail-page'>
      <View className='safe-top' />
      <PageHeader title='历史详情' />

      {topic ? (
        <>
          <View className='detail-topic card'>
            <View className='detail-topic__icon'>{topicIcon(topic.input)}</View>
            <View>
              <Text className='detail-topic__title'>{topic.input}</Text>
              <Text className='detail-topic__meta'>{modeLabel(topic.mode)} · {versions.length}个版本</Text>
            </View>
          </View>

          <View className='version-list'>
            {versions.map((version, index) => (
              <View className={`version-card card ${version.isFavorite ? 'is-favorite' : ''}`} key={version.id}>
                <View className='version-head'>
                  <Text className='version-title'>版本 {versions.length - index}</Text>
                  <Text className='version-time'>{formatTime(version.createdAt)}</Text>
                </View>
                <View className='version-content'>
                  {version.content.split('\n').map((line) => (
                    <Text className='version-line' key={line}>
                      {line}
                    </Text>
                  ))}
                </View>
                <View className='version-actions'>
                  <View className='version-action' onClick={() => markFavorite(version.id)}>
                    {version.isFavorite ? '当前满意' : '设为满意'}
                  </View>
                  <View
                    className='version-action'
                    onClick={() => Taro.navigateTo({ url: `/pages/result/index?topicId=${topic.id}&versionId=${version.id}` })}
                  >
                    查看
                  </View>
                  <View className='version-action version-action--danger' onClick={() => removeVersion(version.id)}>
                    删除
                  </View>
                </View>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View className='empty-detail card'>没有找到这个主题</View>
      )}
    </View>
  )
}
