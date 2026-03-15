#!/bin/bash
# 火山引擎豆包 TTS - 生成中文配音
# Usage: ./scripts/volcengine-tts.sh

set -e

API_KEY="6ee88c2d-0601-418d-81fc-12a7c1af82cf"
API_URL="https://openspeech.bytedance.com/api/v1/tts"
AUDIO_DIR="public/audio"

# 阳光男声 - 适合产品宣传
VOICE_TYPE="BV021_streaming"

tts() {
  local text="$1"
  local output="$2"
  local reqid=$(uuidgen | tr '[:upper:]' '[:lower:]')

  local body=$(cat <<ENDJSON
{
  "app": {
    "appid": "default",
    "token": "${API_KEY}",
    "cluster": "volcano_tts"
  },
  "user": {
    "uid": "skillhubs"
  },
  "audio": {
    "voice_type": "${VOICE_TYPE}",
    "encoding": "mp3",
    "speed_ratio": 1.0,
    "volume_ratio": 1.0,
    "pitch_ratio": 1.0
  },
  "request": {
    "reqid": "${reqid}",
    "text": "${text}",
    "text_type": "plain",
    "operation": "query"
  }
}
ENDJSON
)

  echo "  Generating: $output"
  local response=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer;${API_KEY}" \
    -d "$body")

  # Check for error
  local code=$(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('code', -1))" 2>/dev/null)
  if [ "$code" != "3000" ]; then
    echo "  ERROR (code=$code): $(echo "$response" | python3 -c "import sys,json; print(json.load(sys.stdin).get('message', 'unknown'))" 2>/dev/null)"
    echo "  Full response: $response" | head -c 500
    return 1
  fi

  # Extract base64 audio and decode
  echo "$response" | python3 -c "
import sys, json, base64
data = json.load(sys.stdin)
audio_b64 = data.get('data', '')
if audio_b64:
    sys.stdout.buffer.write(base64.b64decode(audio_b64))
" > "$output"

  local size=$(wc -c < "$output" | tr -d ' ')
  local dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$output" 2>/dev/null || echo "?")
  echo "  OK: ${size} bytes, ${dur}s"
}

echo "=== 豆包 TTS: 生成中文配音 ==="
echo "Voice: $VOICE_TYPE"
echo ""

tts "你的AI Agent，取决于它的Skills。" "$AUDIO_DIR/vo-hook-zh.mp3"
tts "这是SkillHubs。" "$AUDIO_DIR/vo-intro-zh.mp3"
tts "大多数提示词是一次性的，缺乏结构，未经验证。你的Agent值得更好的。" "$AUDIO_DIR/vo-problem-zh.mp3"
tts "SkillHubs是一个精选的生产级AI技能库，专为真正能交付工作的Agent打造。" "$AUDIO_DIR/vo-solution-zh.mp3"
tts "五个精选合集：独立开发、营销增长、数据分析、财务和开发工具。" "$AUDIO_DIR/vo-collections-zh.mp3"
tts "41个技能，11种角色，10个场景，每周持续更新。" "$AUDIO_DIR/vo-coverage-zh.mp3"
tts "安装命令行工具，几秒内浏览、搜索技能并接入你的Agent工作流。" "$AUDIO_DIR/vo-cli-zh.mp3"
tts "访问skillhubs.cc，免费且开源。" "$AUDIO_DIR/vo-cta-zh.mp3"
tts "SkillHubs，让Agent真正好用的技能。" "$AUDIO_DIR/vo-outro-zh.mp3"

echo ""
echo "=== Done ==="
