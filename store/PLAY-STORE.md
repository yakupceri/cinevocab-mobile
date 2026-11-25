# Play Store paketi (CineVocab)

Bu klasördeki her şey Play Console'a girilecek hazır malzeme. Metinleri kopyala, görselleri yükle.

## Görseller
- Uygulama simgesi (512x512): `icon-512.png`
- Öne çıkan görsel (1024x500): `feature-tr.png`, `feature-en.png`
- Telefon ekran görüntüleri (1080x1920, 7 adet): `ekran-tr/`, `ekran-en/` (karşılama, ana, kelime kartı, soru, ekle, sonuç, oyna)
- Hepsi `sh dev/ekran/magaza.sh` ile misafir modundan üretilir: örnek kelimeler, kişisel veri yok. Tasarım değişince yeniden çalıştır.
- Görseller çocuksu değil; hedef kitle 13+ (aşağıda).
- **Simge denemesi:** yayından sonra Play Console → Mağaza girişi denemeleri ile `icon-512.png` (delikli bilet) ile `deneme/icon-512-bordo-cv.png` (bordo zeminde sade Cv) karşılaştırılacak; hangisi daha çok indirme getirirse o kalır.

## Mağaza metni: Türkçe (tr-TR)
**Uygulama adı (30 karakter sınırı):** CineVocab: Dizinden Kelime

**Kısa açıklama (80 karakter sınırı):** İzlediğin dizinin ve okuduğun metnin kelimelerini öğren. Reklam yok, can yok.

**Tam açıklama:**
CineVocab herkese aynı kursu vermez. Senin izlediğin dizinin, okuduğun yazının kelimelerini alır, geçtiği cümleyle birlikte sana öğretir.

Kelimeler nereden gelir?
• Altyazıyı ya da bir metni yapıştır; bilmediğin kelimeleri biz çıkarırız.
• Başka bir uygulamada metin seç, Paylaş → CineVocab de.
• Televizyondaki ya da telefondaki altyazının fotoğrafını çek; yazı telefonunda okunur.
• Bilgisayarda CineVocab Chrome eklentisini kullanıyorsan izlerken topladığın kelimeler burada kendiliğinden görünür.
• Elinde bir şey yoksa hazır setlerle başla.

Günde birkaç dakika
• Kartlar ve kelime akışı: kelimeyi gör, bildiysen sağa kaydır.
• Altyazıyı tamamla: sahneden bir cümle, bir kelime eksik.
• Test: dört şıktan doğru anlamı seç.
• Günün bulmacası ve günlük meydan okuma: bugün herkes aynı kelimeleri çözer.
Hangi kelimenin ne zaman tekrar edileceğini uygulama takip eder; sen yalnızca oynarsın.

Sakin bir uygulama
• Reklam yok, can ya da enerji yok, bekleme yok.
• "Serini kaybedeceksin" baskısı yok. İstersen akşam tek bir hatırlatma gelir, oynadığın gün gelmez.
• Koyu ve açık görünüm. Telefonunun büyük yazı ayarına uyar.

Arkadaşlarınla
• Düello: oda kur, kodu paylaş, aynı soruları aynı anda cevaplayın.
• Ligler: arkadaş grubunla haftalık sıralama.

Gizlilik
• Yapıştırdığın metnin kendisi ve çektiğin fotoğraf sunucumuza gönderilmez. Sunucuya metinden çıkan kelime listesi ve verdiğin başlık gider.
• Hesabını ve bütün verilerini uygulamanın içinden istediğin an silebilirsin.

16 dilde kelime öğrenebilirsin: İngilizce, Türkçe, Almanca, Fransızca, İspanyolca, İtalyanca, Portekizce, Rusça, Arapça, Rumence, Japonca, Hintçe, Endonezce, Lehçe, Felemenkçe, Korece. Fotoğraftan okuma şimdilik Latin harfli dillerde çalışır.

CineVocab bağımsız bir uygulamadır; YouTube ya da Google ile bağlantılı değildir.

## Store listing: English (en-US)
**App name (30 character limit):** CineVocab: Words You Watch

**Short description (80 character limit):** Learn the words from the shows you watch and the texts you read. No ads.

**Full description:**
CineVocab does not hand everyone the same course. It takes the words from your own shows and reading, and teaches them to you with the line they came from.

Where do the words come from?
• Paste subtitles or any text; we pull out the words you do not know.
• Select text in another app and tap Share → CineVocab.
• Take a photo of the subtitles on your TV or phone; the text is read on your phone.
• If you use the CineVocab Chrome extension on your computer, the words you collect while watching show up here by themselves.
• Nothing at hand? Start with a ready-made set.

A few minutes a day
• Flashcards and word flow: see the word, swipe right if you knew it.
• Finish the line: a line from a scene with one word missing.
• Quiz: pick the meaning from four choices.
• Daily puzzle and daily challenge: everyone solves the same words today.
The app keeps track of which word is due for review; you just play.

A calm app
• No ads, no hearts or energy, no waiting.
• No "you will lose your streak" pressure. If you want, one quiet evening reminder, skipped on days you already played.
• Dark and light look. Follows your phone's large text setting.

With friends
• Duel: open a room, share the code, answer the same questions at the same time.
• Leagues: a weekly ranking with your group.

Privacy
• The text you paste and the photos you take are not sent to our server. What is sent is the list of words found in it and the title you give it.
• Delete your account and all your data from inside the app at any time.

Learn words in 16 languages: English, Turkish, German, French, Spanish, Italian, Portuguese, Russian, Arabic, Romanian, Japanese, Hindi, Indonesian, Polish, Dutch, Korean. Reading from photos works for Latin-script languages for now.

CineVocab is an independent app and is not affiliated with YouTube or Google.

## Play Console'da doldurulacaklar
- **Kategori:** Eğitim. **Etiketler:** Dil öğrenme, Kelime.
- **Gizlilik politikası adresi:** https://cinevocab.up.railway.app/privacy
- **Hesap silme adresi:** https://cinevocab.up.railway.app/delete-account (sunucu güncellemesi yayına girince açılır)
- **Reklam içeriyor mu:** Hayır.
- **Uygulama erişimi:** Bazı özellikler giriş ister (düello, ligler, 40 kelimeden fazlası); "Hesap açmadan dene" ile kendi metninden kelime çıkarma, kartlar ve oyunlar girişsiz açılır. İnceleme ekibi için yine de bir test hesabı aç (kullanıcı adı + parola) ve Console'a yaz.
- **Hedef kitle:** 13 yaş ve üzeri seç (çocuklara yönelik değil; öyle seçersen "Aileler" kuralları devreye girer).
- **İçerik derecelendirme anketi:** şiddet, cinsellik, kumar, uyuşturucu yok. "Kullanıcılar etkileşime giriyor mu": evet (düello ve liglerde kullanıcı adları görünür, serbest mesajlaşma yok).

### Veri güvenliği formu (Data safety)
Veri toplanıyor mu: **Evet**. Aktarım sırasında şifreleniyor mu: **Evet** (HTTPS). Kullanıcı silme isteyebiliyor mu: **Evet**.
Üçüncü taraflarla paylaşım: **Hayır** (çeviri için kelimeler çeviri servisine gider ama kimlik bilgisi gitmez; formda "hizmet sağlayıcı" sayılır, paylaşım değildir).

| Veri türü | Toplanıyor | Amaç | Zorunlu mu |
|---|---|---|---|
| Kullanıcı adı ("Kullanıcı kimlikleri") | Evet | Hesap yönetimi, uygulama işlevi | Hesap açarsan zorunlu |
| E-posta adresi | Evet | Hesap yönetimi | İsteğe bağlı; Google ile girişte Google hesabının e-postası ve kimliği gelir (sunucuda ne saklandığını `cinevocab-app` tarafında doğrula) |
| Uygulama etkinliği (kelime listesi, kaynak başlığı, oyun sonuçları) | Evet | Uygulama işlevi | Hesap açarsan zorunlu |
| Cihaz ya da diğer kimlikler (kurulum kimliği; Google ML Kit kendisi yollar) | Evet | Analiz (tanılama) | Zorunlu |
| Uygulama bilgisi ve performansı, tanılama (Google ML Kit) | Evet | Analiz (tanılama) | Zorunlu |
| Fotoğraflar | Hayır (görsel telefonda okunur, sunucumuza gitmez, saklanmaz) | | |
| Yapıştırılan metnin kendisi | Hayır (telefonda kalır; yalnızca içinden çıkan kelime listesi ve başlık gider) | | |
| Hesapsız (misafir) kullanım | Yalnızca seçilen kelimeler çeviri için gider (en çok 20, oturum ve kimlik olmadan; başlık ve cümle gitmez). Kelime listesi telefonda durur, hesap açılınca hesaba taşınır | Uygulama işlevi | |
| Konum, rehber, ses, mali bilgi, sağlık, reklam kimliği | Hayır | | |

**ML Kit notu.** Görselden altyazı okuma için `com.google.mlkit:text-recognition` kullanılıyor (model uygulamayla gelir). Google'ın sayfasına göre (https://developers.google.com/ml-kit/android-data-disclosure, 14 Mayıs 2025 sürümü okundu) kütüphane şunları yollar: cihaz bilgisi, uygulama bilgisi, kurulum başına kimlik, performans ölçümleri, API ayarları, girdi ve çıktı boyutu, özellik sürümü, olay türü, hata kodları; amaç "tanılama ve kullanım analitiği", HTTPS ile, üçüncü tarafa aktarılmıyor. Sayfa görselin ya da metnin gönderilip gönderilmediğini açıkça yazmıyor ve formu nasıl dolduracağını geliştiriciye bırakıyor. Yukarıdaki iki ML Kit satırı benim yorumum; doldururken sayfayla karşılaştır. Gizlilik metnine de bir cümle gerekir (sunucu reposunda): "Görselden altyazı okuma telefonun içinde yapılır; bunun için kullanılan Google ML Kit kütüphanesi Google'a tanılama ve kullanım ölçümleri gönderir."

**İzinler** (birleşik **yayın** manifesti, 25 Kasım 2026; imzasız derleme adımından okundu). Bizim yazdıklarımız: `INTERNET`, `VIBRATE`. Eklentilerden gelenler:
- `POST_NOTIFICATIONS`, `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`: akşam hatırlatması (`@capacitor/local-notifications`). Bildirim izni yalnızca kullanıcı hatırlatmayı açınca istenir.
- `SCHEDULE_EXACT_ALARM`: aynı eklentiden geliyordu; **çıkarıldı** (manifest'te `tools:node="remove"`) ve hatırlatma `isExactNotification: false` ile kuruluyor. Böyle olmasa eklenti kullanıcıyı sistemin "Alarmlar ve hatırlatıcılar" ayar ekranına yolluyordu. Emülatörde denendi: hatırlatma izinsiz kuruldu ve bir dakika içinde geldi.
- `USE_CREDENTIALS`: Google ile giriş eklentisi (`@capgo/capacitor-social-login`). `USE_BIOMETRIC`, `USE_FINGERPRINT`: `androidx.biometric` kütüphanesinden (aynı eklentinin bağımlılığı); uygulama parmak izi ya da yüz tanıma kullanmıyor. `ACCESS_NETWORK_STATE`: Google'ın veri aktarım kütüphanesinden (`datatransport`, ML Kit'in tanılama verisini yollayan parça). Kaynaklar birleştirme raporundan okundu.
- Kurulu uygulamada görünen `ACCESS_LOCAL_NETWORK` manifest'te **yok**; emülatörün Android sürümü kendisi ekliyor.
- Kamera, depolama, fotoğraf, mikrofon, konum izni **yok**. Fotoğrafı telefonun kendi kamera uygulaması çeker (manifest'te yalnızca kamera uygulamasını görebilmek için bir `queries` girdisi var), ya da görsel sistemin fotoğraf seçicisinden ve paylaşımdan gelir.
- İmzalı `.aab` üretildikten sonra Play Console'un gösterdiği izin listesiyle bir kez karşılaştır.

**Paylaş → CineVocab** yeni izin istemez; manifest'e iki giriş eklendi (düz metin ve görsel paylaşımı alma).

**Hedef kitle 13+ kalmalı.** 12 yaşı eklemek Families Policy'yi devreye sokar; ayrıntı ve kaynaklar `dev/ARASTIRMA.md` ikinci turda. Mağaza görselleri çocuksu olmamalı.

**"Büyük yazı ayarına uyar" iddiası:** emülatörde sistem yazısı 1,3 kata çıkarılıp karşılama, ana, oyna, soru, kelime kartı ve ayarlar ekranlarına bakıldı (açık temada); yazı büyüdü, yatay taşma yok. Gerçek telefon ve daha büyük ölçek denenmedi.

Formu doldurmadan önce sunucu tarafını bir kez daha gözden geçir: sunucuda toplanan başka bir şey varsa (örneğin IP kaydı) onu da yaz.

## Sürüm 2.0 (versionCode 2): yayın adımları

Durum (25 Kasım 2026): `versionCode 2`, `versionName "2.0"`. İmzasız yayın paketi derleniyor (21,9 MB; cihaza inen kısım daha küçük). Hedef SDK 36: Play'in 31 Ağustos 2026'dan beri istediği düzey. 64 bit yerel kütüphaneler 16 KB sayfa boyutuna uygun. Play'deki önceki yükleme `versionCode 1` idi (iç test); Play Console'da daha yüksek bir numara görürsen `android/app/build.gradle` içinde ondan büyüğünü yaz.

### "Yenilikler" metni (en çok 500 karakter)
**tr-TR**
```
Yepyeni CineVocab: izlediğin dizinin kelimelerini öğren.
• Yeni tasarım: koyu ve açık görünüm, daha büyük yazılar.
• Altyazıyı ya da metni yapıştır, başka uygulamadan paylaş ya da ekranın fotoğrafını çek; kelimeler çıksın.
• Hesap açmadan kendi metninden kelime çıkarıp deneyebilirsin.
• Kelimeler geçtikleri cümleyle birlikte gelir.
• Akşam hatırlatması sakinleşti: günde en çok bir kez, oynadığın gün gelmez.
```
**en-US**
```
An all-new CineVocab: learn the words from what you watch.
• New design with dark and light looks and larger text.
• Paste subtitles or text, share from another app, or photograph the screen; we pull out the words.
• Try it with your own text without creating an account.
• Words come with the line they appeared in.
• A calmer evening reminder: once a day at most, skipped on days you played.
```

### Sırayla
1. **Gerçek telefonda dene** (`DEVAM.md` → Doğrulanmayanlar). En azından: kendi metninden kelime ekleme, fotoğraftan okuma, bir oyun, akşam hatırlatmasını açma.
2. **Gizlilik metnini güncelle** (site reposu): görselden okuma ve Google ML Kit cümlesi (taslağı yukarıda). Play, veri güvenliği formuyla gizlilik metninin tutarlı olmasını ister; önce bu yayında olmalı.
3. **İmzalı paketi üret** (Android Studio; anahtar dosyasına yalnızca sen dokunursun):
   `cd ~/cinevocab-mobile && npx cap sync android && npx cap open android` → Build → Generate Signed App Bundle / APK → Android App Bundle → ilk yüklemede kullandığın aynı anahtar deposu ve takma ad → `release` → çıkan `.aab` dosyası `android/app/release/` altında olur. Farklı bir anahtarla imzalarsan Play yüklemeyi reddeder.
4. **Önce iç teste yükle:** Play Console → Test → Dahili test → Yeni sürüm oluştur → `.aab` yükle → "Yenilikler" metnini yapıştır → kaydet ve yayınla. Kendi telefonuna Play'den kur, bir kez daha dene.
5. **Mağaza girişini güncelle** (Büyüme → Mağaza varlığı → Ana mağaza girişi): uygulama adı, kısa ve tam açıklama (yukarıda), simge `icon-512.png`, öne çıkan görsel `feature-tr.png` / `feature-en.png`, ekran görüntüleri `ekran-tr/` ve `ekran-en/` (7'şer).
6. **Uygulama içeriği** (Politika → Uygulama içeriği): veri güvenliği formunu yukarıdaki tabloya göre güncelle (ML Kit satırları yeni); hedef kitle 13+; uygulama erişimi beyanı.
7. **Üretime ya da kapalı teste taşı.** Hesabın yeni kişisel hesapsa Play üretim öncesi kapalı test isteyebilir (12 test kullanıcısı, 14 gün); Console'da "Üretim" sekmesi ne istediğini gösterir.
8. **Yayından sonra:** Mağaza girişi denemeleriyle iki simgeyi karşılaştır (`icon-512.png` ve `deneme/icon-512-bordo-cv.png`).

## Eski yayın sırası (ilk sürüm için yazılmıştı)

1. Uygulamayı emülatörde dene, hataları bildir.
2. Sunucu güncellemesini yayına al (hesap silme sayfası ve bulmaca).
3. Play Console hesabı, uygulamayı oluştur, bu klasördeki metin ve görselleri gir.
4. Yayın imza anahtarı, `.aab`, kapalı test (12 kişi, 14 gün), sonra üretim başvurusu.
