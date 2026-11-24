# Seçilen görsel yön: A, Gece Seansı

Proje sahibi 24 Kasım 2026'da seçti. Taslak: `dev/tasarim/yonler.html` (A satırı). Uygulanmış hâli: `www/app.css`.

## Fikir
Koyu bir sinema salonu. Çevrilecek kelime her zaman film karesinde altyazı olarak durur. Tek vurgu altyazı sarısı. Kelime kartı krem bilet kâğıdı. Sonuç ekranı jenerik gibi okunur.

## Tema
- Varsayılan **koyu**. Açık tema ("matine") yalnızca kullanıcı Ben → Ayarlar → Görünüm'den seçerse: `html[data-theme="light"]`. Sistem teması izlenmez (bilerek).
- Film karesi (`.screen`), film şeridi (`.week`) ve karttaki örnek altyazı (`.wc-ex`) iki temada da koyudur.
- Renkler yalnızca `www/app.css` başındaki token'lardan gelir. Sarı (`--sun`) dolgu içindir; vurgu **yazısı** için `--hi` kullan (koyuda sarı, açıkta bordo).

## Yazı
- Başlık, düğme, büyük sayı: Big Shoulders Display 800 (`--disp`), dar ve kalın.
- Metin: Instrument Sans (`--body`). İkisi de `www/fonts/` içinde yerel, OFL.

## Kurallar
- Köşe 6 px (`--r`), kart 10 px. Gölge ve gradyan yok (tek istisna film karesinin ışığı).
- Her ekranda tek sarı ana düğme, başparmak bölgesinde. Oyun ekranlarında alt menü gizli, sol üstte kapat düğmesi.
- Ödül ve ilerleme gerçek veriye bağlı: kalıcı olan kelime, tekrar gelecek kelime. Sunucudan gelmeyen veri gösterilmez, uydurulmaz (bekleyenler: `dev/SUNUCU-ISTEKLERI.md`).
- Metinde seri kaybı, suçluluk, aciliyet yok. Emoji yok.
- Ekran görüntüsü: `sh dev/ekran/cek.sh <ad> "<adımlar>"` (misafir modu, koyu ve açık).
