# Sunucudan istenecekler (mobil tasarım için)

Mobil uygulama bu verileri şu an sunucudan alamıyor. Sunucu başka repoda (`cinevocab-app`); buradan yazılmaz.
Gelene kadar uygulama bu satırları göstermez, uydurmaz.

| # | Uç nokta | İstenen | Nerede kullanılacak |
|---|---|---|---|
| 1 | `GET /api/ext/home` | `week`: son 7 günün her biri için o gün tekrar edilen kelime sayısı (kullanıcının yerel gününe göre) | Ana ekran film şeridi: karede onay işareti yerine sayı |
| 2 | `GET /api/ext/home` | `due_words`: bugün tekrar edilecek ilk 3 kelime | Ana ekran karesindeki altyazı. Şimdi listenin ilk 3 kelimesi gösteriliyor, bugünün tekrarı olduğu iddia edilmiyor |
| 3 | `POST /api/srs/report` (ve `/api/daily/answer`) | Her kelime için yeni tekrar kutusu ve sonraki tekrar günü: `items: [{w, box, next_days}]` | Cevaptan sonra "3. kutuya çıktı, bir hafta sonra tekrar soracağım" satırı; kelime kartında kutu göstergesi |
| 4 | `POST /api/srs/report` | Bu gönderimle kalıcı olan kelimelerin adları: `mastered_now: ["shallow", ...]` | Sonuç jeneriği: şimdi yalnızca sayı ("2 kelime") yazılıyor, sayı ana özetin önceki ve sonraki `mastered` farkından hesaplanıyor |
| 5 | `GET /api/vocab` | Hazır paket ve eski içe aktarma kelimeleri için `sentence` (şu an çoğunda boş) | Ana ekran karesi, kart ve soru altyazısı. Kendi metninden eklenen kelimelerin cümlesi artık telefonda saklanıyor (sunucuya gitmiyor); telefon değişince ya da çıkış yapınca kaybolur |
