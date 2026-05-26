import { Image, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { imageAssets } from '@/utils/assets'
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
            <Image className='page-header__back-icon' src={imageAssets.iconBack} mode='aspectFit' />
          </View>
        )}
        <View>
          {title && <View className='page-header__title'>{title}</View>}
          {subtitle && <View className='page-header__subtitle'>{subtitle}</View>}
        </View>
      </View>
      <Image className='page-header__more' src={imageAssets.iconMore} mode='aspectFit' />
    </View>
  )
}
