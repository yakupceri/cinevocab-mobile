# Eklenti ve site için tasarım isteği: mobildeki "Gece Seansı" ile aynı kimlik

Bu dosya **`cinevocab-app` reposundaki oturum** içindir. Mobil repodan o repoya yazılmaz. Mobil repo (`~/cinevocab-mobile`) yalnızca **okunur**; oradaki hiçbir dosya değiştirilmez.

## Amaç
Chrome eklentisi (popup, video üstü çeviri kutusu, welcome sayfası) ve web sitesi, mobil uygulamayla **aynı ürün** gibi görünsün ve konuşsun. Logo da yenilendi (aşağıda). Birisi mağazadaki eklentiye, siteye ve telefondaki uygulamaya baktığında üçünün aynı marka olduğunu ilk bakışta anlamalı.

Söz her yerde aynı: **"İzlediğin dizinin kelimelerini öğren."** (EN: "Learn the words from what you watch.")

## Önce oku (mobil repoda, salt okunur)
- `~/cinevocab-mobile/.claude/tasarim/yon.md`: seçilen yön, konumlandırma, "herkes anlasın" kuralları, Android WebView tuzağı.
- `~/cinevocab-mobile/www/app.css`: baştaki `:root` ve `:root[data-theme="light"]` blokları renk token'larının **tek kaynağıdır**. Bileşen örnekleri: `.screen` ve `.subtitle` (film karesi), `.wcard` (kelime kartı), `.btn`, `.tile`, `.week` (film şeridi), `.credits` ve `.roll` (jenerik).
- `~/cinevocab-mobile/www/fonts/`: Big Shoulders Display ve Instrument Sans (ikisi de OFL; `LICENSE.txt` ve `OFL.txt` yanında).
- `~/cinevocab-mobile/dev/tasarim/ekran/uygulama/8-*.png` ve `~/cinevocab-mobile/store/ekran-tr/*.png`: uygulamanın güncel görünümü. `store/feature-tr.png`: kapak görseli.
- `~/cinevocab-mobile/dev/ARASTIRMA.md` ikinci tur: rakipler ve yaş. Mağazada hedef kitle 13+; görseller çocuksu olmamalı.

## Kimlik (özet; ayrıntı yukarıdaki dosyalarda)
- **Fikir:** koyu bir sinema salonu. Çevrilecek kelime her zaman film karesinde altyazı olarak durur. Tek vurgu altyazı sarısı. Kelime kartı krem bilet kâğıdı.
- **Renk (koyu, varsayılan):** zemin `#170E12`, yüzey `#25161C`, seçili `#321E26`, yazı `#F3E9D2`, soluk `#AC9C92`, çizgi `#3D3035`, sarı `#FFD21E`, sarı üstü yazı `#170E12`, doğru `#7BD39A`, yanlış dolgu `#C2283A`.
- **Renk (açık, isteğe bağlı):** zemin `#F1E8D6`, yüzey `#FBF6EA`, yazı `#1B0F14`, vurgu yazısı bordo `#8E1B2B`. Film karesi iki temada da koyu kalır. Sarı açık temada yalnızca dolgu olarak kullanılır, yazı olarak değil.
- **Yazı:** başlık, düğme ve büyük sayı Big Shoulders Display 800 (dar, kalın); metin Instrument Sans. Köşe 6 px, kart 10 px. Gölge ve gradyan yok (tek istisna film karesinin ışığı).
- **Dil:** oyun jargonu yok ("XP" yerine "puan"; düğme yapılacak işi söyler). Suçluluk, sahte aciliyet, emoji yok. Sade, samimi.
- **Kenar çizgileri opak** renk olmalı. Yarı saydam kenar + yuvarlak köşe Android WebView'de kaydırırken hayalet görüntü bırakıyordu; aynı CSS mobilde de açılabileceği için sitede de bu kurala uy.

## İş, sırayla (her aşamanın sonunda göster ve DUR)

### Aşama 1: Logo (seçildi; yalnızca uygula)
Logo 25 Kasım 2026'da proje sahibi tarafından seçildi. İki parçası var; yeni öneri üretme, bunları kullan.

**Simge: "Delikli bilet".** Perde bordosu zeminde, hafif eğik sarı bir bilet. "Cv" harfleri biletten oyulmuş; altındaki kesik çizgi aynı zamanda biletin yırtma çizgisi. Kullanıldığı yer: eklenti simgesi (araç çubuğu, mağaza), favicon, sosyal paylaşım görseli, sitenin açılış sayfasındaki büyük logo.

**Başlıklarda da bilet.** Popup başlığında ve site başlığında bilet zeminsiz kullanılır: koyu zeminde sarı bilet, açık zeminde bordo (`#8E1B2B`) bilet; Cv ve yırtma çizgisi biletten oyuludur (arkadaki zemin görünür). Mobil uygulamanın üst şeridi böyle; örneği `~/cinevocab-mobile/www/index.html` içindeki `#i-logo` ve `#cvdelik`.

**Yedek işaret: "Altı çizili Cv".** Krem C, sarı v, altında dört parçalı sarı kesik çizgi. Yalnızca biletin okunmayacağı kadar dar yerlerde (ör. video üstü kutunun küçük etiketi).

- Kaynak dosyalar (salt okunur): `~/cinevocab-mobile/dev/tasarim/logo/`
  - `cinevocab-simge.svg`: simge (bordo kare + bilet). Harfler çizimdir, yazı tipi gerekmez.
  - `simge-16.png`, `-32`, `-48`, `-128`, `-512`: simgenin hazır PNG'leri. Eklenti için 16, 32, 48, 128 doğrudan kullanılabilir.
  - `cinevocab-isaret.svg`: işaret (zeminsiz Cv).
  - `secilen.png`: nasıl göründüğü (simge, kapak görseli, uygulama ekranı, açılış, küçük boyutlar).
- Renkler. Simge: zemin `#A51E33` → `#5E0F1D` (düz renk gerekirse `#7E1626`), bilet `#FFD21E`. İşaret: koyu zeminde C `#F3E9D2`, v ve çizgi `#FFD21E`; açık zeminde C `#1B0F14`, v ve çizgi `#8E1B2B`.
- Oranları, eğimi, harf aralığını ve çizgi sayısını değiştirme. Simgeye gölge, parlama ya da çerçeve ekleme.
- 16 pikselde simgedeki harfler küçülür; orada "sarı bilet" olarak okunması yeterlidir. Okunmuyorsa ekran görüntüsüyle göster, kendi başına sadeleştirme.
- Eski "Cv" yazılı siyah bilet her yerden kalkar: `extension/icons/`, popup başlığı, welcome, site başlığı, favicon, sosyal paylaşım görseli.
- Dosyaları bu repoya **kopyala** (`docs/marka/` ve gereken yerlere); mobil repodaki dosyalara bağlantı verme.
- SVG'yi satır içi kullanırken dıştaki `<svg>` kutusunu `0 0`'dan başlat ya da doğrudan dosyadaki `viewBox`'ı kullan; mobilde bir kez yanlış kutu yüzünden C harfi kırpılmıştı. Simge SVG'sinde `mask` ve `radialGradient` kimlikleri var (`cvdelik`, `cvbordo`); aynı sayfaya iki kez gömersen kimlik çakışmasına dikkat et.
- Eklenti simgesi değiştiği için Chrome Web Store yeniden inceleme yapar: raporda söyle ve yüklemeden önce proje sahibine sor.

### Aşama 2: Plan (sonra dur)
`extension/popup.html`, `extension/content.js` (kutunun gölge kök CSS'i), `extension/welcome.html`, `templates/` (özellikle `landing.html`, `index.html`, `learn.html`, `game.html`, `daily.html`, `profile.html`, `theme.css`) ve `static/app.css` dosyalarını oku. Sonra kısa bir plan çıkar: hangi yüzey, hangi sırayla, her biri için ne değişiyor, hangi dosyalar, risk. Göster ve DUR.

Önerilen sıra: (a) ortak token ve yazı tipleri, (b) eklenti popup, (c) video üstü kutu, (d) welcome, (e) sitenin açılış sayfası, (f) sitenin iç sayfaları.

### Aşama 3: Uygula (onaydan sonra, yüzey yüzey)
Her yüzey bitince: koyu ve açık ekran görüntüsü, testler, sonra göster.

## Bu projenin değişmez kuralları (kendi ajan dosyalarından)
- **Push = site canlıda yeniden yayınlanır.** Proje sahibi görmeden push yok. Site dosyaları (`templates/`, `static/`, `*.py`) için önce onay.
- **Eklentide yeni izin yok.** `manifest.json` izinlerine dokunma.
- **Uzaktan kod, harici yazı tipi, harici görsel yok.** Yazı tipleri `extension/fonts/` içinde yerel; yeni yazı tipleri oraya lisans dosyasıyla birlikte kopyalanır. Site için de yerel sun.
- İçerik betiğinde `innerHTML` yok (YouTube Trusted Types). DOM `createElement` ile kurulur.
- Video üstü kutu gölge kökte çizilir; hareketli videonun üstünde **okunaklılık her şeyden önce gelir**. Kontrast, arka plan opaklığı ve yazı boyutu ayarlanabilir kalmalı. Bu kutuda dar başlık yazı tipini çeviri metni için kullanma; yalnızca etiketlerde.
- Popup sabit 380x584.
- 16 dil: metinler uzayabilir (Almanca, Rusça), Arapça sağdan sola. Big Shoulders ve Instrument Sans yalnızca Latin (ve Latin Extended) içerir; Kiril, Arapça, Japonca, Korece, Hintçe için sistem yazı tipine düşüşü dene ve ekran görüntüsüyle göster.
- Mağaza başlığında ve kısa açıklamada marka adı (YouTube, Netflix, Prime, Udemy) yok; kısa açıklama en çok 132 karakter.
- Klavye odağı görünür, `prefers-reduced-motion` saygı görür.
- Görmediğin şeye "doğru görünüyor" deme. Ekran görüntüsü alınmadıysa yaz.
- Ekran görüntülerinde gerçek hesap adı, e-posta ya da kişisel veri olmayacak (depo herkese açık). Denemede gerçek hesap kullanma.

## Mobilden farklı kalması gerekenler
- Video üstü kutu mobildeki hiçbir ekrana benzemek zorunda değil; kimliği renk, vurgu ve köşe ölçüsünden alır, okunaklılıktan ödün vermez.
- Sitede mobilin alt menüsü yok; geniş ekranda tek sütuna sıkıştırma, ama aynı hiyerarşiyi koru (bir ekranda tek sarı ana düğme).
- Site açılış sayfasının ilk ekranı mobildeki karşılama sahnesinin aynısı olabilir: bir film karesi, sarı kelimeye tıkla, anlamı çıksın. Söz anlatılmaz, yaşatılır.

## Bitince rapor
Tek tablo: yüzey, değişen dosyalar, ekran görüntüsü yolu, test çıktısı, mağaza incelemesi tetikler mi (evet/hayır), push edildi mi. Ayrıca: eklenmesi gereken metin anahtarları ve hangi dillerde eksik kaldığı.
