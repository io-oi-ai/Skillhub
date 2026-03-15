#!/usr/bin/env python3
"""
豆包 TTS - 生成中文配音
Uses V1 API with correct credentials.
"""

import json
import uuid
import base64
import os
import subprocess
import requests

# Correct credentials from console
APPID = "6038806669"
TOKEN = "dr4nLPfT2dBKQkKUhEUwiW2jCGxdt2De"
CLUSTER = "volcano_mega"
VOICE_TYPE = "S_BgmdbRdU1"  # 大模型音色
AUDIO_DIR = "public/audio"
API_URL = "https://openspeech.bytedance.com/api/v1/tts"


def tts(text: str, output_path: str) -> bool:
    reqid = str(uuid.uuid4())
    body = {
        "app": {"appid": APPID, "token": TOKEN, "cluster": CLUSTER},
        "user": {"uid": "skillhubs"},
        "audio": {
            "voice_type": VOICE_TYPE,
            "encoding": "mp3",
            "speed_ratio": 1.0,
            "volume_ratio": 1.0,
            "pitch_ratio": 1.0,
        },
        "request": {
            "reqid": reqid,
            "text": text,
            "text_type": "plain",
            "operation": "query",
        },
    }

    print(f"  Generating: {output_path}")
    resp = requests.post(
        API_URL,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer;{TOKEN}",
        },
        json=body,
    )
    data = resp.json()

    if data.get("code") != 3000:
        print(f"  ERROR: code={data.get('code')}, msg={data.get('message')}")
        return False

    audio = base64.b64decode(data["data"])
    with open(output_path, "wb") as f:
        f.write(audio)

    try:
        dur = subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", output_path],
            stderr=subprocess.DEVNULL,
        ).decode().strip()
    except:
        dur = "?"
    print(f"  OK: {len(audio)} bytes, {dur}s")
    return True


# Voiceover texts matching remotion/src/i18n/texts.ts
VO_LINES = [
    ("你的AI Agent，取决于它的Skills。", "vo-hook-zh.mp3"),
    ("这是SkillHubs。", "vo-intro-zh.mp3"),
    ("大多数提示词是一次性的，缺乏结构，未经验证。你的Agent值得更好的。", "vo-problem-zh.mp3"),
    ("SkillHubs是一个精选的生产级AI技能库，专为真正能交付工作的Agent打造。", "vo-solution-zh.mp3"),
    ("五个精选合集：独立开发、营销增长、数据分析、财务和开发工具。", "vo-collections-zh.mp3"),
    ("41个技能，11种角色，10个场景，每周持续更新。", "vo-coverage-zh.mp3"),
    ("安装命令行工具，几秒内浏览、搜索技能并接入你的Agent工作流。", "vo-cli-zh.mp3"),
    ("访问skillhubs.cc，免费且开源。", "vo-cta-zh.mp3"),
    ("SkillHubs，让Agent真正好用的技能。", "vo-outro-zh.mp3"),
]


if __name__ == "__main__":
    os.makedirs(AUDIO_DIR, exist_ok=True)

    print("=== 豆包 TTS: 生成中文配音 ===")
    print(f"Voice: {VOICE_TYPE}")
    print(f"AppID: {APPID}")
    print()

    success = 0
    fail = 0

    for text, filename in VO_LINES:
        output = os.path.join(AUDIO_DIR, filename)
        if tts(text, output):
            success += 1
        else:
            fail += 1

    print()
    print(f"=== Done: {success} succeeded, {fail} failed ===")
