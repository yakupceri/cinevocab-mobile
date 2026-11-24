#!/bin/sh
# Telefon boyutunda (390x844, 2x) ekran goruntusu alir. Uygulama misafir modunda, sahte veriyle calisir; sunucuya istek gitmez.
# Kullanim: sh dev/ekran/cek.sh <ad> "<steps>" [xp] [adim arasi ms] [toplam sure ms]     ->  dev/tasarim/ekran/uygulama/<ad>-koyu.png ve <ad>-acik.png
cd "$(git rev-parse --show-toplevel)" || exit 2
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=dev/tasarim/ekran/uygulama; mkdir -p "$OUT"
PORT=8777
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT
sleep 1
for T in dark light; do
  [ $T = dark ] && N=koyu || N=acik
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --force-device-scale-factor=2 --window-size=500,844 \
    --user-data-dir="$(mktemp -d)" --virtual-time-budget=${5:-9000} --screenshot="$OUT/tmp.png" \
    "http://127.0.0.1:$PORT/dev/ekran/cek.html?t=$T&xp=${3:-0}&gap=${4:-700}&giris=${GIRIS:-0}&steps=$2" >/dev/null 2>&1
  sips -c 1688 780 "$OUT/tmp.png" --out "$OUT/$1-$N.png" >/dev/null 2>&1
done
rm -f "$OUT/tmp.png"; ls "$OUT" | grep "^$1-"
