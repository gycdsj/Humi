import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './PageHeader.css'

export default function PageHeader({
  title,
  subtitle,
  showBack = true
}: {
  title?: string
  subtitle?: string
  showBack?: boolean
}) {
  return (
    <View className='page-header'>
      <View className='page-header__left'>
        {showBack && (
          <View className='page-header__back' onClick={() => Taro.navigateBack()}>
            ‹
          </View>
        )}
        <View>
          {title && <View className='page-header__title'>{title}</View>}
          {subtitle && <View className='page-header__subtitle'>{subtitle}</View>}
        </View>
      </View>
      <Text className='page-header__dot'>•••</Text>
      <Text className='page-header__circle'>○</Text>
    </View>
  )
}
