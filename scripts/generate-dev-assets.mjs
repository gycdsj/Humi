import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const outputDir = path.resolve('src/assets/images')

const assets = {
  home_hero: heroBaby(),
  default_avatar: bear(),
  quota_daily_hero: bunny(),
  quota_package_hero: star(),
  purchase_hero: bath(),
  pay_success_hero: bearCheck(),
  nav_home: labelIcon('⌂', '#ffffff', '#9b6a5a'),
  nav_home_active: labelIcon('⌂', '#f2a095', '#ffffff'),
  nav_history: labelIcon('◷', '#ffffff', '#9b6a5a'),
  nav_history_active: labelIcon('◷', '#cf7168', '#ffffff'),
  menu_package: labelIcon('□', '#fff4df', '#9b6a5a'),
  menu_usage: labelIcon('≡', '#fff4df', '#9b6a5a'),
  menu_favorite: heart('#ffffff', '#9b6a5a'),
  menu_feedback: labelIcon('○', '#fff4df', '#9b6a5a'),
  menu_about: labelIcon('i', '#f2c1b7', '#9b6a5a'),
  menu_setting: labelIcon('⚙', '#fff4df', '#9b6a5a'),
  nav_profile: labelIcon('○', '#ffffff', '#9b6a5a'),
  nav_profile_active: labelIcon('○', '#cf7168', '#ffffff'),
  icon_regenerate: labelIcon('↻', '#ffffff', '#9b6a5a'),
  icon_favorite: heart('#ffffff', '#9b6a5a'),
  icon_favorite_active: heart('#d77d72', '#ffffff'),
  icon_history: labelIcon('▤', '#ffffff', '#9b6a5a'),
  icon_search: labelIcon('⌕', '#ffffff', '#9b6a5a'),
  icon_check: labelIcon('✓', '#78bd68', '#ffffff'),
  icon_back: labelIcon('‹', '#ffffff', '#9b6a5a'),
  icon_more: labelIcon('···', '#ffffff', '#9b6a5a'),
  topic_car: car(),
  topic_banana: banana(),
  topic_bath: bath(),
  topic_cat: cat(),
  topic_moon: moon(),
  topic_carrot: carrot(),
  topic_sock: sock(),
  topic_door: door(),
  topic_broccoli: broccoli(),
  topic_duck: duck()
}

await fs.mkdir(outputDir, { recursive: true })

for (const [name, svg] of Object.entries(assets)) {
  await sharp(Buffer.from(svg)).resize(192, 192, { fit: 'contain' }).png().toFile(path.join(outputDir, `${name}.png`))
}

console.log(`已生成 ${Object.keys(assets).length} 个开发用透明 PNG 到 ${outputDir}`)

function svg(content, size = 192) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 192 192">${content}</svg>`
}

function labelIcon(text, bg, color) {
  return svg(`
    <circle cx="96" cy="96" r="74" fill="${bg}" stroke="#8f5f4f" stroke-width="6"/>
    <text x="96" y="112" text-anchor="middle" font-size="66" font-family="Arial, sans-serif" font-weight="700" fill="${color}">${text}</text>
  `)
}

function heart(bg, color) {
  return svg(`
    <circle cx="96" cy="96" r="74" fill="${bg}" stroke="#8f5f4f" stroke-width="6"/>
    <path d="M96 137C65 113 47 96 47 75c0-16 12-28 28-28 9 0 17 4 21 11 4-7 12-11 21-11 16 0 28 12 28 28 0 21-18 38-49 62Z" fill="${color}"/>
  `)
}

function heroBaby() {
  return svg(`
    <ellipse cx="96" cy="145" rx="55" ry="28" fill="#ffc5cf"/>
    <circle cx="96" cy="82" r="48" fill="#ffd7c6" stroke="#8f5f4f" stroke-width="5"/>
    <path d="M52 73c8-35 36-49 70-34 15 7 24 20 25 39-25-14-59-14-95-5Z" fill="#8a553b"/>
    <circle cx="78" cy="88" r="5" fill="#5a382f"/><circle cx="116" cy="88" r="5" fill="#5a382f"/>
    <path d="M82 112c10 8 21 8 31 0" fill="none" stroke="#8f5f4f" stroke-width="5" stroke-linecap="round"/>
    <circle cx="58" cy="55" r="14" fill="#ffe37a"/><circle cx="52" cy="41" r="7" fill="#ff9eb2"/><circle cx="72" cy="41" r="7" fill="#ff9eb2"/>
    <path d="M48 126c-18 8-24 22-19 31 8 14 31 1 35-22" fill="#ffc5cf" stroke="#8f5f4f" stroke-width="5"/>
  `)
}

function bear() {
  return svg(`
    <circle cx="96" cy="96" r="75" fill="#dfe6f1"/>
    <circle cx="58" cy="66" r="23" fill="#b97a55" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="134" cy="66" r="23" fill="#b97a55" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="96" cy="96" r="58" fill="#c58b65" stroke="#8f5f4f" stroke-width="5"/>
    <ellipse cx="96" cy="112" rx="27" ry="21" fill="#e8b990"/>
    <circle cx="77" cy="88" r="6" fill="#5a382f"/><circle cx="115" cy="88" r="6" fill="#5a382f"/>
    <path d="M90 105h12l-6 7Z" fill="#5a382f"/><path d="M82 119c8 9 20 9 28 0" fill="none" stroke="#5a382f" stroke-width="4" stroke-linecap="round"/>
  `)
}

function bearCheck() {
  return svg(`${bearBody()}<circle cx="132" cy="132" r="43" fill="#75c96b"/><path d="M111 130l16 16 31-35" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`)
}

function bearBody() {
  return `
    <circle cx="58" cy="66" r="23" fill="#c58b65" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="134" cy="66" r="23" fill="#c58b65" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="96" cy="96" r="58" fill="#d19a72" stroke="#8f5f4f" stroke-width="5"/>
    <ellipse cx="96" cy="112" rx="27" ry="21" fill="#e8b990"/>
    <circle cx="77" cy="88" r="6" fill="#5a382f"/><circle cx="115" cy="88" r="6" fill="#5a382f"/>
    <path d="M90 105h12l-6 7Z" fill="#5a382f"/>
  `
}

function bunny() {
  return svg(`
    <ellipse cx="71" cy="55" rx="16" ry="42" fill="#fff" stroke="#8f5f4f" stroke-width="5"/>
    <ellipse cx="121" cy="55" rx="16" ry="42" fill="#fff" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="96" cy="103" r="54" fill="#fff" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="77" cy="100" r="6" fill="#5a382f"/><circle cx="115" cy="100" r="6" fill="#5a382f"/>
    <circle cx="70" cy="116" r="9" fill="#ffb4be"/><circle cx="122" cy="116" r="9" fill="#ffb4be"/>
    <path d="M91 110h10l-5 6Z" fill="#5a382f"/><path d="M102 132l35-18 10 19-37 19Z" fill="#f58b57" stroke="#8f5f4f" stroke-width="4"/>
    <path d="M139 106l7-19 12 15Z" fill="#68b15a"/>
  `)
}

function star() {
  return svg(`
    <path d="M96 18l22 48 52 6-39 36 11 51-46-26-46 26 11-51-39-36 52-6Z" fill="#ffd85d" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="78" cy="92" r="5" fill="#5a382f"/><circle cx="113" cy="92" r="5" fill="#5a382f"/>
    <path d="M84 116c9-7 18-7 26 0" fill="none" stroke="#8f5f4f" stroke-width="5" stroke-linecap="round"/>
    <path d="M122 112l20 20M142 112l-20 20" stroke="#e99a6e" stroke-width="6" stroke-linecap="round"/>
  `)
}

function bath() {
  return svg(`
    <ellipse cx="98" cy="129" rx="70" ry="24" fill="#9ed9ed" stroke="#8f5f4f" stroke-width="5"/>
    <path d="M34 83h128l-13 48H47Z" fill="#c7edf6" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <path d="M121 84c9-29-10-56-32-50 21 11 18 31 1 50Z" fill="#ffe072" stroke="#8f5f4f" stroke-width="4"/>
    <circle cx="60" cy="74" r="13" fill="#ffd64d"/><circle cx="77" cy="74" r="9" fill="#ffd64d"/>
    <circle cx="55" cy="68" r="3" fill="#5a382f"/>
  `)
}

function car() {
  return svg(`
    <rect x="38" y="86" width="116" height="44" rx="16" fill="#ef8272" stroke="#8f5f4f" stroke-width="5"/>
    <path d="M61 86l20-27h41l21 27Z" fill="#a8dceb" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="67" cy="132" r="15" fill="#5f5a64"/><circle cx="126" cy="132" r="15" fill="#5f5a64"/>
    <circle cx="67" cy="132" r="6" fill="#fff"/><circle cx="126" cy="132" r="6" fill="#fff"/>
  `)
}

function banana() {
  return svg(`
    <path d="M54 54c36 69 70 77 101 17-2 52-33 89-78 79-31-7-48-35-41-79 7 5 13 1 18-17Z" fill="#ffd95a" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <path d="M54 54l-15-13" stroke="#6a8a3c" stroke-width="8" stroke-linecap="round"/>
  `)
}

function cat() {
  return svg(`
    <path d="M49 75L55 36l31 24h20l31-24 6 39c15 14 21 35 16 54-9 31-39 45-63 45s-54-14-63-45c-5-19 1-40 16-54Z" fill="#f1bd84" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="76" cy="105" r="6" fill="#5a382f"/><circle cx="116" cy="105" r="6" fill="#5a382f"/>
    <path d="M91 116h10l-5 7Z" fill="#5a382f"/><path d="M81 130c10 8 20 8 30 0" fill="none" stroke="#8f5f4f" stroke-width="4" stroke-linecap="round"/>
  `)
}

function moon() {
  return svg(`
    <path d="M126 34c-37 12-60 50-49 87 9 29 35 48 65 49-11 7-25 11-40 11-43 0-78-35-78-78 0-39 29-72 67-77 13-2 25 1 35 8Z" fill="#ffd85d" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
  `)
}

function carrot() {
  return svg(`
    <path d="M75 54c32 5 57 25 65 56l-70 60c-20-35-18-75 5-116Z" fill="#ef8a58" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <path d="M96 51c2-19 14-28 34-26-2 18-16 29-34 26ZM92 54c-17-9-23-23-16-40 17 8 23 22 16 40Z" fill="#67ad55" stroke="#8f5f4f" stroke-width="4"/>
    <path d="M77 91l33 9M72 122l27 7" stroke="#c96842" stroke-width="4" stroke-linecap="round"/>
  `)
}

function sock() {
  return svg(`
    <path d="M68 36h55v73c0 17-8 29-23 36l-32 15c-18 8-36-10-27-28l27-52Z" fill="#f2aa8b" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <path d="M65 36h61v24H65Z" fill="#ffd0bd" stroke="#8f5f4f" stroke-width="5"/>
  `)
}

function door() {
  return svg(`
    <rect x="54" y="31" width="84" height="134" rx="5" fill="#bd825f" stroke="#8f5f4f" stroke-width="6"/>
    <rect x="70" y="47" width="52" height="37" fill="#d49a78" opacity=".65"/>
    <circle cx="119" cy="103" r="6" fill="#8f5f4f"/>
  `)
}

function broccoli() {
  return svg(`
    <path d="M90 105c-4 24-12 42-27 58h66c-14-17-22-35-27-58Z" fill="#78b765" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="65" cy="79" r="27" fill="#5aa84e" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="96" cy="62" r="32" fill="#61b456" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="128" cy="83" r="29" fill="#56a44a" stroke="#8f5f4f" stroke-width="5"/>
    <circle cx="94" cy="93" r="29" fill="#68bd5a" stroke="#8f5f4f" stroke-width="5"/>
  `)
}

function duck() {
  return svg(`
    <path d="M65 117c-3-41 24-72 58-66 26 5 43 31 31 56 20 2 29 14 24 28-7 21-39 29-73 29-28 0-50-13-40-47Z" fill="#ffd65a" stroke="#8f5f4f" stroke-width="5" stroke-linejoin="round"/>
    <circle cx="118" cy="83" r="5" fill="#5a382f"/>
    <path d="M151 91l27 10-27 12Z" fill="#ef8b4e" stroke="#8f5f4f" stroke-width="4" stroke-linejoin="round"/>
  `)
}
