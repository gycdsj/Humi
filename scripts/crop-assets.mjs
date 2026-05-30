import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ASSET_NAMES = [
  'home_hero',
  'default_avatar',
  'quota_daily_hero',
  'quota_package_hero',
  'purchase_hero',
  'pay_success_hero',
  'nav_home',
  'nav_home_active',
  'nav_history',
  'nav_history_active',
  'menu_package',
  'menu_usage',
  'menu_favorite',
  'menu_feedback',
  'menu_about',
  'menu_setting',
  'nav_profile',
  'nav_profile_active',
  'icon_regenerate',
  'icon_favorite',
  'icon_favorite_active',
  'icon_history',
  'icon_search',
  'icon_check',
  'icon_back',
  'icon_more',
  'topic_car',
  'topic_banana',
  'topic_bath',
  'topic_cat',
  'topic_moon',
  'topic_carrot',
  'topic_sock',
  'topic_door',
  'topic_broccoli',
  'topic_duck'
]

const input = process.argv[2]
const outputDir = process.argv[3] || path.resolve('src/assets/images')

if (!input) {
  console.error('用法：npm run crop:assets -- <拼图路径> [输出目录]')
  process.exit(1)
}

const image = sharp(input).ensureAlpha()
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true })
const boxes = detectWhiteCards(data, info.width, info.height)

if (boxes.length !== ASSET_NAMES.length) {
  console.error(`识别到 ${boxes.length} 个小图框，但期望 ${ASSET_NAMES.length} 个。请确认拼图未压缩裁边。`)
  console.error(JSON.stringify(boxes, null, 2))
  process.exit(1)
}

await fs.mkdir(outputDir, { recursive: true })

for (const [index, box] of boxes.entries()) {
  const crop = await sharp(input)
    .ensureAlpha()
    .extract({ left: box.left, top: box.top, width: box.width, height: box.height })
    .raw()
    .toBuffer({ resolveWithObject: true })

  const transparent = makeEdgeBackgroundTransparent(crop.data, crop.info.width, crop.info.height)
  await sharp(transparent, {
    raw: {
      width: crop.info.width,
      height: crop.info.height,
      channels: 4
    }
  })
    .trim({ background: { r: 255, g: 255, b: 255, alpha: 0 }, threshold: 8 })
    .png()
    .toFile(path.join(outputDir, `${ASSET_NAMES[index]}.png`))
}

console.log(`已输出 ${ASSET_NAMES.length} 个透明 PNG 到 ${outputDir}`)

function detectWhiteCards(buffer, width, height) {
  const visited = new Uint8Array(width * height)
  const boxes = []

  const isCardPixel = (idx) => {
    const offset = idx * 4
    return buffer[offset] > 232 && buffer[offset + 1] > 232 && buffer[offset + 2] > 232
  }

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const start = y * width + x
      if (visited[start] || !isCardPixel(start)) continue

      const queue = [start]
      visited[start] = 1
      let minX = x
      let maxX = x
      let minY = y
      let maxY = y
      let area = 0

      for (let cursor = 0; cursor < queue.length; cursor += 1) {
        const current = queue[cursor]
        const cx = current % width
        const cy = Math.floor(current / width)
        area += 1
        minX = Math.min(minX, cx)
        maxX = Math.max(maxX, cx)
        minY = Math.min(minY, cy)
        maxY = Math.max(maxY, cy)

        const neighbors = [current - 1, current + 1, current - width, current + width]
        for (const next of neighbors) {
          if (next < 0 || next >= width * height || visited[next]) continue
          const nx = next % width
          if (Math.abs(nx - cx) > 1) continue
          if (!isCardPixel(next)) continue
          visited[next] = 1
          queue.push(next)
        }
      }

      const boxWidth = maxX - minX + 1
      const boxHeight = maxY - minY + 1
      if (area > 1200 && boxWidth > 42 && boxHeight > 42) {
        boxes.push({ left: minX, top: minY, width: boxWidth, height: boxHeight })
      }
    }
  }

  // Sort first
  boxes.sort((a, b) => {
    if (Math.abs(a.top - b.top) > 35) return a.top - b.top
    return a.left - b.left
  })

  // Filter out boxes that are completely inside another box
  return boxes.filter((box, i) => {
    return !boxes.some((other, j) => {
      if (i === j) return false
      return (
        other.left <= box.left &&
        other.top <= box.top &&
        other.left + other.width >= box.left + box.width &&
        other.top + other.height >= box.top + box.height
      )
    })
  })
}

function makeEdgeBackgroundTransparent(buffer, width, height) {
  const output = Buffer.from(buffer)
  const visited = new Uint8Array(width * height)
  const queue = []

  const isBackground = (idx) => {
    const offset = idx * 4
    const red = output[offset]
    const green = output[offset + 1]
    const blue = output[offset + 2]
    const alpha = output[offset + 3]
    return alpha > 0 && red > 238 && green > 238 && blue > 238
  }

  const push = (idx) => {
    if (idx < 0 || idx >= width * height || visited[idx] || !isBackground(idx)) return
    visited[idx] = 1
    queue.push(idx)
  }

  for (let x = 0; x < width; x += 1) {
    push(x)
    push((height - 1) * width + x)
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width)
    push(y * width + width - 1)
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor]
    const offset = current * 4
    output[offset + 3] = 0

    const x = current % width
    const neighbors = [current - 1, current + 1, current - width, current + width]
    for (const next of neighbors) {
      if (next < 0 || next >= width * height) continue
      const nx = next % width
      if (Math.abs(nx - x) > 1) continue
      push(next)
    }
  }

  return output
}
