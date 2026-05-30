import { Image, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { imageAssets } from '@/utils/assets'
import './BottomNav.css'

type NavKey = 'home' | 'history' | 'profile'

const NAV_ITEMS: Array<{ key: NavKey; label: string; icon: string; activeIcon: string; url: string }> = [
  { key: 'home', label: '首页', icon: imageAssets.navHome, activeIcon: imageAssets.navHomeActive, url: '/pages/index/index' },
  {
    key: 'history',
    label: '历史',
    icon: imageAssets.navHistory,
    activeIcon: imageAssets.navHistoryActive,
    url: '/pages/history/index'
  },
  {
    key: 'profile',
    label: '我的',
    icon: imageAssets.navProfile,
    activeIcon: imageAssets.navProfileActive,
    url: '/pages/profile/index'
  }
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
          <Image className='bottom-nav__icon' src={active === item.key ? item.activeIcon : item.icon} mode='aspectFit' />
          <Text className='bottom-nav__label'>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}
