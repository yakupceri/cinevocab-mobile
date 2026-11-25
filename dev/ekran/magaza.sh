#!/bin/sh
# Play Store ekran goruntuleri (1080x1920) ve one cikan gorsel (1024x500). Misafir modu, ornek veri; kisisel veri yok.
# Kullanim: sh dev/ekran/magaza.sh
cd "$(git rev-parse --show-toplevel)" || exit 2
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"; PORT=8778
python3 -m http.server $PORT --bind 127.0.0.1 >/dev/null 2>&1 & SRV=$!
trap 'kill $SRV 2>/dev/null' EXIT; sleep 1
shot() {   # dil ad adimlar xp giris [adim arasi ms] [sure ms]
  mkdir -p "store/ekran-$1"
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-prefers-reduced-motion --force-device-scale-factor=3 --window-size=500,640 \
    --user-data-dir="$(mktemp -d)" --virtual-time-budget=${7:-9000} --screenshot="store/ekran-$1/tmp.png" \
    "http://127.0.0.1:$PORT/dev/ekran/cek.html?t=dark&ui=$1&w=360&h=640&xp=$4&giris=$5&gap=${6:-700}&steps=$3" >/dev/null 2>&1
  sips -c 1920 1080 "store/ekran-$1/tmp.png" --out "store/ekran-$1/$2.png" >/dev/null 2>&1; rm -f "store/ekran-$1/tmp.png"
}
P='%23tabs%20[data-view="v-play"]'
for L in tr en; do
  shot $L 1-karsilama "wait,%23demoLine%20.dw" 0 1
  shot $L 2-ana "" 30 0
  shot $L 3-kart "$P,tFlow" 30 0
  shot $L 4-soru "$P,tPractice" 30 0
  shot $L 5-ekle "wait,show:v-add" 30 0
  shot $L 6-sonuc "$P,tCards,cYes,cYes,cNo,cYes,cYes,cYes,cNo,cYes,cYes,cYes" 0 0 1000 20000
  shot $L 7-oyna "$P" 30 0
  shot $L 8-dublaj "$P,tMatch,eslestir,eslestir,eslestir,%23mGrid%20.mt.s" 0 0 900 14000
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --window-size=1024,500 --virtual-time-budget=4000 --screenshot="store/feature-$L.png" "http://127.0.0.1:$PORT/dev/ekran/kapak.html?l=$L" >/dev/null 2>&1
done
ls store/ekran-tr store/ekran-en
