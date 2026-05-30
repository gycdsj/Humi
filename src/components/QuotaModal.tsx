import { Image, View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { imageAssets } from '@/utils/assets'
import './QuotaModal.css'

export default function QuotaModal({
  variant = 'daily',
  onClose
}: {
  variant?: 'daily' | 'package'
  onClose: () => void
}) {
  const goPurchase = () => {
    onClose()
    Taro.navigateTo({ url: '/pages/purchase/index' })
  }

  return (
    <View className='quota-mask'>
      <View className={`quota-modal ${variant === 'package' ? 'quota-modal--package' : ''}`}>
        <Image
          className='quota-hero'
          src={variant === 'package' ? imageAssets.quotaPackageHero : imageAssets.quotaDailyHero}
          mode='aspectFit'
        />
        <Text className='quota-title'>
          {variant === 'package' ? '剩余次数不足' : '今日次数已用完啦'}
        </Text>
        <Text className='quota-desc'>
          {variant === 'package'
            ? '开通套餐，继续生成更多内容'
            : '开通套餐，继续生成更多内容吧～'}
        </Text>
        {variant === 'package' && (
          <View className='quota-packages'>
            <View className='quota-package quota-package--warm'>
              <Text>10次套餐</Text>
              <Text className='quota-price'>¥6.9</Text>
            </View>
            <View className='quota-package quota-package--pink'>
              <Text>50次套餐</Text>
              <Text className='quota-price'>¥19.9</Text>
            </View>
          </View>
        )}
        <View className='primary-btn quota-primary' onClick={goPurchase}>
          去购买次数
        </View>
        <View className='secondary-btn quota-secondary' onClick={onClose}>
          稍后再说
        </View>
      </View>
    </View>
  )
}
