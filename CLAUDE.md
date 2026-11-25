# CineVocab mobil: çalışma kuralları

Ayrıntılı durum ve ürün notları: `DEVAM.md`. Tasarım yönü: `.claude/tasarim/yon.md`.

## Push kuralı (25 Kasım 2026'dan beri)
Dosyaları değiştirince **hemen push etme**.
- Önce yerelde testleri çalıştır: `node --test dev/tests/`
- Değişiklikleri biriktir. Yerelde commit etmek serbest (Türkçe, kısa mesaj), push etmek değil.
- **Push yalnızca proje sahibi "push et" deyince ve toplu yapılır.** "Pushla", "gönder" gibi bir söz de aynı anlama gelir; emin değilsen sor.
- Push'tan önce hangi commit'lerin gideceğini (`git log origin/main..HEAD --oneline`) ve sır taramasını (`sh dev/sir-tara.sh`; ayrıca gidecek commit'lerde anahtar, parola, token, `.jks` var mı) göster. Tarama bir şey bulursa push etme, söyle.
- Depo herkese açık: gerçek hesap adı, e-posta ya da kişisel veri görünen ekran görüntüsü commit'lenmez. Emülatör görüntüleri depoya girmez.

## Diğer kurallar
- `.jks`, keystore, şifre, token, API anahtarı hiçbir dosyaya yazılmaz, okunmaz, istenmez.
- Denemede gerçek hesap kullanılmaz: misafir modu ya da ayrı deneme kurulumu (`./gradlew installDebug -PdenemeEki=.deneme`). Gerçek hesaba kayıt eklenmez.
- `~/cinevocab-app` (site ve eklenti) ve başka projelere yazılmaz. Oradan istenenler `dev/SUNUCU-ISTEKLERI.md` ve `dev/sunucu/` altında birikir.
- `versionCode` yalnızca yayın adımında, proje sahibi yayına hazırlanırken artırılır (şu an 2).
- Görülmeyen şeye "çalışıyor" denmez.
- Türkçe, kısa, samimi ("kanka").
