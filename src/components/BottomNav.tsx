import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './BottomNav.css'

type NavKey = 'home' | 'history' | 'profile'

const NAV_ITEMS: Array<{ key: NavKey; label: string; icon: string; url: string }> = [
  { key: 'home', label: '首页', icon: '⌂', url: '/pages/index/index' },
  { key: 'history', label: '历史', icon: '◷', url: '/pages/history/index' },
  { key: 'profile', label: '我的', icon: '☻', url: '/pages/profile/index' }
]

export default function BottomNav({ active }: { active: NavKey }) {
  const go = (url: string) => {
    Taro.reLaunch({ url })
  }

  return (
    <View className='bottom-nav'>
      {NAV_ITEMS.map((item) => (
        <View
          key={item.key}
          className={`bottom-nav__item ${active === item.key ? 'is-active' : ''}`}
          onClick={() => go(item.url)}
        >
          <Text className='bottom-nav__icon'>{item.icon}</Text>
          <Text className='bottom-nav__label'>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}
