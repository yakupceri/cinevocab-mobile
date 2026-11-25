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

## Konumlandırma (24 Kasım 2026)
Söz: **"İzlediğin dizinin kelimelerini öğren."** Duolingo'nun yerine değil, yanına: herkese aynı kurs değil, kullanıcının kendi izlediği ve okuduğu şeyin kelimeleri, geçtiği cümleyle.
- Her ekranda önce kullanıcının kendi kelimeleri: ana sayfada tekrar bulmacadan önce gelir, karede kendi kaynağından cümle durur.
- Ekle ve ilk açılışta ilk seçenek "Altyazı ya da metin getir". Çalışmayan "yakında" seçeneği gösterilmez.
- Oyna ekranında tek kutu öne çıkar (`hotTile`).
- Karşılama ekranı sözü anlatmaz, yaşatır: sarı kelimeye dokun, anlamı çıksın.
- Kullanıcının metni ve cümleleri telefondan çıkmaz (`ctx-<dil>` yerel kayıt).

## Android WebView tuzağı
Yarı saydam kenar rengi + yuvarlak köşe ve kutularda `opacity`, kaydırırken hayalet görüntü bırakıyor (emülatörde görülüp doğrulandı). Kenar renkleri opak token olmalı; testi `dev/tests/hesap.test.js` içinde.

## Herkes anlasın (12'den 50'ye)
- Görünen metinde oyun jargonu yok: "XP" yerine "puan", düğmede "seans" yerine yapılacak iş ("24 kelimeyi tekrar et"). Testi var.
- İlk açılış: karşılama → dil → ilk kelime kartı. Araya soru ekranı konmaz.
- Bir ekranda en çok üç ana seçenek; fazlası başlık altında gruplanır ya da bağlantı olur. Çalışmayan ya da hazır olmayan seçenek gösterilmez.
- Açıklama metni en az 15 px, etiket en az 13 px. Dokunma hedefi 44 px ve üstü.
- Kaydırma yönü her yerde aynı: sağa bildim, sola tekrar. Her kaydırmanın düğme karşılığı var.
- Ana ekranda yalnızca hafta şeridi ve "artık bildiğin kelime" sayısı; puan ve seviye Ben'de.
- Mağazada hedef kitle 13+; çocuksu görsel yok. Ayrıntı: `dev/ARASTIRMA.md`.

## Logo (25 Kasım 2026)
Proje sahibi seçti. İki parça:
- **Simge, "Delikli bilet":** perde bordosu zeminde hafif eğik sarı bilet; "Cv" biletten oyulmuş, kesik alt çizgi aynı zamanda yırtma çizgisi. Android simgesi, açılış ekranı, mağaza simgesi ve kapak görseli. Kaynak: `dev/tasarim/logo/cinevocab-simge.svg`.
- Uygulamanın üst şeridinde de **bilet** durur (zeminsiz): `www/index.html` içindeki `#i-logo` ve `#cvdelik` maskesi; rengi `.logo` üzerindeki `--lc` (koyuda sarı, açık temada bordo). Proje sahibi üst şeritte de bileti istedi.
- **İşaret, "Altı çizili Cv":** krem C, sarı v, altında dört parçalı kesik çizgi. Yalnızca biletin sığmayacağı çok dar yerler için yedek. Kaynak: `dev/tasarim/logo/cinevocab-isaret.svg`.
- PNG üretimi: `dev/tasarim/logo/disari.html` (`?v=simge|kare|on|acilis|bordocv`). Android uyarlanır simgenin zemini düz `#7E1626`.
- Mağaza denemesi için ikinci seçenek hazır: `store/deneme/icon-512-bordo-cv.png` (bordo zeminde sade Cv). Play Console'daki mağaza girişi denemesiyle karşılaştırılacak.
- Satır içi SVG'de dıştaki kutu `0 0`'dan başlamalı; yoksa C kırpılır (bir kez oldu).
- Elenen öneriler kayıt olarak duruyor: `dev/tasarim/logo/oneriler.png`, `tur2.png`, `tur3.png`, `tur4.png`.

## Dublaj (25 Kasım 2026)
Eşleştirme oyunu: koyu kutu kelime, krem kutu anlamı; doğru çift patlar, üstündekiler düşer, yukarıdan yeni çift gelir. Türün hissi var, başka bir oyunun adı, görseli ya da karakteri yok.
- Can, enerji, süre baskısı yok. Her eşleşme aralıklı tekrara işlenir: dopamin öğrenmeye bağlı.
- Kelimeler kullanıcının kendi listesinden gelir; dil çiftinden bağımsızdır. Aynı anlam bir turda iki kez gelmez.
- Oyna ekranında bir seçenektir; uygulamanın tamamı oyuna çevrilmez (yetişkinlerin "çocuk oyunu" şikayeti: `dev/ARASTIRMA.md`).
- Dizi ya da platform adıyla hazır paket yok: altyazı telifli. Türe göre paketler (polisiye, hastane...) sunucudan gelebilir.
