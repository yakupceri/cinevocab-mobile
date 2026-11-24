# Araştırma: rakipler ve telefona özel özellikler (24 Kasım 2026)

Kaynak notu: Reddit ve Google Play sayfaları araçla açılamadı; veriler Trustpilot, App Store ve inceleme yazılarından. Rakip blogları taraflı olabilir, işaretlendi.

## Rakipler: en sevilen 3, en çok şikayet edilen 3

| Uygulama | Sevilen | Şikayet |
|---|---|---|
| Duolingo | Oyunlaştırma (seri, lig); kısa dersler; ücretsiz ve kolay. [G2](https://learn.g2.com/is-duolingo-good) | Reklam ve yavaş dolan enerji; abonelik iptali ve beklenmeyen ücret; hatalı yapay zeka içeriği ve çocuksu, vakit alan animasyonlar. [Trustpilot](https://www.trustpilot.com/review/duolingo.com) (1,5/5) |
| Memrise | Anadili konuşanların videoları; aralıklı tekrar. [Lingopie blogu, rakip](https://lingopie.com/blog/memrise-review/) Oyunlaştırılmış kelime öğrenimi. [Trustpilot](https://www.trustpilot.com/review/memrise.com) | Topluluk kursları 31 Mart 2024'te uygulamadan çıkarıldı. [Memrise](https://memrise.com/blog/changes-to-the-memrise-app) Yanıtsız destek ve iptal sonrası ücret; donma ve cümle kurdurmayan içerik. [Trustpilot](https://www.trustpilot.com/review/memrise.com) (1,6/5, 144 yorum) |
| Lingopie | Tıklanabilir altyazı; gerçek dizi ve film; oynatmayı yavaşlatma. [Trustpilot](https://www.trustpilot.com/review/lingopie.com) (4,5/5) | Beklenmeyen yenileme, zor iade (aynı kaynak). Zayıf dilbilgisi; mobilde eksik özellik ve dağınık arayüz. [FluentU, rakip](https://www.fluentu.com/blog/reviews/lingopie-review/) |
| Anki mobil | AnkiDroid ücretsiz, açık kaynak, güçlü aralıklı tekrar. [Nibble, rakip](https://nibble-app.com/blog/anki-review) Özelleştirme ve eşitleme. [Play aynası](https://grand-screen.com/apps/ankidroid-flashcards/reviews/) AnkiMobile'da reklam ve abonelik yok. [App Store](https://apps.apple.com/us/app/ankimobile-flashcards/id373493387) | Dik öğrenme eğrisi, eski arayüz, birkaç gün atlanınca biriken tekrar (Nibble). AnkiMobile 24,99 USD ve eşitleme sorunları (App Store). Deste kaybı (Play aynası, tek yorum, zayıf kanıt) |

Bize düşen ders: gerçek içerik ve bağlam seviliyor (Lingopie), aralıklı tekrar işe yarıyor (Anki, Memrise); insanları kaçıran şey baskı, çocuksu gürültü, biriken tekrar yükü ve para sürprizi.

## Telefona özel 8 özellik

Not: titreşim, paylaşma ve akşam bildirimi kodda zaten var (`www/app.js:280`, `:485`, `:500`); aşağıdakiler onları düzeltir ya da üstüne koyar.

| # | Özellik | Ne yapar | Kullanıcı hissi | İş yükü | Ölçü |
|---|---|---|---|---|---|
| 1 | Paylaş → CineVocab | Herhangi bir uygulamada seçilen metni ya da altyazı dosyasını "Paylaş" ile gönderirsin, kelimeler çıkar. YouTube'dan paylaşınca yalnızca link gelir; altyazıyı çekmek v5'te kural gereği kaldırıldı, o yüzden linkte "metni yapıştır" ekranı açılır | "Okuduğum şey dersim oldu" | Orta. `@capgo/capacitor-share-target` (MPL-2.0, Capacitor 8), manifest'e intent-filter | Paylaşımla eklenen kelime / toplam eklenen |
| 2 | Tek sakin akşam hatırlatması | Günde en çok 1 bildirim, o gün oynadıysan hiç gelmez. Metin bekleyen kelimeyi söyler ("8 kelime hazır, 3 dakika"). Şimdiki "serin bitmesin" metni kalkar. 3 gün açılmazsa kendiliğinden susar | Dürtülmüyorum, hatırlatılıyorum | Küçük. Paket kurulu | Bildirimden açılma oranı; bildirimi kapatanların oranı |
| 3 | Titreşim dili | Doğruda tek kısa tık, yanlışta iki yumuşak, kelime kalıcı olunca ayrı bir desen. Ayarlardan kapanır | Ekrana bakmadan anlıyorum | Küçük. `@capacitor/haptics` (MIT) | Titreşimi kapatanların oranı |
| 4 | Tek elle kart akışı | Kaydırmalı kartlar tam ekran, başparmak bölgesinde; kartta tekrar kutusu ve "kalıcı olmasına 2 tekrar" yazar; sonuçta kalıcı olan kelimeler adıyla listelenir | Ne öğrendiğimi görüyorum | Orta. Yalnızca `www/` | Seans tamamlama oranı; seans başına kalıcı kelime |
| 5 | Düello linki | Davet bir link olur; tıklayan uygulamada doğrudan odaya düşer, uygulama yoksa siteye | Tek dokunuşla kapışma | Orta. App Links: manifest + sunucuda `assetlinks.json` (sunucu başka repo, onay ister) | Linkten katılan / gönderilen davet |
| 6 | Kısa dönüş seansı | 3 günden fazla ara verdiysen biriken tekrar yerine 5 kelimelik seans açılır, kalanı günlere yayılır | Cezalandırılmıyorum | Küçük. `www/`, sunucu oturum boyutunu zaten veriyor mu bakılacak | 3+ gün aradan sonra 7 gün içinde dönenler |
| 7 | Bağlantısız tekrar | Günün tekrar listesi telefonda saklanır; metroda oynarsın, sonuç bağlantı gelince gider | Her yerde açılıyor | Orta. Çakışma ve çift XP testi şart | Çevrimdışı tamamlanan seans sayısı |
| 8 | Ana ekran widget'ı | Bekleyen kelime sayısı ve günün kelimesi | Uygulamayı açmadan göz ucuyla | Büyük. Yerel `AppWidgetProvider` + layout şart; köprü için `capacitor-widget-bridge` (MIT). Şimdilik öneri: sonraya | Widget ekleyenlerin 30 gün elde tutulması |

Önerim sırayla: 2, 3, 4 (küçük, hemen hissedilir), sonra 1 ve 6, sonra 5 ve 7; 8 en sona.
Hiçbirinde can, enerji, geri sayım, kaybetme korkusu yok. Uygulama paketleri yalnızca özellik onaylanınca kurulur.
