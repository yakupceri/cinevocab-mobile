# CineVocab mobil: kaldığımız yer (24 Kasım 2026, gece)

Yeni bir sohbette: "~/cinevocab-mobile/DEVAM.md dosyasını oku, kaldığımız yerden devam edelim" de.

## Çalışma kuralları
- Türkçe, kısa, samimi ("kanka").
- Her anlamlı adımdan sonra commit ve push yapılır (Türkçe kısa mesaj). Push'tan önce `sh dev/sir-tara.sh`; bir şey bulursa push edilmez, sahibine söylenir.
- `.jks`, keystore, şifre, token, API anahtarı hiçbir dosyaya yazılmaz, okunmaz, istenmez.
- Depo **herkese açık**. Gerçek hesap adı, e-posta ya da kişisel veri görünen ekran görüntüsü commit'lenmez. Emülatör görüntüleri depoya girmez.
- Denemede gerçek hesap kullanılmaz: misafir modu ya da ayrı deneme kurulumu (`./gradlew installDebug -PdenemeEki=.deneme`). Gerçek hesaba kayıt eklenmez.
- `~/cinevocab-app` (site ve eklenti) ve başka projelere yazılmaz. Sunucudan istenenler `dev/SUNUCU-ISTEKLERI.md` içinde birikir.
- `versionCode` yayın adımında artırılır; öncesinde dokunulmaz.
- Görülmeyen şeye "çalışıyor" denmez.

## Proje
- Capacitor 8 + düz JS. `www/` (uygulama), `android/` (yerel kısım), `dev/` (testler, ekran görüntüsü düzeneği, araştırma), `store/` (Play malzemesi), `.claude/` (ajanlar, ofis).
- Paket `com.cinevocab.app`, yayın Google Play. Sunucu: https://cinevocab.up.railway.app (repo `cinevocab-app`).
- Akış: `www/` değiştir → `npx cap sync android` → Android Studio'da Run (Gradle JDK 21).
- Testler: `node --test dev/tests/` (72 test). Ekran görüntüsü: `sh dev/ekran/cek.sh`, mağaza: `sh dev/ekran/magaza.sh`.
- Ofis: `python3 .claude/ofis/serve.py` → http://127.0.0.1:8766

## Ürün
Söz: **"İzlediğin dizinin kelimelerini öğren."** Duolingo'nun yerine değil, yanına. Ayrıntı ve tasarım kuralları: `.claude/tasarim/yon.md`. Rakip ve yaş araştırması: `dev/ARASTIRMA.md`.
- Tasarım: "Gece Seansı" (koyu varsayılan, açık tema Ayarlar'dan). Mağazada hedef kitle 13+.
- Kelimeler nereden gelir: yapıştır / dosya, Paylaş → CineVocab (metin ve görsel), fotoğraftan okuma (ML Kit, cihaz içi), Chrome eklentisi (aynı hesap), hazır setler.
- Oyunlar: kartlar, kelime akışı, altyazıyı tamamla, test, bulmaca, günlük meydan okuma, düello, ligler.
- Kelimenin geçtiği cümle yalnızca telefonda saklanır (`ctx-<dil>`), sunucuya gitmez.
- Misafir modu: hesapsız deneme destesi **ve kendi metninden kelime çıkarma** (en çok 40 kelime, telefonda durur, hesap açılınca hesaba taşınır; çeviri `/translate-words` ucuna adsız gider). Ben'de yalnızca Görünüm, Titreşim ve "Giriş yap".

## Emülatörde doğrulananlar (deneme kurulumu, misafir)
İlk açılış (karşılama → dil → ilk kart), yatay kaydırma, ana ve oyna düzeni, kaydırırken hayalet görüntü olmaması, metin paylaşımı (kapalıyken ve açıkken), galeriden fotoğraf seçip okuma, kameranın izinsiz açılması, simge ve koyu açılış ekranı, 1,3 kat sistem yazısı (altı ekran, açık temada), akşam hatırlatmasının tam zamanlı alarm izni olmadan kurulup gelmesi, misafirin kendi metninden 12 kelime çıkarıp kelimeler ekranında görmesi (gerçek sunucuya adsız tek istekle).

## Doğrulanmayanlar (gerçek telefon ya da gerçek hesap ister)
- Gerçek bir televizyonun fotoğrafından okuma; başka uygulamadan görsel paylaşımı (Galeri → Paylaş → CineVocab).
- Misafirin kendi kelimelerinin hesap açınca hesaba taşınması (yalnızca testte). Giriş yapmış kullanıcıda kendi metninden kelime ekleme uçtan uca; eklenen kelimenin cümlesinin ana ekranda görünmesi.
- Ben ekranındaki puan ve seviye kartının gerçek veriyle görünümü.
- Titreşim hissi, Google ile giriş, düello ve ligler yeni tasarımda. Hatırlatmanın uygulamanın kendi düğmesinden (Ben → Akşam hatırlatması) açılması: yalnızca eklenti çağrısı denendi.

## Yayından önce
1. Yukarıdaki doğrulanmayanları gerçek telefonda dene.
2. `store/PLAY-STORE.md`: veri güvenliği formu değişti (ML Kit tanılama verisi). Gizlilik metni sunucu reposunda güncellenmeli.
3. `yayin-kontrol` ajanını çalıştır; `versionCode` artır; imzalı `.aab` (imza dosyaları depoya girmez).
4. Sunucu istekleri (`dev/SUNUCU-ISTEKLERI.md`); 8. madde sunucu değişmeden çözüldü.

## Bilinen açık konular
- GitHub, silinen eski commit'i (`da1f2c8`, içinde hesap adı görünen bir görüntü vardı) SHA ile hâlâ gösterebilir; kesin silme için GitHub Destek.
- Uygulama boyutu: yazı tanıma kütüphanesi cihaz başına yaklaşık 10 MB ekler.
- Güvenlik politikası `img-src https:` ve `script-src 'unsafe-inline'` içerir (kapak görselleri ve Capacitor köprüsü için).
- Fotoğraftan okuma yalnızca Latin harfli dillerde.
