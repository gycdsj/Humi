import { useEffect, useState } from 'react'
import { Image, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import BottomNav from '@/components/BottomNav'
import { imageAssets } from '@/utils/assets'
import { AppState, loadState, updateUserNickname } from '@/utils/store'
import './index.css'

const MENU = [
  { icon: imageAssets.menuPackage, title: '我的套餐', extra: '' },
  { icon: imageAssets.menuUsage, title: '使用记录', extra: '' },
  { icon: imageAssets.menuFavorite, title: '满意作品', extra: '' }
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

  const editNickname = () => {
    Taro.showModal({
      title: '编辑昵称',
      content: state.user.nickname,
      editable: true,
      placeholderText: '请输入昵称',
      confirmColor: '#ff477f',
      success: (res) => {
        const nickname = String((res as unknown as { content?: string }).content || '').trim().slice(0, 12)
        if (res.confirm && nickname) {
          setState(updateUserNickname(loadState(), nickname))
        }
      }
    } as Taro.showModal.Option)
  }

  return (
    <View className='page-shell cool profile-page'>
      <View className='profile-safe-top' />

      <View className='profile-card card'>
        <Image className='profile-avatar' src={imageAssets.defaultAvatar} mode='aspectFit' />
        <View className='profile-info'>
          <View className='profile-name-row'>
            <Text className='profile-name'>{state.user.nickname}</Text>
            <View className='profile-edit' onClick={editNickname}>编辑</View>
          </View>
          <Text className='profile-slogan'>陪宝宝快乐成长每一天</Text>
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

      <View className='cost-card card'>
        <Text className='cost-title'>费用说明</Text>
        <View className='cost-row'>
          <Text>生成顺口溜</Text>
          <Text className='cost-count'>消耗 1 次</Text>
        </View>
        <View className='cost-row'>
          <Text>生成儿歌</Text>
          <Text className='cost-count'>消耗 2 次</Text>
        </View>
      </View>

      <View className='menu-list card'>
        {MENU.map((item) => (
          <View className='menu-item' key={item.title} onClick={() => handleMenu(item.title)}>
            <View className='menu-left'>
              <Image className='menu-icon' src={item.icon} mode='aspectFit' />
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
