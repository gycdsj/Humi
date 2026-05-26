import homeHero from '@/assets/images/home_hero.png'
import defaultAvatar from '@/assets/images/default_avatar.png'
import quotaDailyHero from '@/assets/images/quota_daily_hero.png'
import quotaPackageHero from '@/assets/images/quota_package_hero.png'
import purchaseHero from '@/assets/images/purchase_hero.png'
import paySuccessHero from '@/assets/images/pay_success_hero.png'
import navHome from '@/assets/images/nav_home.png'
import navHomeActive from '@/assets/images/nav_home_active.png'
import navHistory from '@/assets/images/nav_history.png'
import navHistoryActive from '@/assets/images/nav_history_active.png'
import navProfile from '@/assets/images/nav_profile.png'
import navProfileActive from '@/assets/images/nav_profile_active.png'
import menuPackage from '@/assets/images/menu_package.png'
import menuUsage from '@/assets/images/menu_usage.png'
import menuFavorite from '@/assets/images/menu_favorite.png'
import menuFeedback from '@/assets/images/menu_feedback.png'
import menuAbout from '@/assets/images/menu_about.png'
import menuSetting from '@/assets/images/menu_setting.png'
import iconRegenerate from '@/assets/images/icon_regenerate.png'
import iconFavorite from '@/assets/images/icon_favorite.png'
import iconFavoriteActive from '@/assets/images/icon_favorite_active.png'
import iconHistory from '@/assets/images/icon_history.png'
import iconSearch from '@/assets/images/icon_search.png'
import iconCheck from '@/assets/images/icon_check.png'
import iconBack from '@/assets/images/icon_back.png'
import iconMore from '@/assets/images/icon_more.png'
import topicCar from '@/assets/images/topic_car.png'
import topicBanana from '@/assets/images/topic_banana.png'
import topicBath from '@/assets/images/topic_bath.png'
import topicCat from '@/assets/images/topic_cat.png'
import topicMoon from '@/assets/images/topic_moon.png'
import topicCarrot from '@/assets/images/topic_carrot.png'
import topicSock from '@/assets/images/topic_sock.png'
import topicDoor from '@/assets/images/topic_door.png'
import topicBroccoli from '@/assets/images/topic_broccoli.png'
import topicDuck from '@/assets/images/topic_duck.png'

export const imageAssets = {
  homeHero,
  defaultAvatar,
  quotaDailyHero,
  quotaPackageHero,
  purchaseHero,
  paySuccessHero,
  navHome,
  navHomeActive,
  navHistory,
  navHistoryActive,
  navProfile,
  navProfileActive,
  menuPackage,
  menuUsage,
  menuFavorite,
  menuFeedback,
  menuAbout,
  menuSetting,
  iconRegenerate,
  iconFavorite,
  iconFavoriteActive,
  iconHistory,
  iconSearch,
  iconCheck,
  iconBack,
  iconMore,
  topicCar,
  topicBanana,
  topicBath,
  topicCat,
  topicMoon,
  topicCarrot,
  topicSock,
  topicDoor,
  topicBroccoli,
  topicDuck
}

export type TopicAssetKey =
  | 'topicCar'
  | 'topicBanana'
  | 'topicBath'
  | 'topicCat'
  | 'topicMoon'
  | 'topicCarrot'
  | 'topicSock'
  | 'topicDoor'
  | 'topicBroccoli'
  | 'topicDuck'

export function getTopicAssetByInput(input: string) {
  const map: Record<string, TopicAssetKey> = {
    小汽车: 'topicCar',
    汽车: 'topicCar',
    香蕉: 'topicBanana',
    洗澡: 'topicBath',
    小猫: 'topicCat',
    猫: 'topicCat',
    月亮: 'topicMoon',
    小月亮: 'topicMoon',
    胡萝卜: 'topicCarrot',
    袜子: 'topicSock',
    小袜子: 'topicSock',
    电梯: 'topicDoor',
    门: 'topicDoor',
    西蓝花: 'topicBroccoli',
    鸭子: 'topicDuck',
    小鸭子: 'topicDuck'
  }

  const key = map[input] || fallbackTopicAssets[Math.abs(hashCode(input)) % fallbackTopicAssets.length]
  return imageAssets[key]
}

const fallbackTopicAssets: TopicAssetKey[] = [
  'topicCar',
  'topicBanana',
  'topicBath',
  'topicCat',
  'topicMoon',
  'topicCarrot',
  'topicSock',
  'topicDoor',
  'topicBroccoli',
  'topicDuck'
]

function hashCode(value: string) {
  return value.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0)
}
