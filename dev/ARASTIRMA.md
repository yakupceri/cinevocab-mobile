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

---

# İkinci tur: rakipler, yaş ve herkesin kullanabilmesi (24 Kasım 2026, gece)

Kaynak notu: Google Play sayfaları araçta kesik geldi, Reddit açılmadı. "Arama özeti" yazanlar yalnızca arama sonucundan, sayfa açılmadı. Trustpilot'ta LingQ (24 yorum) ve Drops (16 yorum) örneklemi çok küçük.

## Rakipler

| Rakip | İlk açılış | Kendi içeriğin | Yaş | Övgü / şikayet | Fiyat |
|---|---|---|---|---|---|
| Duolingo | Hesap sonra; hedef ve seviye sorup derse geçiyor [1] | Bulunamadı | App Store 4+ [2], Common Sense 13+ [3] | Kısa ders ve seri [2][4] / "çocuk oyunu gibi", atlanamayan animasyon, enerji ve reklam [4] | Ücretsiz + abonelik |
| Memrise | Bulunamadı | Topluluk kursları 31.03.2024'te uygulamadan çıkarıldı [5] | 4+ [6] | Kelime tekrarı, ana dili konuşan videoları / destek ve fatura sorunları [7] | Yıllık 61,99 $ [6] |
| Lingopie | Deneme için kart şart (kendi blogu) [8] | Kendi kataloğu; Netflix yalnızca tarayıcı eklentisiyle ve hatalı [9] | Bulunamadı | Tıklanabilir altyazı, gerçek diziler / habersiz yenileme, kalabalık ekran [10] | Yıllık ~72-84 $ (kaynaklar çelişiyor) |
| Language Reactor | Bulunamadı | Netflix/YouTube çift altyazı; yalnızca masaüstü Chrome, mobil yok [11] | Derece yok | Çok kaynak / karışık arayüz [12] | Ücretsiz + 5 $/ay [12] |
| AnkiDroid | Hesap şart değil ama boş açılıyor [13] | Deste dosyası; altyazıdan otomatik yok [13] | Doğrulanmadı | Tekrar algoritması, ücretsiz / dik öğrenme eğrisi (arama özeti) | Ücretsiz |
| Drops | Kayıt şart (2023) [15] | Bulunamadı | 4+ [16] | Görsel tasarım, kısa oyun [16] / yalnızca kelime, günde 5 dk sınırı [15] | ~70 $/yıl [15] |
| Busuu | Seviye testi (arama özeti) | Bulunamadı | 13+ [18] | Düzenli yapı / habersiz yıllık abonelik [19] | ~70-80 $/yıl [18] |
| LingQ | Bulunamadı | YouTube, Netflix, e-kitap; içe aktarma yalnızca ücretli (kendi blogu) [20] | Bulunamadı | Okuyarak öğrenme / fatura, zayıf çeviri [21] | ~10 $/ay [20] |
| Readlang | Bulunamadı | Kendi metnin, web okuyucu [22] | Bulunamadı | Anında çeviri / metin tanıma hataları [23] | Ücretsiz sınırlı + 6 $/ay [22] |

## Boşluklar ve bizim cevabımız
1. **Telefonda kendi altyazın yok.** Language Reactor masaüstünde kalıyor, LingQ paralı ve dolambaçlı, Lingopie'nin Netflix köprüsü hatalı. Bizde: yapıştır, paylaş, fotoğrafla.
2. **Kullanıcı içeriği geri çekiliyor.** Memrise topluluk kurslarını kaldırdı. Bizde: kullanıcının kendi getirdiği şey ürünün merkezi.
3. **Sakin, yetişkin bir orta yok.** Duolingo'ya "çocuk oyunu" şikayeti var. Bizde: animasyon az, baskı yok, oyunlar isteğe bağlı.
4. **Güçlü tekrar ile kolay başlangıç bir arada yok.** Anki boş açılıyor. Bizde: ayarsız aralıklı tekrar, ilk kart üç dokunuşta.
5. **En sık şikayet öğretim değil fatura.** İleride ücret gelirse: kartsız deneme, yenileme hatırlatması, kolay iptal.

Taklit edilmeyecekler: enerji ya da süre sınırı; kartlı deneme ve sessiz yenileme; kullanıcının içeriğini sonradan kaldırmak.

Eksik kalan: **hesapsız ilk değer.** Misafir şu an kendi metninden kelime çıkaramıyor (çeviri sunucuda hesap istiyor). `dev/SUNUCU-ISTEKLERI.md` 8. madde.

## Yaş: 12'den 50'ye
- **Mağazada hedef 13+ kalmalı.** Google Play'de 12 yaş "9-12" grubuna girer ve tek bir çocuk grubu bile Families Policy'yi devreye sokar [24]: SDK kısıtı, çocuk verisi beyanı, sosyal özelliklerde ebeveyn kontrolü, ve "uygulama yalnızca bir web sitesinin WebView'ı olamaz" şartı [25]. ABD'de 13 yaş altından veri toplamak için doğrulanabilir ebeveyn onayı gerekir (COPPA) [26]; AB'de eşik ülkeye göre 13-16 [27]. Türkiye (KVKK) için kaynak açılamadı, doğrulanmadı.
- 13+ seçince bile mağaza görselleri çocuksu olursa Google reddedebilir [24].
- Yani: uygulama 12 yaşındakinin de rahat kullanacağı kadar sade olur, ama 13 yaş altına pazarlanmaz ve ondan veri toplanmaz. Bu hukuki tavsiye değildir.
- **Ölçüler:** dokunma hedefi Android'de 48dp [28]; metin kontrastı 4,5:1 [29]; metin %200'e kadar büyütülebilmeli (WCAG 1.4.4) [30]. WebView'ın sistem yazı boyutuna uyup uymadığı belgede yok, gerçek cihazda denenmeli.

## Kaynaklar
1. https://goodux.appcues.com/blog/duolingo-user-onboarding
2. https://apps.apple.com/us/app/duolingo-language-lessons/id570060128
3. https://www.commonsensemedia.org/website-reviews/duolingo
4. https://www.trustpilot.com/review/duolingo.com
5. https://www.memrise.com/blog/changes-to-the-memrise-app
6. https://apps.apple.com/us/app/memrise-easy-language-learning/id635966718
7. https://www.trustpilot.com/review/memrise.com
8. https://lingopie.com/blog/is-lingopie-free/
9. https://www.fluentu.com/blog/reviews/lingopie-review/
10. https://www.trustpilot.com/review/lingopie.com
11. https://chromewebstore.google.com/detail/language-reactor/hoombieeljmmljlkjmnheibnpciblicm
12. https://www.mezzoguild.com/language-reactor-review/
13. https://docs.ankidroid.org/
15. https://langoly.com/drops-app-review/
16. https://apps.apple.com/us/app/drops-language-learning-games/id939540371
18. https://apps.apple.com/us/app/busuu-language-learning/id379968583
19. https://www.trustpilot.com/review/busuu.com
20. https://www.lingq.com/blog/lingq-review/
21. https://www.trustpilot.com/review/lingq.com
22. https://readlang.com/
23. https://www.alllanguageresources.com/readlang/
24. https://support.google.com/googleplay/android-developer/answer/9285070
25. https://support.google.com/googleplay/android-developer/answer/9893335
26. https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions
27. https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en
28. https://support.google.com/accessibility/android/answer/7101858
29. https://developer.android.com/guide/topics/ui/accessibility/apps
30. https://www.w3.org/TR/WCAG22/
