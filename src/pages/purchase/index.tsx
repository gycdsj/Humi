import { useEffect, useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import PageHeader from '@/components/PageHeader'
import { AppState, PACKAGE_PLANS, buyPackage, loadState } from '@/utils/store'
import './index.css'

export default function PurchasePage() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [selectedId, setSelectedId] = useState(PACKAGE_PLANS[1].id)
  const [paid, setPaid] = useState(false)

  useEffect(() => {
    setState(loadState())
  }, [])

  const selected = useMemo(
    () => PACKAGE_PLANS.find((item) => item.id === selectedId) || PACKAGE_PLANS[0],
    [selectedId]
  )

  const pay = () => {
    const next = buyPackage(state, selected.id)
    setState(next)
    setPaid(true)
  }

  if (paid) {
    return (
      <View className='page-shell blush paid-page'>
        <View className='safe-top' />
        <View className='paid-hero'>
          <View className='paid-bear'>🐻</View>
          <View className='paid-check'>✓</View>
        </View>
        <Text className='paid-title'>支付成功</Text>
        <Text className='paid-desc'>{selected.name}已为你开通，快去生成更多好听的内容吧！</Text>
        <View className='primary-btn paid-primary' onClick={() => Taro.navigateBack()}>
          我知道了
        </View>
        <View className='secondary-btn paid-secondary' onClick={() => Taro.reLaunch({ url: '/pages/index/index' })}>
          去生成
        </View>
      </View>
    )
  }

  return (
    <View className='page-shell purchase-page'>
      <View className='safe-top' />
      <PageHeader title='购买次数' subtitle='选择套餐，解锁更多创作次数' />

      <View className='purchase-hero'>
        <View>
          <Text className='purchase-title'>购买次数</Text>
          <Text className='purchase-subtitle'>选择套餐，解锁更多创作次数</Text>
        </View>
        <Text className='purchase-banana'>🍌</Text>
      </View>

      <View className='plan-list'>
        {PACKAGE_PLANS.map((plan) => (
          <View
            key={plan.id}
            className={`plan-card card ${selectedId === plan.id ? 'is-selected' : ''}`}
            onClick={() => setSelectedId(plan.id)}
          >
            <View>
              <View className='plan-name-row'>
                <Text className='plan-name'>{plan.name}</Text>
                {plan.tag && <Text className='plan-tag'>{plan.tag}</Text>}
              </View>
              <Text className='plan-validity'>{plan.validity}</Text>
            </View>
            <View className='plan-price-wrap'>
              <Text className='plan-price'>¥{plan.price}</Text>
              <Text className='plan-check'>{selectedId === plan.id ? '✓' : '○'}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='purchase-notes'>
        <Text>● 购买后次数立即到账</Text>
        <Text>● 本使用次数在有效期内可继续使用</Text>
        <Text>● 套餐不可叠加，不支持退款</Text>
      </View>

      <View className='primary-btn purchase-pay' onClick={pay}>
        立即支付 ¥{selected.price}
      </View>
    </View>
  )
}
