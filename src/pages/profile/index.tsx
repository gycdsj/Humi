import { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/BottomNav'
import PageHeader from '@/components/PageHeader'
import { AppState, loadState } from '@/utils/store'
import './index.css'

const MENU = [
  { icon: '🛍', title: '我的套餐', extra: '' },
  { icon: '📄', title: '使用记录', extra: '' },
  { icon: '⭐', title: '满意作品', extra: '' },
  { icon: '💬', title: '意见反馈', extra: '' },
  { icon: '🧸', title: '关于我们', extra: '' },
  { icon: '⚙', title: '设置', extra: '' }
]

export default function ProfilePage() {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    setState(loadState())
  }, [])

  const handleMenu = (title: string) => {
    if (title === '满意作品') {
      Taro.navigateTo({ url: '/pages/history/index?tab=favorites' })
      return
    }
    if (title === '使用记录') {
      Taro.showModal({
        title: '使用记录',
        content: state.usageRecords.length
          ? `最近已生成 ${state.usageRecords.length} 次内容。`
          : '还没有使用记录，快去生成一句吧～',
        showCancel: false,
        confirmColor: '#ff477f'
      })
      return
    }
    Taro.showToast({ title: 'MVP版本即将开放', icon: 'none' })
  }

  return (
    <View className='page-shell cool profile-page'>
      <View className='safe-top' />
      <PageHeader showBack={false} />

      <View className='profile-card card'>
        <View className='profile-avatar'>{state.user.avatar}</View>
        <View className='profile-info'>
          <Text className='profile-name'>{state.user.nickname}</Text>
          <Text className='profile-slogan'>陪宝宝快乐成长每一天 🌈</Text>
        </View>
      </View>

      <View className='package-card card'>
        <View className='package-copy'>
          <Text className='package-title'>购买套餐</Text>
          <Text className='package-desc'>解锁更多生成次数</Text>
        </View>
        <View className='package-btn' onClick={() => Taro.navigateTo({ url: '/pages/purchase/index' })}>
          去购买
        </View>
      </View>

      <View className='menu-list card'>
        {MENU.map((item) => (
          <View className='menu-item' key={item.title} onClick={() => handleMenu(item.title)}>
            <View className='menu-left'>
              <Text className='menu-icon'>{item.icon}</Text>
              <Text className='menu-title'>{item.title}</Text>
            </View>
            <View className='menu-right'>
              {item.title === '我的套餐' && <Text className='menu-extra'>剩余 {state.user.remainCount} 次</Text>}
              <Text className='menu-arrow'>›</Text>
            </View>
          </View>
        ))}
      </View>

      <BottomNav active='profile' />
    </View>
  )
}
