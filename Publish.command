#!/bin/zsh
set -euo pipefail

SCRIPT_DIR="${0:A:h}"
cd "$SCRIPT_DIR"

pause_on_error() {
  echo ""
  echo "중간에 멈췄습니다. 위의 안내를 확인해주세요."
  read -k 1 "?아무 키나 누르면 종료합니다."
}
trap pause_on_error ERR

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "GitHub 저장소가 아직 연결되지 않았습니다."
  echo "GitHub 로그인 후 이 프로젝트에 origin을 연결해주세요."
  false
fi

ORIGIN_URL="$(git remote get-url origin)"
if [[ "$ORIGIN_URL" != *"github.com"* ]]; then
  echo "origin이 GitHub 저장소가 아닙니다: $ORIGIN_URL"
  echo "기존 호스팅 저장소 대신 GitHub 저장소를 origin으로 연결해야 합니다."
  false
fi

echo "[1/4] 사진과 글을 웹용으로 정리합니다."
npm run content:sync

echo "[2/4] 사이트 오류를 검사합니다."
npm run build

echo "[3/4] 변경 내용을 Git에 기록합니다."
git add data/portfolio.json public/media/portfolio public/media/float
git add -u

if git diff --cached --quiet; then
  echo "올릴 변경 내용이 없습니다."
else
  git commit -m "Update portfolio $(date '+%Y-%m-%d %H:%M')"
fi

echo "[4/4] GitHub에 올립니다."
git push origin main

echo ""
echo "완료했습니다. Vercel이 자동으로 새 버전을 배포합니다."
echo "이 창을 닫아도 됩니다."
read -k 1 "?아무 키나 누르면 종료합니다."
