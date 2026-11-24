# Sunucu için hazır yama: hesapsız çeviri kotası (madde 8)

Bu klasördeki dosyalar **sunucu reposu (`cinevocab-app`) içindir**; mobil uygulamaya girmez. Mobil repodan o repoya yazılmaz; yamayı orada uygula.

## Ne yapar
`/translate-words` hesap istemiyor (Chrome eklentisi ve mobilin misafir modu böyle çalışıyor). Bu yama, oturum açmamış bir adresin günde **yeni** çevirtebileceği kelime sayısına üst sınır koyar.

- Veritabanında hazır olan kelimeler sayılmaz ve sınırsızdır. Yalnızca ücretli çeviri servisine gidecek kelimeler sayılır.
- Kota dolunca hata dönmez: fazlası cevapta `pending` olarak gelir, hazır kelimeler dönmeye devam eder. Eklenti ve mobil bozulmaz, yalnızca yeni kelimeler o gün çevrilmez.
- Oturum açmış kullanıcı kotaya girmez.
- Varsayılan sınır: adres başına günde 400 yeni kelime. Railway'de `ANON_NEW_WORDS_DAY` ortam değişkeniyle değişir; `0` kotayı kapatır.
- Adresler yalnızca bellekte tutulur, veritabanına yazılmaz, gün (UTC) değişince silinir. Sunucu yeniden başlarsa sayaç sıfırlanır.

## Dosyalar
- `anonquota.py` → sunucu reposunun köküne (yeni dosya; yalnızca standart kütüphane).
- `test_anonquota.py` → `dev/tests/py/` altına.
- `8-hesapsiz-kota.patch` → `main.py` ve `multilang.py` için 12 satırlık değişiklik.

## Uygulama (sunucu reposunda)
```sh
cd ~/cinevocab-app
cp ~/cinevocab-mobile/dev/sunucu/anonquota.py .
cp ~/cinevocab-mobile/dev/sunucu/test_anonquota.py dev/tests/py/
git apply --check ~/cinevocab-mobile/dev/sunucu/8-hesapsiz-kota.patch && git apply ~/cinevocab-mobile/dev/sunucu/8-hesapsiz-kota.patch
PYTHONDONTWRITEBYTECODE=1 dev/.venv/bin/python -m pytest dev/tests/py -q -p no:cacheprovider
```
Yama 25 Kasım 2026'da `cinevocab-app` `1b7d187` üzerine `git apply --check` ile denendi (temiz uygulanıyor); gerçekten uygulanmadı. Push, siteyi canlıda yeniden yayınlar.

## Karar (25 Kasım 2026, proje sahibi)
Sınır **400** (yamadaki varsayılan; ayrıca ortam değişkeni gerekmez). Yamayı sunucu reposundaki oturum uygular; mobil repodan oraya yazılmaz.
Bilinen risk: eklentiyi hesapsız kullanan biri bir film boyunca 400 yeni kelimeyi aşarsa o gün yeni kelimeleri çevrilmez (hazır kelimeler dönmeye devam eder). Yayından sonra admin panelindeki hesapsız kullanım sayılarına bak; şikayet gelirse `ANON_NEW_WORDS_DAY` ile yükselt.

## Öbür oturuma verilecek istek (kopyala-yapıştır)
> `~/cinevocab-mobile/dev/sunucu/BENIOKU.md` dosyasını oku ve oradaki yamayı bu repoda uygula: `anonquota.py`'yi köke, testini `dev/tests/py/` altına kopyala, `8-hesapsiz-kota.patch`'i `git apply --check` ile deneyip uygula, testleri çalıştır. Sınır 400 olarak kararlaştırıldı (yamadaki varsayılan); değiştirme. Push etmeden önce bana göster.
