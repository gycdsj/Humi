#!/bin/bash
# ========================================
# miniprogram-ci 远程预览脚本
# 在服务器上生成预览二维码
# ========================================

set -e

cd "$(dirname "$0")/.."

# 配置（首次使用时填写）
APPID="wx8cfc5e70bdfdc7bc"
PRIVATE_KEY_PATH="$(pwd)/private.key"
PROJECT_PATH="$(pwd)"
DIST_PATH="$(pwd)/dist"

# 二维码输出路径
QR_PATH="/tmp/humi-preview.png"

echo "🏗️  1/3 构建小程序..."
npx taro build --type weapp

if [ ! -d "$DIST_PATH" ]; then
  echo "❌ 构建失败: dist 目录不存在"
  exit 1
fi

echo "📦 2/3 生成预览二维码..."
npx miniprogram-ci preview \
  --appid "$APPID" \
  --pkp "$PRIVATE_KEY_PATH" \
  --pp "$PROJECT_PATH" \
  --upload-version "1.0.0-preview" \
  --enable-qrcode \
  --qrcode-format image \
  --qrcode-output-dest "$QR_PATH" \
  --robot 1

echo "✅ 3/3 二维码已生成: $QR_PATH"

# 输出文件路径供助手读取
echo "QR_PATH=$QR_PATH"
